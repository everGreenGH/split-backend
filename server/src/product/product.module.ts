import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "src/common/database/entities/product.entity";
import { Transaction } from "src/common/database/entities/transaction.entity";
import { WalletModule } from "src/wallet/wallet.module";
import { ContractFactory } from "src/common/contract/contract.factory";

@Module({
    imports: [WalletModule, TypeOrmModule.forFeature([Product, Transaction])],
    controllers: [ProductController],
    providers: [ProductService, ContractFactory],
    exports: [ProductService],
})
export class ProductModule {}
