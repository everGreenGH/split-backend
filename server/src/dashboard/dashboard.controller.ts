import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { Request } from "express";
import { JWTGuard } from "src/common/guards/jwt.guard";
import { Wallet } from "src/common/database/entities/wallet.entity";
import { GetEarnDashboardRes } from "./dashboard.dtos";

@Controller("dashboard")
export class DashboardController {
    constructor(private _dashboardService: DashboardService) {}

    @UseGuards(JWTGuard)
    @Get("earn")
    async getEarnDashboard(@Req() req: Request): Promise<GetEarnDashboardRes> {
        const wallet = req.user as Wallet;
        return this._dashboardService.getEarnDashboard(wallet);
    }
}
