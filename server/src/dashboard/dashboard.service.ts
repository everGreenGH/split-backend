import { Injectable } from "@nestjs/common";
import { ContractFactory } from "src/common/contract/contract.factory";
import { Wallet } from "src/common/database/entities/wallet.entity";
import { CardType, GetEarnDashboardRes, ProductCard, ProductContractRes } from "./dashboard.dtos";
import { ProductService } from "src/product/product.service";
import { ReferralRepository } from "src/referral/referral.repository";

@Injectable()
export class DashboardService {
    constructor(
        private _contractFactory: ContractFactory,
        private _productService: ProductService,
        private _referralRepository: ReferralRepository,
    ) {}

    private async _getParsedProducts(productInfos: ProductContractRes[]): Promise<ProductCard[]> {
        const products: ProductCard[] = [];

        for (const productInfo of productInfos) {
            const { name: productName } = await this._productService.findProductByPoolAddress(
                productInfo.incentivePoolAddress,
            );

            const affiliateEarned = Number(productInfo.affiliateEarned);
            const affiliateClaimed = Number(productInfo.affiliateClaimed);
            const userEarned = Number(productInfo.userEarned);
            const userClaimed = Number(productInfo.userClaimed);

            if (affiliateEarned || affiliateClaimed) {
                products.push({
                    cardType: CardType.AFFILIATE,
                    cardData: {
                        productName,
                        poolAddress: productInfo.incentivePoolAddress,
                        earned: affiliateEarned,
                        claimed: affiliateClaimed,
                    },
                });
            }
            if (userEarned || userClaimed) {
                products.push({
                    cardType: CardType.USER,
                    cardData: {
                        productName,
                        poolAddress: productInfo.incentivePoolAddress,
                        eligibility: true, // FIXME: 트랜잭션 유효성 검사 넣은 후 수정
                        claimable: userEarned - userClaimed,
                    },
                });
            }
        }

        return products;
    }

    private _calculateConversion(walletConnectNum: number, transactionNum: number): number {
        if (walletConnectNum === 0) {
            return 0;
        }

        const percentage = (transactionNum / walletConnectNum) * 100;
        return parseFloat(percentage.toFixed(3));
    }

    async getEarnDashboard(wallet: Wallet): Promise<GetEarnDashboardRes> {
        const incentivePoolFactory = this._contractFactory.incentivePoolFactory();
        const res = await incentivePoolFactory.getUserDashboardData(wallet.address);

        const products = await this._getParsedProducts(res.productInfos);
        const walletConnectNum =
            (await this._referralRepository.getReferralProviderCount(wallet.address)) +
            (await this._referralRepository.getUserCount(wallet.address));

        const transactionNum = Number(res.totalTransactionNum);
        const conversion = this._calculateConversion(walletConnectNum, transactionNum);

        return {
            monthlyTotalDashboard: {
                earned: Number(res.totalEarned),
                claimed: Number(res.totalClaimed),
                productNum: Number(res.productNum),
                walletConnectNum,
                transactionNum,
                conversion,
            },
            totalDashboard: {
                earned: Number(res.totalEarned),
                claimed: Number(res.totalClaimed),
                productNum: Number(res.productNum),
                walletConnectNum,
                transactionNum: Number(res.totalTransactionNum),
                conversion,
            },
            products,
        };
    }
}
