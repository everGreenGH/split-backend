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
