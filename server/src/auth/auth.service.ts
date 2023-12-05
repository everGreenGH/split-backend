import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { AuthTokens, SignInReq, SignInRes, GetNonceReq, GetNonceRes, PayloadDto } from "./auth.dtos";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JWTConfig } from "src/common/config/jwt.config";
import * as bcrypt from "bcrypt";
import { WalletService } from "src/wallet/wallet.service";
import { Wallet } from "src/common/database/entities/wallet.entity";
import { SiweMessage, generateNonce } from "siwe";

@Injectable()
export class AuthService {
    constructor(
        private readonly _walletService: WalletService,
        private readonly _configService: ConfigService,
        private readonly _jwtService: JwtService,
    ) {}

    public async getNonce(req: GetNonceReq): Promise<GetNonceRes> {
        const nonce = generateNonce();
        await this._walletService.updateWallet(req.address, { nonce });
        return { nonce };
    }

    private _generateAccessToken(payload: PayloadDto): string {
        return this._jwtService.sign(payload);
    }

    private async _generateRefreshToken(payload: PayloadDto, address: string): Promise<string> {
        const refreshToken = this._jwtService.sign(payload, {
            secret: this._configService.get<JWTConfig>("JWT").refreshSecret,
            expiresIn: this._configService.get<JWTConfig>("JWT").refreshExpiredTime,
        });

        const saltOrRounds = 10;
        const hashedRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);

        await this._walletService.updateWallet(address, { encryptedRefreshToken: hashedRefreshToken });
        return refreshToken;
    }

    private async _generateTokens(wallet: Wallet): Promise<AuthTokens> {
        const payload: PayloadDto = { address: wallet.address };

        const accessToken = this._generateAccessToken(payload);
        const refreshToken = await this._generateRefreshToken(payload, wallet.address);

        return { accessToken, refreshToken };
    }

    public async signIn(query: SignInReq): Promise<SignInRes> {
        try {
            const siweMessage = new SiweMessage(query.message);
            const fields = await siweMessage.verify({ signature: query.signature });

            const address = fields.data.address;
            const wallet = await this._walletService.findWalletByAddress(address);

            if (wallet.nonce !== fields.data.nonce) {
                throw new UnauthorizedException("Invalid signature", "CONNECT_WALLET_ERROR");
            }

            const authTokens = await this._generateTokens(wallet);
            return {
                wallet,
                authTokens,
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            } else {
                throw new InternalServerErrorException("Connect wallet failed", "CONNECT_WALLET_ERROR");
            }
        }
    }

    public async refresh(refreshToken: string): Promise<string> {
        try {
            // 1차 검증
            const decodedRefreshToken = this._jwtService.verify(refreshToken, {
                secret: this._configService.get<JWTConfig>("JWT").refreshSecret,
            });
            const address = decodedRefreshToken.address;

            // 2차 검증
            const wallet = await this._walletService.findWalletByAddress(address);
            if (!wallet) {
                throw new Error();
            }
            const isRefreshTokenMatching = await bcrypt.compare(refreshToken, wallet.encryptedRefreshToken);
            if (!isRefreshTokenMatching) {
                throw new Error();
            }

            const payload: PayloadDto = { address };
            const accessToken = this._generateAccessToken(payload);
            return accessToken;
        } catch (err) {
            throw new UnauthorizedException("Invalid refresh token", "REFRESH_ERROR");
        }
    }
}
