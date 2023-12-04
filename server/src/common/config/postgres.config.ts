import { DataSourceOptions } from "typeorm";
import { Product } from "../database/entities/product.entity";
import { Referral } from "../database/entities/referral.entity";
import { Role } from "../database/entities/role.entity";
import { Transaction } from "../database/entities/transaction.entity";
import { Wallet } from "../database/entities/wallet.entity";

export default () =>
    ({
        postgres: {
            type: "postgres",
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            entities: [Product, Referral, Role, Transaction, Wallet],
            migrations: [__dirname + "/../database/migrations/*.{js,ts}"],
            logging: process.env.NODE_ENV === "local",
        },
    } as { postgres: DataSourceOptions });
