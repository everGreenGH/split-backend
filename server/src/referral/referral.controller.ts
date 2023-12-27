import { Controller, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ReferralService } from "./referral.service";
import { AddReferralReq, AddReferralRes } from "./referral.dtos";
import { ApiBasicAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { SkipThrottle } from "@nestjs/throttler";
import { ApiKeyGuard } from "src/common/guards/api-key.guard";
import { Request } from "express";
import { Product } from "src/common/database/entities/product.entity";

@Controller("referral")
export class ReferralController {
    constructor(private readonly _referralService: ReferralService) {}

    // TODO: Response 프론트랑 맞추기
    @SkipThrottle()
    @Post()
    @UseGuards(ApiKeyGuard)
    @ApiBasicAuth("api-key")
    @ApiResponse({ type: AddReferralRes })
    @ApiOperation({
        summary: "광고주 페이지에서 사용자가 지갑 연결 시 SDK가 호출하는 엔드포인트",
    })
    async addReferral(@Req() req: Request, @Query() query: AddReferralReq): Promise<AddReferralRes> {
        const product = req.user as Product;
        return this._referralService.addReferral(product, query);
    }

    // TODO: Cron, Guard 추가
    @Post("update")
    async updateReferral() {
        return this._referralService.updateReferral();
    }
}
