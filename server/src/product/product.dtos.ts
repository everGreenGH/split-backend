import { IsArray, IsEnum, IsEthereumAddress, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { SupportedNetworks } from "src/common/constants/supported-networks";

export class CreateProductReq {
    @IsString()
    name: string;

    @IsString()
    webLink: string;

    @IsString()
    twitterLink: string;

    @IsArray()
    @IsEnum(SupportedNetworks, { each: true })
    network: SupportedNetworks[];

    // @IsArray()
    // @IsString({ each: true })
    // label: string[];

    @IsString()
    description: string;

    @IsNotEmpty()
    transactions: TransactionReq[];
}

export class TransactionReq {
    @IsEnum(SupportedNetworks)
    txNetwork: SupportedNetworks;

    @IsEthereumAddress()
    targetAddress: string;

    @IsString()
    txData: string;

    @IsEnum(SupportedNetworks)
    incentiveNetwork: SupportedNetworks;

    @IsEthereumAddress()
    incentiveTokenAddress: string;

    @IsString()
    incentiveTokenAmountPerTx: string;
}
