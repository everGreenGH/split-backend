import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductReq } from "./product.dtos";
import { ApiBody, ApiOperation, ApiParam } from "@nestjs/swagger";

@Controller("product")
export class ProductController {
    constructor(private readonly _productService: ProductService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({ type: CreateProductReq })
    @ApiOperation({
        summary: "제품 및 트랜잭션 정보를 받아서 데이터베이스에 저장",
    })
    async createProduct(@Body() req: CreateProductReq) {
        return this._productService.createProduct(req);
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
