import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
    Res,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { SignInReq, SignInRes, GetNonceRes, GetNonceReq, RefreshReq } from "./auth.dtos";
import { SkipThrottle } from "@nestjs/throttler";
import { ApiBasicAuth, ApiOkResponse, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ApiKeyGuard } from "src/common/guards/api-key.guard";

@SkipThrottle()
@Controller("auth")
export class AuthController {
    constructor(private readonly _authService: AuthService, private readonly _configService: ConfigService) {}

    @Get("nonce")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "SIWE 서명에 필요한 논스 생성",
    })
    async getNonce(@Query() query: GetNonceReq): Promise<GetNonceRes> {
        return this._authService.getNonce(query);
    }

    @Post("sign")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "클라이언트에서 지갑 서명을 받아 로그인 후, 인증 토큰을 반환",
    })
    @ApiOkResponse({ type: SignInRes, description: "Wallet 객체, authToken을 반환" })
    async signIn(@Body() req: SignInReq, @Res() res: Response) {
        const walletRes = await this._authService.signIn(req);

        res.setHeader("Authorization", "Bearer " + walletRes.authTokens.accessToken);
        res.setHeader("RefreshToken", "Bearer " + walletRes.authTokens.refreshToken);

        return res.json(walletRes);
    }

    @Get("refresh")
    @ApiOperation({
        summary: "AccessToken 만료 시 재발급",
    })
    @HttpCode(HttpStatus.OK)
    async refresh(@Query() query: RefreshReq, @Res() res: Response) {
        try {
            const newAccessToken = await this._authService.refresh(query.refreshToken);
            res.setHeader("Authorization", "Bearer " + newAccessToken);
            return res.send();
        } catch (error) {
            throw new UnauthorizedException();
        }
    }

    @UseGuards(ApiKeyGuard)
    @Get("sdk")
    @ApiBasicAuth("api-key")
    @ApiOperation({
        summary: "API Key 유효한지 확인, 유효할 시 true 반환",
    })
    @HttpCode(HttpStatus.OK)
    isValidApiKey() {
        return true;
    }
}
