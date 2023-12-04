import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import postgresConfig from "./common/config/postgres.config";
import * as path from "path";
import { LoggerMiddleware } from "./common/loggers/logger.middleware";
import { Product } from "./common/database/entities/product.entity";
import { Referral } from "./common/database/entities/referral.entity";
import { Transaction } from "./common/database/entities/transaction.entity";
import { Wallet } from "./common/database/entities/wallet.entity";
import { WalletModule } from "./wallet/wallet.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [postgresConfig],
            envFilePath: path.join("env", `.${process.env.NODE_ENV}.env`),
            ignoreEnvFile: !(process.env.NODE_ENV === "local"),
        }),
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 60,
        }),
        TypeOrmModule.forRoot({
            ...postgresConfig().postgres,
        }),
        TypeOrmModule.forFeature([Product, Referral, Transaction, Wallet]),
        WalletModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
    }
}
