import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

function buildSwagger(app: INestApplication) {
    const docs = new DocumentBuilder()
        .setTitle("Split Server")
        .setDescription("Split API Descriptions")
        .setVersion("1.0")
        .build();

    const document = SwaggerModule.createDocument(app, docs);
    SwaggerModule.setup("swagger", app, document);
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    if (process.env.NODE_ENV !== "production") {
        buildSwagger(app);
    }

    // NOTE: 이후 배포시 production 구분
    app.enableCors({ origin: ["http://localhost:3000", "http://localhost:3002"], credentials: true });
    // app.use(cookieParser());

    await app.listen(8000);
}
bootstrap();
