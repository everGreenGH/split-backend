import { IsEthereumAddress } from "class-validator";

export class CreateWalletReq {
    @IsEthereumAddress()
    walletAddr: string;
}
