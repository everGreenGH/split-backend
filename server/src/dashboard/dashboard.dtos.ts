import { BigNumber } from "ethers";

export class GetEarnDashboardRes {
    monthlyTotalDashboard: {
        earned: number;
        claimed: number;
        productNum: number;
        walletConnectNum: number;
        transactionNum: number;
        conversion: number;
    };
    totalDashboard: {
        earned: number;
        claimed: number;
        productNum: number;
        walletConnectNum: number;
        transactionNum: number;
        conversion: number;
    };
    products: ProductCard[];
}

export enum CardType {
    AFFILIATE = "affiliate",
    USER = "user",
}

export class ProductContractRes {
    incentivePoolAddress: string;
    affiliateEarned: BigNumber;
    affiliateClaimed: BigNumber;
    userEarned: BigNumber;
    userClaimed: BigNumber;
}

export class ProductCard {
    cardType: CardType;
    cardData: {
        productName: string;
        earned?: number;
        claimed?: number;
        eligibility?: boolean;
        claimable?: number;
    };
}
