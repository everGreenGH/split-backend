import { Body, Controller, Post } from "@nestjs/common";
import { ReferralService } from "./referral.service";
import { AddReferralReq } from "./referral.dtos";
import { ApiBody, ApiOperation } from "@nestjs/swagger";
import { SkipThrottle } from "@nestjs/throttler";

@Controller("referral")
export class ReferralController {
    constructor(private readonly _referralService: ReferralService) {}

    // TODO: API Key 기반 Guard 적용 필요
    // TODO: Response 프론트랑 맞추기
    @SkipThrottle()
    @Post()
    @ApiBody({ type: AddReferralReq })
    @ApiOperation({
        summary: "광고주 페이지에서 사용자가 지갑 연결 시 SDK가 호출하는 엔드포인트",
    })
    async addReferral(@Body() req: AddReferralReq) {
        return this._referralService.addReferral(req);
    }
}
