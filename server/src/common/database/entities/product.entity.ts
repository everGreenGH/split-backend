import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Transaction } from "./transaction.entity";
import { SupportedNetworks } from "src/common/constants/supported-networks";

@Entity({ name: "Product" })
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    webLink: string;

    @Column()
    twitterLink: string;

    @Column({ type: "enum", enum: SupportedNetworks, default: [SupportedNetworks.ARBITRUM] })
    network: SupportedNetworks[];

    @Column()
    label: string;

    @Column()
    description: string;

    @Column()
    poolAddress: string;

    @Column()
    apiKey: string;

    @Column()
    isKeyIntegrated: boolean;

    @OneToMany(() => Transaction, (transaction) => transaction.product)
    transactions: Transaction[];
}
