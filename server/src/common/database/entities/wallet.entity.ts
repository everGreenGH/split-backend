import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
import { Referral } from "./referral.entity";
import { CoreEntity } from "./core.entity";

@Entity({ name: "Wallet" })
export class Wallet extends CoreEntity {
    @Column({ unique: true })
    address: string;

    @OneToMany(() => Referral, (referral) => referral.referralProvider)
    referrals: Referral[];

    @OneToMany(() => Referral, (referral) => referral.user)
    users: Referral[];
}
