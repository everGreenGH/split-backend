import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { ContractFactory } from "src/common/contract/contract.factory";
import { ProductModule } from "src/product/product.module";
import { ReferralModule } from "src/referral/referral.module";

@Module({
    imports: [ProductModule, ReferralModule],
    controllers: [DashboardController],
    providers: [DashboardService, ContractFactory],
})
export class DashboardModule {}
