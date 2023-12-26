import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsUpdated1703607389627 implements MigrationInterface {
    name = "AddIsUpdated1703607389627";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Referral" ADD "isUpdated" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Referral" DROP COLUMN "isUpdated"`);
    }
}
