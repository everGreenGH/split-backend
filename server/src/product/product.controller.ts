import { Controller, Get, Post, Param, HttpStatus, HttpCode, Query, UseGuards, Req, Body } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CheckPoolDeployedReq, CreateProductReq } from "./product.dtos";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam } from "@nestjs/swagger";
import { JWTGuard } from "src/common/guards/jwt.guard";
import { Request } from "express";

@Controller("product")
export class ProductController {
    constructor(private readonly _productService: ProductService) {}

    @UseGuards(JWTGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth()
    @ApiBody({ type: CreateProductReq })
    @ApiOperation({
        summary: "제품 및 트랜잭션 정보를 받아서 데이터베이스에 저장",
    })
    async createProduct(@Req() req: Request, @Body() body: CreateProductReq) {
        return this._productService.createProduct(req.wallet.address, body);
    }

    @UseGuards(JWTGuard)
    @Post("deploy")
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({
        summary: "컨트랙트 배포 후 풀 주소 정보를 업데이트하고, ApiKey를 생성하여 저장 후 반환",
    })
    async checkPoolDeployed(@Req() req: Request, @Query() query: CheckPoolDeployedReq) {
        return this._productService.checkPoolDeployed(req.wallet.address, query);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "모든 제품 정보 반환",
    })
    async findAll() {
        return this._productService.findAllProducts();
    }

    @Get(":id")
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiParam({ name: "id", required: true, description: "제품 ID" })
    @ApiOperation({
        summary: "해당 제품 ID의 제품 정보 반환",
    })
    async findProduct(@Param("id") id: string) {
        return this._productService.findProductById(+id);
    }
}
