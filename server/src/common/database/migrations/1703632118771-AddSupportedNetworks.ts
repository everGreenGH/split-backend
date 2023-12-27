import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSupportedNetworks1703632118771 implements MigrationInterface {
    name = "AddSupportedNetworks1703632118771";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TYPE "public"."Transaction_txnetwork_enum" RENAME TO "Transaction_txnetwork_enum_old"`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."Transaction_txnetwork_enum" AS ENUM('Ethereum', 'Polygon', 'BNB', 'Optimism', 'Viction', 'Avalanche', 'Arbitrum', 'Fantom', 'Celo')`,
        );
        await queryRunner.query(`ALTER TABLE "Transaction" ALTER COLUMN "txNetwork" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "Transaction" ALTER COLUMN "txNetwork" TYPE "public"."Transaction_txnetwork_enum" USING "txNetwork"::"text"::"public"."Transaction_txnetwork_enum"`,
        );
        await queryRunner.query(`ALTER TABLE "Transaction" ALTER COLUMN "txNetwork" SET DEFAULT 'Arbitrum'`);
        await queryRunner.query(`DROP TYPE "public"."Transaction_txnetwork_enum_old"`);
        await queryRunner.query(
            `ALTER TYPE "public"."Transaction_incentivenetwork_enum" RENAME TO "Transaction_incentivenetwork_enum_old"`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."Transaction_incentivenetwork_enum" AS ENUM('Ethereum', 'Polygon', 'BNB', 'Optimism', 'Viction', 'Avalanche', 'Arbitrum', 'Fantom', 'Celo')`,
        );
        await queryRunner.query(`ALTER TABLE "Transaction" ALTER COLUMN "incentiveNetwork" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "Transaction" ALTER COLUMN "incentiveNetwork" TYPE "public"."Transaction_incentivenetwork_enum" USING "incentiveNetwork"::"text"::"public"."Transaction_incentivenetwork_enum"`,
        );
        await queryRunner.query(`ALTER TABLE "Transaction" ALTER COLUMN "incentiveNetwork" SET DEFAULT 'Arbitrum'`);
        await queryRunner.query(`DROP TYPE "public"."Transaction_incentivenetwork_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."Product_network_enum" RENAME TO "Product_network_enum_old"`);
        await queryRunner.query(
            `CREATE TYPE "public"."Product_network_enum" AS ENUM('Ethereum', 'Polygon', 'BNB', 'Optimism', 'Viction', 'Avalanche', 'Arbitrum', 'Fantom', 'Celo')`,
        );
        await queryRunner.query(`ALTER TABLE "Product" ALTER COLUMN "network" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "Product" ALTER COLUMN "network" TYPE "public"."Product_network_enum" USING "network"::"text"::"public"."Product_network_enum"`,
        );
        await queryRunner.query(`ALTER TABLE "Product" ALTER COLUMN "network" SET DEFAULT 'Arbitrum'`);
        await queryRunner.query(`DROP TYPE "public"."Product_network_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."Product_network_enum_old" AS ENUM('Ethereum', 'Polygon', 'BNB', 'Optimism', 'Avalanche', 'Arbitrum', 'Fantom', 'Celo')`,
        );
        await queryRunner.query(`ALTER TABLE "Product" ALTER COLUMN "network" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "Product" ALTER COLUMN "network" TYPE "public"."Product_network_enum_old" USING "network"::"text"::"public"."Product_network_enum_old"`,
        );
        await queryRunner.query(`ALTER TABLE "Product" ALTER COLUMN "network" SET DEFAULT 'Arbitrum'`);
        await queryRunner.query(`DROP TYPE "public"."Product_network_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."Product_network_enum_old" RENAME TO "Product_network_enum"`);
        await queryRunner.query(
            `CREATE TYPE "public"."Transaction_incentivenetwork_enum_old" AS ENUM('Ethereum', 'Polygon', 'BNB', 'Optimism', 'Avalanche', 'Arbitrum', 'Fantom', 'Celo')`,
        );
        await queryRunner.query(`ALTER TABLE "Transaction" ALTER COLUMN "incentiveNetwork" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "Transaction" ALTER COLUMN "incentiveNetwork" TYPE "public"."Transaction_incentivenetwork_enum_old" USING "incentiveNetwork"::"text"::"public"."Transaction_incentivenetwork_enum_old"`,
        );
        await queryRunner.query(`ALTER TABLE "Transaction" ALTER COLUMN "incentiveNetwork" SET DEFAULT 'Arbitrum'`);
        await queryRunner.query(`DROP TYPE "public"."Transaction_incentivenetwork_enum"`);
        await queryRunner.query(
            `ALTER TYPE "public"."Transaction_incentivenetwork_enum_old" RENAME TO "Transaction_incentivenetwork_enum"`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."Transaction_txnetwork_enum_old" AS ENUM('Ethereum', 'Polygon', 'BNB', 'Optimism', 'Avalanche', 'Arbitrum', 'Fantom', 'Celo')`,
        );
        await queryRunner.query(`ALTER TABLE "Transaction" ALTER COLUMN "txNetwork" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "Transaction" ALTER COLUMN "txNetwork" TYPE "public"."Transaction_txnetwork_enum_old" USING "txNetwork"::"text"::"public"."Transaction_txnetwork_enum_old"`,
        );
        await queryRunner.query(`ALTER TABLE "Transaction" ALTER COLUMN "txNetwork" SET DEFAULT 'Arbitrum'`);
        await queryRunner.query(`DROP TYPE "public"."Transaction_txnetwork_enum"`);
        await queryRunner.query(
            `ALTER TYPE "public"."Transaction_txnetwork_enum_old" RENAME TO "Transaction_txnetwork_enum"`,
        );
    }
}
