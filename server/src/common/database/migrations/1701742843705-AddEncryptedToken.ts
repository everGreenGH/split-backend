import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEncryptedToken1701742843705 implements MigrationInterface {
    name = "AddEncryptedToken1701742843705";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Wallet" ADD "encryptedRefreshToken" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Wallet" DROP COLUMN "encryptedRefreshToken"`);
    }
}
