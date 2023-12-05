import { Module } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { Wallet } from "src/common/database/entities/wallet.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([Wallet])],
    providers: [WalletService],
    exports: [WalletService],
})
export class WalletModule {}
