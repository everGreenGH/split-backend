import { IsEthereumAddress } from "class-validator";
import { Wallet } from "src/common/database/entities/wallet.entity";

export class PayloadDto {
    address: string;
}

export class AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export class GetNonceReq {
    address: string;
}

export class GetNonceRes {
    nonce: string;
}

export class SignInReq {
    message: any;
    signature: any;
}

export class SignInRes {
    wallet: Wallet;
    authTokens: AuthTokens;
}

export class RefreshReq {
    refreshToken: string;
}
