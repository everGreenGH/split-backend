import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Transaction } from "./transaction.entity";
import { SupportedNetworks } from "src/common/constants/supported-networks";
import { CoreEntity } from "./core.entity";

@Entity({ name: "Product" })
export class Product extends CoreEntity {
    @Column()
    name: string;

    @Column()
    webLink: string;

    @Column()
    twitterLink: string;

    @Column({ type: "enum", enum: SupportedNetworks, default: [SupportedNetworks.ARBITRUM] })
    network: SupportedNetworks[];

    @Column()
    description: string;

    @Column({ nullable: true })
    poolAddress: string;

    @Column({ nullable: true })
    apiKey: string;

    @Column({ default: false })
    isKeyIntegrated: boolean;

    @OneToMany(() => Transaction, (transaction) => transaction.product, { cascade: true, eager: true })
    transactions: Transaction[];

    // TODO: 와이어프레임에 따라 추가
}
