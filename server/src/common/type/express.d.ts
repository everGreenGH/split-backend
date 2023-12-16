import { Request as Req } from "express";
import { Product } from "../database/entities/product.entity";

declare module "express" {
    interface Request extends Req {
        wallet?: {
            address?: string;
        };
        product?: Product;
    }
}
