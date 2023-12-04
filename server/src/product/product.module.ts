import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "src/common/database/entities/product.entity";
import { Transaction } from "src/common/database/entities/transaction.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Product, Transaction])],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule {}
