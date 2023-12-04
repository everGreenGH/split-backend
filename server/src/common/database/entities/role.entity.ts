import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Wallet } from "./wallet.entity";

enum RoleType {
    USER = "user",
    PROVIDER = "provider",
    MERCHANT = "merchant",
    ADMIN = "admin",
}

@Entity({ name: "Role" })
export class Role {
    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ type: "enum", enum: RoleType, default: RoleType.USER })
    roleName: string;

    @OneToMany(() => Wallet, (wallet) => wallet.role)
    wallets: Wallet[];
}
