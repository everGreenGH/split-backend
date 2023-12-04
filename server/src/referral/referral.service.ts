import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { WalletService } from "src/wallet/wallet.service";
import { AddReferralReq } from "./referral.dtos";
import { ProductService } from "src/product/product.service";
import { ReferralRepository } from "./referral.repository";

@Injectable()
export class ReferralService {
    constructor(
        private readonly _referralRepository: ReferralRepository,
        private readonly _walletService: WalletService,
        private readonly _productService: ProductService,
    ) {}

    public async addReferral(req: AddReferralReq) {
        try {
            const product = await this._productService.findProduct(req.productId);
            if (!product) {
                throw new BadRequestException("Invalid product id", "ADD_REFERRAL_ERROR");
            }

            const existingReferral = await this._referralRepository.getExistingReferral(
                req.userAddress,
                req.referralProviderAddress,
            );

            if (existingReferral) {
                // TODO: Response 어떻게 할 것인지 프론트랑 맞추기
                throw new BadRequestException("Referral exists", "ADD_REFERRAL_ERROR");
            }

            const referralProviderWallet = await this._walletService.findWalletByAddress(req.userAddress);
            if (!referralProviderWallet) {
                throw new BadRequestException("Invalid referralProvider address", "ADD_REFERRAL_ERROR");
            }
            const { wallet: userWallet } = await this._walletService.findOrCreateWallet(req.userAddress);

            const newReferral = await this._referralRepository.createReferral({
                referralProvider: referralProviderWallet,
                user: userWallet,
                product,
            });

            return newReferral;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            } else {
                throw new InternalServerErrorException("Add referral failed", "ADD_REFERRAL_ERROR");
            }
        }
    }
}
