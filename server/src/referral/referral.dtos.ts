import { IsEthereumAddress, IsNumber } from "class-validator";

export class AddReferralReq {
    @IsNumber()
    productId: number;

    @IsEthereumAddress()
    userAddress: string;

    @IsEthereumAddress()
    referralProviderAddress: string;
}

export class AddReferralRes {
    updated: boolean;
}
