import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Wallet } from "./wallet.entity";
import { Transaction } from "./transaction.entity";
import { CoreEntity } from "./core.entity";
import { Product } from "./product.entity";

@Entity({ name: "Referral" })
export class Referral extends CoreEntity {
    @ManyToOne(() => Wallet)
    referralProvider: Wallet;

    @ManyToOne(() => Wallet)
    user: Wallet;

    @ManyToOne(() => Product)
    product: Product;
}
