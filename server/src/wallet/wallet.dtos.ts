import { IsEthereumAddress } from "class-validator";
import { Wallet } from "src/common/database/entities/wallet.entity";

export class CreateWalletReq {
    @IsEthereumAddress()
    address: string;
}

export class CreateWalletRes {
    isCreated: boolean;
    wallet: Wallet;
}
