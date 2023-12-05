import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { Product } from "src/common/database/entities/product.entity";
import { ApiKeyStrategy } from "./strategy/api-key.strategy";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductModule } from "src/product/product.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { WalletModule } from "src/wallet/wallet.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JWTConfig } from "src/common/config/jwt.config";

@Module({
    imports: [
        PassportModule,
        ProductModule,
        WalletModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<JWTConfig>("JWT").secret,
                signOptions: { expiresIn: configService.get<JWTConfig>("JWT").expiredTime },
            }),
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([Product]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, ApiKeyStrategy],
})
export class AuthModule {}
