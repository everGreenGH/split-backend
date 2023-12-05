import { Entity, Column, OneToMany } from "typeorm";
import { Referral } from "./referral.entity";
import { CoreEntity } from "./core.entity";
import { Product } from "./product.entity";

@Entity({ name: "Wallet" })
export class Wallet extends CoreEntity {
    @Column({ unique: true })
    address: string;

    @Column({ nullable: true })
    nonce?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    encryptedRefreshToken?: string;

    @OneToMany(() => Referral, (referral) => referral.referralProvider)
    referrals: Referral[];

    @OneToMany(() => Referral, (referral) => referral.user)
    users: Referral[];

    @OneToMany(() => Product, (product) => product.wallet, { nullable: true })
    products?: Product[];
}
