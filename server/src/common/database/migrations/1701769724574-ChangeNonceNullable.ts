import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeNonceNullable1701769724574 implements MigrationInterface {
    name = 'ChangeNonceNullable1701769724574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Wallet" ALTER COLUMN "nonce" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Wallet" ALTER COLUMN "nonce" SET NOT NULL`);
    }

}
