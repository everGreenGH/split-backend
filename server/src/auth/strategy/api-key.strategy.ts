import { HeaderAPIKeyStrategy } from "passport-headerapikey";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ProductService } from "src/product/product.service";

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(HeaderAPIKeyStrategy) {
    constructor(private _productService: ProductService) {
        super({ header: "x-api-key", prefix: "" }, true, (apiKey, done) => {
            const product = this._productService.findProductByApiKey(apiKey);
            if (product) {
                return done(null, true);
            }
            return done(new UnauthorizedException({ message: "Invalid api key" }), false);
        });
    }
}
