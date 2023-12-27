import { IsEthereumAddress, IsNumber } from "class-validator";

export class AddReferralReq {
    @IsEthereumAddress()
    userAddress: string;

    @IsEthereumAddress()
    referralProviderAddress: string;
}

export class AddReferralRes {
    updated: boolean;
}

export class UpdateReferralTransactionReq {
    info: {
        incentivePoolAddress: string;
        referrals: { affiliate: string; user: string }[];
    }[];
}

export class UpdateReferralRes {
    isUpdated: boolean;
    updatedNum?: number;
}
