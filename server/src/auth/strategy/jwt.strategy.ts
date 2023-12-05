import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JWTConfig } from "src/common/config/jwt.config";
import { PayloadDto } from "../auth.dtos";
import { WalletService } from "src/wallet/wallet.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly _configService: ConfigService, private readonly _walletService: WalletService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: _configService.get<JWTConfig>("JWT").secret,
        });
    }

    async validate(payload: PayloadDto, done: VerifiedCallback) {
        const wallet = await this._walletService.findWalletByAddress(payload.address);
        if (!wallet) {
            return done(new UnauthorizedException({ message: "Wallet not exist" }), false);
        }
        return done(null, wallet);
    }
}
