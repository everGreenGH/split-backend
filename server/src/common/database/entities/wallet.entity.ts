import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
import { Role } from "./role.entity";
import { Referral } from "./referral.entity";

@Entity({ name: "Wallet" })
export class Wallet {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ unique: true })
    walletId: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Role, (role) => role.wallets)
    role: Role;

    @OneToMany(() => Referral, (referral) => referral.referralProvider)
    referrals: Referral[];

    @OneToMany(() => Referral, (referral) => referral.user)
    users: Referral[];
}
