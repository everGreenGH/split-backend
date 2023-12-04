import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateProductReq } from "./product.dtos";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "src/common/database/entities/product.entity";
import { DataSource, Repository } from "typeorm";
import { Transaction } from "src/common/database/entities/transaction.entity";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private readonly _productRepository: Repository<Product>,
        @InjectRepository(Transaction) private readonly _transactionRepository: Repository<Transaction>,
        private _dataSource: DataSource,
    ) {}

    async createProduct(req: CreateProductReq): Promise<Product> {
        try {
            const productEntity = this._productRepository.create(req);
            const newProduct = await this._productRepository.save(productEntity);
            return newProduct;
        } catch (error) {
            throw new InternalServerErrorException("Create product error", "CREATE_PRODUCT_ERROR");
        }
    }

    async findAllProducts() {
        try {
            const products = await this._productRepository.find();
            return products;
        } catch (error) {
            throw new InternalServerErrorException("Find all product error", "FIND_ALL_PRODUCT_ERROR");
        }
    }

    async findProduct(productId: number) {
        try {
            const product = await this._productRepository.findOne({ where: { id: productId } });
            return product;
        } catch (error) {
            throw new InternalServerErrorException("Find product error", "FIND_PRODUCT_ERROR");
        }
    }
}
