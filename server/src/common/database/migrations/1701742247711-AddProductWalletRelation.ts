import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductWalletRelation1701742247711 implements MigrationInterface {
    name = "AddProductWalletRelation1701742247711";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Product" ADD "walletId" integer`);
        await queryRunner.query(
            `ALTER TABLE "Product" ADD CONSTRAINT "UQ_cf6cc36396365be3f14ccf5ef17" UNIQUE ("apiKey")`,
        );
        await queryRunner.query(
            `ALTER TABLE "Product" ADD CONSTRAINT "FK_02eb61e4553846ed74bf899630a" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Product" DROP CONSTRAINT "FK_02eb61e4553846ed74bf899630a"`);
        await queryRunner.query(`ALTER TABLE "Product" DROP CONSTRAINT "UQ_cf6cc36396365be3f14ccf5ef17"`);
        await queryRunner.query(`ALTER TABLE "Product" DROP COLUMN "walletId"`);
    }
}
