import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeAmountType1701700131551 implements MigrationInterface {
    name = "ChangeAmountType1701700131551";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Transaction" DROP COLUMN "incentiveTokenAmountPerTx"`);
        await queryRunner.query(`ALTER TABLE "Transaction" ADD "incentiveTokenAmountPerTx" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Transaction" DROP COLUMN "incentiveTokenAmountPerTx"`);
        await queryRunner.query(`ALTER TABLE "Transaction" ADD "incentiveTokenAmountPerTx" integer NOT NULL`);
    }
}
