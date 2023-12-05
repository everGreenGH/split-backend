import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Res, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { SignInReq, SignInRes, GetNonceRes, GetNonceReq } from "./auth.dtos";
import { SkipThrottle } from "@nestjs/throttler";
import { ApiBody, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
    constructor(private readonly _authService: AuthService, private readonly _configService: ConfigService) {}

    @SkipThrottle()
    @Get("nonce")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: "siwe sign에 필요한 논스 생성",
    })
    async getNonce(@Query() query: GetNonceReq): Promise<GetNonceRes> {
        return this._authService.getNonce(query);
    }

    @SkipThrottle()
    @Post("sign")
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: SignInReq })
    @ApiOperation({
        summary: "클라이언트에서 지갑 서명을 받아 로그인 후, 인증 토큰을 반환",
    })
    @ApiOkResponse({ type: SignInRes, description: "회원가입 / 로그인 여부, Wallet 객체, authToken을 반환" })
    async signIn(@Body() req: SignInReq, @Res() res: Response) {
        const walletRes = await this._authService.signIn(req);

        res.setHeader("Authorization", "Bearer " + walletRes.authTokens.accessToken);
        res.setHeader("RefreshToken", "Bearer " + walletRes.authTokens.refreshToken);

        return res.json(walletRes);
    }

    // @SkipThrottle()
    // @Get("refresh")
    // @HttpCode(HttpStatus.OK)
    // async refresh(@Req() req: Request, @Res() res: Response) {
    //     try {
    //         const newAccessToken = await this._authService.refresh(req.cookies.refreshToken);
    //         res.cookie("accessToken", newAccessToken, {
    //             httpOnly: true,
    //         });
    //         return res.send();
    //     } catch (err) {
    //         res.clearCookie("accessToken");
    //         res.clearCookie("refreshToken");
    //         res.clearCookie("isLoggedIn");
    //         throw new UnauthorizedException();
    //     }
    // }
}
