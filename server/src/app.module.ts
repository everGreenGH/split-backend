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
import { ReferralModule } from "./referral/referral.module";
import { ProductModule } from "./product/product.module";
import { AuthModule } from "./auth/auth.module";
import { DashboardModule } from './dashboard/dashboard.module';
import jwtConfig from "./common/config/jwt.config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [postgresConfig, jwtConfig],
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
        ReferralModule,
        ProductModule,
        AuthModule,
        DashboardModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
    }
}
