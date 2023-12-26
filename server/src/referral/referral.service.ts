import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    ServiceUnavailableException,
} from "@nestjs/common";
import { WalletService } from "src/wallet/wallet.service";
import { AddReferralReq, AddReferralRes, UpdateReferralRes, UpdateReferralTransactionReq } from "./referral.dtos";
import { ReferralRepository } from "./referral.repository";
import { Product } from "src/common/database/entities/product.entity";
import { ContractFactory } from "src/common/contract/contract.factory";
import { wallet } from "src/common/contract/contract.provider";
import { Referral } from "src/common/database/entities/referral.entity";
import { VICTION_GAS_PRICE } from "src/common/contract/contract.constants";

@Injectable()
export class ReferralService {
    constructor(
        private readonly _referralRepository: ReferralRepository,
        private readonly _walletService: WalletService,
        private readonly _contractFactory: ContractFactory,
    ) {}

    // TODO: Response 어떻게 할 것인지 프론트랑 맞추기
    public async addReferral(product: Product, req: AddReferralReq): Promise<AddReferralRes> {
        try {
            const referralProviderIsUser = req.referralProviderAddress.toLowerCase() === req.userAddress.toLowerCase();
            if (referralProviderIsUser) {
                return { updated: false };
            }

            const existingReferral = await this._referralRepository.getExistingReferral(
                req.userAddress.toLowerCase(),
                req.referralProviderAddress.toLowerCase(),
                product.id,
            );

            if (existingReferral) {
                return { updated: false };
            }

            const referralProviderWallet = await this._walletService.findWalletByAddress(req.referralProviderAddress);
            if (!referralProviderWallet) {
                throw new BadRequestException("Invalid referralProvider address", "ADD_REFERRAL_ERROR");
            }
            const { wallet: userWallet } = await this._walletService.findOrCreateWallet(req.userAddress);

            await this._referralRepository.createReferral({
                referralProvider: referralProviderWallet,
                user: userWallet,
                product,
            });

            return { updated: true };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            } else {
                throw new InternalServerErrorException("Add referral failed", "ADD_REFERRAL_ERROR");
            }
        }
    }

    private _referralParser(unparsedReferrals: Referral[]): UpdateReferralTransactionReq {
        const parsedReferrals: UpdateReferralTransactionReq = {
            info: [],
        };

        // poolAddress를 기준으로 그룹화
        const groupedData: { [poolAddress: string]: { affiliate: string; user: string }[] } = {};

        unparsedReferrals.forEach((referral) => {
            const { referralProvider, user, product } = referral;

            const poolAddress = product.poolAddress;

            if (!groupedData[poolAddress]) {
                groupedData[poolAddress] = [];
            }

            groupedData[poolAddress].push({
                affiliate: referralProvider.address,
                user: user.address,
            });
        });

        // 그룹화된 데이터를 UpdateReferralTransactionReq 형태로 변환
        Object.keys(groupedData).forEach((poolAddress) => {
            parsedReferrals.info.push({
                incentivePoolAddress: poolAddress,
                referrals: groupedData[poolAddress],
            });
        });

        return parsedReferrals;
    }

    public async updateReferral(): Promise<UpdateReferralRes> {
        try {
            // 1. update되지 않은 Referral을 가져옴
            const notUpdatedReferrals = await this._referralRepository.getNotUpdatedReferrals();
            if (notUpdatedReferrals.length === 0) {
                return { isUpdated: false };
            }

            const factoryContract = this._contractFactory.incentivePoolFactory();
            if (factoryContract.address.length !== 42) {
                throw new NotFoundException("Contract address is uninitialized", "UPDATE_REFERRAL_ERROR");
            }

            // 2. Type parsing
            const parsedReferrals = this._referralParser(notUpdatedReferrals);

            // TODO: 트랜잭션 유효성 검사 로직 추가
            // FIXME: Transaction으로 수정 필요 (4번 실패시 3번 롤백될 수 있도록)
            // 3. DB에 업데이트 반영
            const updatedReferrals = notUpdatedReferrals.map((referral) => ({ ...referral, isUpdated: true }));
            await this._referralRepository.saveReferrals(updatedReferrals);

            // 4. Factory 컨트랙트로 업데이트 트랜잭션 실행
            const receipt = await (
                await factoryContract
                    .connect(wallet)
                    .updateIncentivePools(parsedReferrals, { gasPrice: VICTION_GAS_PRICE })
            ).wait();

            if (receipt.status !== 1) {
                throw new ServiceUnavailableException("Transaction Failed");
            }

            return {
                isUpdated: true,
                updatedNum: notUpdatedReferrals.length,
            };
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ServiceUnavailableException) {
                throw error;
            } else {
                throw new InternalServerErrorException("Update referral failed", "UPDATE_REFERRAL_ERROR");
            }
        }
    }
}
