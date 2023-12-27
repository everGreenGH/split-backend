import { Request as Req } from "express";
import { Product } from "../database/entities/product.entity";
import { Wallet } from "../database/entities/wallet.entity";

declare module "express" {
    interface Request extends Req {
        user?: Wallet | Product;
    }
}
