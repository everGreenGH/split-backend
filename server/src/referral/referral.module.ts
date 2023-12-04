import { Module, forwardRef } from "@nestjs/common";
import { ReferralController } from "./referral.controller";
import { ReferralService } from "./referral.service";
import { WalletService } from "src/wallet/wallet.service";
import { ProductService } from "src/product/product.service";
import { Referral } from "src/common/database/entities/referral.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReferralRepository } from "./referral.repository";
import { Wallet } from "src/common/database/entities/wallet.entity";
import { Product } from "src/common/database/entities/product.entity";
import { Transaction } from "typeorm";
import { WalletModule } from "src/wallet/wallet.module";
import { ProductModule } from "src/product/product.module";

@Module({
    imports: [TypeOrmModule.forFeature([Referral, Wallet]), WalletModule, ProductModule],
    controllers: [ReferralController],
    providers: [ReferralService, ReferralRepository],
})
export class ReferralModule {}
