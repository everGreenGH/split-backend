import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { WalletService } from "src/wallet/wallet.service";
import { AddReferralReq, AddReferralRes } from "./referral.dtos";
import { ReferralRepository } from "./referral.repository";
import { Product } from "src/common/database/entities/product.entity";

@Injectable()
export class ReferralService {
    constructor(
        private readonly _referralRepository: ReferralRepository,
        private readonly _walletService: WalletService,
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
}
