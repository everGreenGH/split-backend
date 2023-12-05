import { Controller, HttpCode, HttpStatus, Post, Query } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { CreateWalletReq, CreateWalletRes } from "./wallet.dtos";
import { ApiOkResponse, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { SkipThrottle } from "@nestjs/throttler";
import { Wallet } from "src/common/database/entities/wallet.entity";

@Controller("wallet")
export class WalletController {
    constructor(private readonly walletService: WalletService) {}

    @SkipThrottle()
    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ type: CreateWalletRes })
    @ApiOperation({
        summary: "최초 연결 시 지갑 주소를 데이터베이스에 저장, 최초 연결 아닐 시 지갑 객체 반환",
    })
    @ApiOkResponse({ type: Wallet, description: "Wallet 객체를 반환" })
    async createWallet(@Query() query: CreateWalletReq) {
        return this.walletService.findOrCreateWallet(query.address);
    }
}
