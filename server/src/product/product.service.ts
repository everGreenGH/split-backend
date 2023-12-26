import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CheckPoolDeployedReq, CreateProductReq } from "./product.dtos";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "src/common/database/entities/product.entity";
import { Repository } from "typeorm";
import { WalletService } from "src/wallet/wallet.service";
import * as crypto from "crypto";
import { ContractFactory } from "src/common/contract/contract.factory";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private readonly _productRepository: Repository<Product>,
        private readonly _walletService: WalletService,
        private readonly _contractFactory: ContractFactory,
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

            const incentivePoolFactoryContract = this._contractFactory.incentivePoolFactory();

            const deployers = await incentivePoolFactoryContract.getDeployers();
            const poolAddress = await incentivePoolFactoryContract.deployerToIncentivePool(product.wallet.address);

            const isDeployerExist = deployers.some((deployer) => deployer.toLowerCase() === product.wallet.address);
            if (!isDeployerExist && poolAddress) {
                throw new NotFoundException("Deployer or Pool not found in contract", "CHECK_POOL_DEPLOY_ERROR");
            }

            const apiKey = this._generateApiKey();
            const updatedProduct = await this._productRepository.save({
                ...product,
                poolAddress,
                apiKey,
            });

            return updatedProduct;
        } catch (error) {
            if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
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
