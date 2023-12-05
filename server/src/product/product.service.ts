import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { CheckPoolDeployedReq, CreateProductReq } from "./product.dtos";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "src/common/database/entities/product.entity";
import { Repository } from "typeorm";
import { Transaction } from "src/common/database/entities/transaction.entity";
import { WalletService } from "src/wallet/wallet.service";
import * as crypto from "crypto";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private readonly _productRepository: Repository<Product>,
        @InjectRepository(Transaction) private readonly _transactionRepository: Repository<Transaction>,
        private readonly _walletService: WalletService,
    ) {}

    async createProduct(address: string, req: CreateProductReq): Promise<Product> {
        try {
            const wallet = await this._walletService.findWalletByAddress(address);
            const productEntity = this._productRepository.create({ ...req, wallet });

            const newProduct = await this._productRepository.save(productEntity);
            return newProduct;
        } catch (error) {
            throw new InternalServerErrorException("Create product error", "CREATE_PRODUCT_ERROR");
        }
    }

    private _generateApiKey(): string {
        const apiBuffer: Buffer = crypto.randomBytes(16);
        const apiKey = apiBuffer.toString("hex").slice(0, 32);
        return apiKey;
    }

    async checkPoolDeployed(address: string, req: CheckPoolDeployedReq): Promise<Product> {
        try {
            const product = await this.findProductById(req.id);
            if (address !== product.wallet.address) {
                throw new UnauthorizedException("Invalid address", "CHECK_POOL_DEPLOY_ERROR");
            }

            // TODO: 아래 로직 완성
            /*
                IncentivePoolFactory를 확인하여, 배포자 중에 product.wallet.address가 있는지 확인
                존재할 시, 아래 로직 진행
            */

            const apiKey = this._generateApiKey();
            const updatedProduct = await this._productRepository.save({
                ...product,
                poolAddress: "sample_ethereum_address",
                apiKey,
            });

            return updatedProduct;
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            } else {
                throw new InternalServerErrorException("Check pool deploy error", "CHECK_POOL_DEPLOY_ERROR");
            }
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

    async findProductById(productId: number) {
        const product = await this._productRepository.findOne({ where: { id: productId } });
        return product;
    }

    async findProductByApiKey(apiKey: string) {
        const product = await this._productRepository.findOne({ where: { apiKey } });
        return product;
    }
}
