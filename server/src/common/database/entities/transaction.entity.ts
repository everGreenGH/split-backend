import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./product.entity";
import { SupportedNetworks } from "src/common/constants/supported-networks";

@Entity({ name: "Transaction" })
export class Transaction {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ type: "enum", enum: SupportedNetworks, default: SupportedNetworks.ARBITRUM })
    txNetwork: SupportedNetworks;

    @Column()
    targetAddress: string;

    @Column()
    txData: string;

    @Column({ type: "enum", enum: SupportedNetworks, default: SupportedNetworks.ARBITRUM })
    incentiveNetwork: SupportedNetworks;

    @Column()
    incentiveTokenAddress: string;

    @Column()
    incentiveTokenAmountPerTx: number;

    @ManyToOne(() => Product, (product) => product.transactions)
    product: Product;
}
