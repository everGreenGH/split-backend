import { DataSourceOptions } from "typeorm";

export default () =>
    ({
        postgres: {
            type: "postgres",
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            entities: [],
            migrations: [__dirname + "/../database/migrations/*.{js,ts}"],
            logging: process.env.NODE_ENV === "local",
        },
    } as { postgres: DataSourceOptions });
