import { Module } from "@nestjs/common";
import { ReferralController } from "./referral.controller";
import { ReferralService } from "./referral.service";
import { Referral } from "src/common/database/entities/referral.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReferralRepository } from "./referral.repository";
import { Wallet } from "src/common/database/entities/wallet.entity";
import { WalletModule } from "src/wallet/wallet.module";

@Module({
    imports: [TypeOrmModule.forFeature([Referral, Wallet]), WalletModule],
    controllers: [ReferralController],
    providers: [ReferralService, ReferralRepository],
})
export class ReferralModule {}
