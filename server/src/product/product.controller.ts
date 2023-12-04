import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductReq } from "./product.dtos";

@Controller("product")
export class ProductController {
    constructor(private readonly _productService: ProductService) {}

    @Post()
    async createProduct(@Body() req: CreateProductReq) {
        return this._productService.createProduct(req);
    }

    @Get()
    async findAll() {
        return this._productService.findAllProducts();
    }

    @Get(":id")
    async findProduct(@Param("id") id: string) {
        return this._productService.findProduct(+id);
    }
}
