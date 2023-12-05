export interface JWTConfig {
    secret: string;
    expiredTime: string;
    refreshSecret: string;
    refreshExpiredTime: string;
}

export default () =>
    ({
        JWT: {
            secret: process.env.JWT_SECRET,
            expiredTime: process.env.JWT_EXPIRES_IN,
            refreshSecret: process.env.JWT_REFRESH_SECRET,
            refreshExpiredTime: process.env.JWT_REFRESH_EXPIRES_IN,
        },
    } as { JWT: JWTConfig });
