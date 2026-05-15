import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeDatabase1778862648765 implements MigrationInterface {
  name = 'ChangeDatabase1778862648765';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "action-logs" DROP COLUMN "dataOld"`);
    await queryRunner.query(`ALTER TABLE "action-logs" DROP COLUMN "dataNew"`);
    await queryRunner.query(
      `ALTER TABLE "action-logs" DROP COLUMN "description"`,
    );
    await queryRunner.query(`ALTER TABLE "action-logs" DROP COLUMN "type"`);
    await queryRunner.query(
      `ALTER TABLE "action-logs" DROP COLUMN "functionType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "action-logs" DROP COLUMN "functionId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "action-logs" ADD "functionId" character varying(36)`,
    );
    await queryRunner.query(
      `ALTER TABLE "action-logs" ADD "functionType" character varying(250)`,
    );
    await queryRunner.query(
      `ALTER TABLE "action-logs" ADD "type" character varying(36)`,
    );
    await queryRunner.query(`ALTER TABLE "action-logs" ADD "description" text`);
    await queryRunner.query(`ALTER TABLE "action-logs" ADD "dataNew" json`);
    await queryRunner.query(`ALTER TABLE "action-logs" ADD "dataOld" json`);
  }
}
