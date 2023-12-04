import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Wallet } from "./wallet.entity";
import { Transaction } from "./transaction.entity";

@Entity({ name: "Referral" })
export class Referral {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @ManyToOne(() => Wallet)
    referralProvider: Wallet;

    @ManyToOne(() => Wallet)
    user: Wallet;

    @ManyToOne(() => Transaction)
    transaction: Transaction;
}
