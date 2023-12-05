import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWalletNonce1701761047438 implements MigrationInterface {
    name = "AddWalletNonce1701761047438";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Wallet" ADD "nonce" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Wallet" DROP COLUMN "nonce"`);
    }
}
