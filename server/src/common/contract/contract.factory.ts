import { Injectable } from "@nestjs/common";
import { IncentivePoolFactory, TestToken } from "../../../../contract/typechain-types";
import { IncentivePoolFactory__factory } from "../../../../contract/typechain-types/factories/IncentivePoolFactory__factory";
import { TestToken__factory } from "../../../../contract/typechain-types/factories/TestToken__factory";
import { provider } from "./contract.provider";

@Injectable()
export class ContractFactory {
    private _incentivePoolFactory: IncentivePoolFactory;
    private _testUSDC: TestToken;

    constructor() {
        this._incentivePoolFactory = IncentivePoolFactory__factory.connect(process.env.FACTORY_CONTRACT_ADDR, provider);
        this._testUSDC = TestToken__factory.connect(process.env.USDC_CONTRACT_ADDR, provider);
    }

    incentivePoolFactory() {
        return this._incentivePoolFactory;
    }

    testUSDC() {
        return this._testUSDC;
    }
}
