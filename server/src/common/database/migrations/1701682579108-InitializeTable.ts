import { MigrationInterface, QueryRunner } from "typeorm";

export class InitializeTable1701682579108 implements MigrationInterface {
    name = "InitializeTable1701682579108";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."Transaction_txnetwork_enum" AS ENUM('Ethereum', 'Polygon', 'BNB', 'Optimism', 'Avalanche', 'Arbitrum', 'Fantom', 'Celo')`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."Transaction_incentivenetwork_enum" AS ENUM('Ethereum', 'Polygon', 'BNB', 'Optimism', 'Avalanche', 'Arbitrum', 'Fantom', 'Celo')`,
        );
        await queryRunner.query(
            `CREATE TABLE "Transaction" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, "txNetwork" "public"."Transaction_txnetwork_enum" NOT NULL DEFAULT 'Arbitrum', "targetAddress" character varying NOT NULL, "txData" character varying NOT NULL, "incentiveNetwork" "public"."Transaction_incentivenetwork_enum" NOT NULL DEFAULT 'Arbitrum', "incentiveTokenAddress" character varying NOT NULL, "incentiveTokenAmountPerTx" integer NOT NULL, "productId" integer, CONSTRAINT "PK_21eda4daffd2c60f76b81a270e9" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."Product_network_enum" AS ENUM('Ethereum', 'Polygon', 'BNB', 'Optimism', 'Avalanche', 'Arbitrum', 'Fantom', 'Celo')`,
        );
        await queryRunner.query(
            `CREATE TABLE "Product" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, "name" character varying NOT NULL, "webLink" character varying NOT NULL, "twitterLink" character varying NOT NULL, "network" "public"."Product_network_enum" NOT NULL DEFAULT 'Arbitrum', "label" character varying NOT NULL, "description" character varying NOT NULL, "poolAddress" character varying NOT NULL, "apiKey" character varying NOT NULL, "isKeyIntegrated" boolean NOT NULL, CONSTRAINT "PK_9fc040db7872192bbc26c515710" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "Wallet" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, "address" character varying NOT NULL, CONSTRAINT "UQ_8c066b0fec1381ad121b866f70f" UNIQUE ("address"), CONSTRAINT "PK_8828fa4047435abf9287ff0e89e" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "Referral" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, "referralProviderId" integer, "userId" integer, "transactionId" integer, CONSTRAINT "PK_4d5ae378fb458039dac3a4d2dfe" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "Transaction" ADD CONSTRAINT "FK_8e9cb9ace314e3424a0cd4d4d74" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "Referral" ADD CONSTRAINT "FK_eb965b99c55e6dbb332d9b4d75a" FOREIGN KEY ("referralProviderId") REFERENCES "Wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "Referral" ADD CONSTRAINT "FK_987eaf86c89f8ff2168702e886f" FOREIGN KEY ("userId") REFERENCES "Wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "Referral" ADD CONSTRAINT "FK_8e1c2fe95c2e31137e32940175c" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Referral" DROP CONSTRAINT "FK_8e1c2fe95c2e31137e32940175c"`);
        await queryRunner.query(`ALTER TABLE "Referral" DROP CONSTRAINT "FK_987eaf86c89f8ff2168702e886f"`);
        await queryRunner.query(`ALTER TABLE "Referral" DROP CONSTRAINT "FK_eb965b99c55e6dbb332d9b4d75a"`);
        await queryRunner.query(`ALTER TABLE "Transaction" DROP CONSTRAINT "FK_8e9cb9ace314e3424a0cd4d4d74"`);
        await queryRunner.query(`DROP TABLE "Referral"`);
        await queryRunner.query(`DROP TABLE "Wallet"`);
        await queryRunner.query(`DROP TABLE "Product"`);
        await queryRunner.query(`DROP TYPE "public"."Product_network_enum"`);
        await queryRunner.query(`DROP TABLE "Transaction"`);
        await queryRunner.query(`DROP TYPE "public"."Transaction_incentivenetwork_enum"`);
        await queryRunner.query(`DROP TYPE "public"."Transaction_txnetwork_enum"`);
    }
}
