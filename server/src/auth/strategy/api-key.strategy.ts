import Strategy from "passport-headerapikey";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ProductService } from "src/product/product.service";

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, "api-key") {
    constructor(private _productService: ProductService) {
        super({ header: "api-key", prefix: "" }, true, (apiKey, done) => {
            const product = this._productService.findProductByApiKey(apiKey);
            if (!product) {
                return done(new UnauthorizedException({ message: "Invalid api key" }), false);
            }
            return done(null, true);
        });
    }
}
