import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeQrCodeMember1778860742839 implements MigrationInterface {
  name = 'ChangeQrCodeMember1778860742839';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file-archives" DROP CONSTRAINT "FK_b80b872060cc08ac8acbc6c6ec9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_bank_accounts" DROP CONSTRAINT "FK_ef84040a7f2a3468adb37767c2e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file-archives" DROP COLUMN "memberAvatarId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_bank_accounts" DROP COLUMN "fileArchivalId"`,
    );
    await queryRunner.query(`ALTER TABLE "file-archives" ADD "memberId" uuid`);
    await queryRunner.query(`ALTER TABLE "file-archives" ADD "qrCodeId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "file-archives" ADD CONSTRAINT "FK_b2fed5bffd35e483df20eb4639e" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "file-archives" ADD CONSTRAINT "FK_cbfebbaacd1a0f1e0e2c843e89b" FOREIGN KEY ("qrCodeId") REFERENCES "member_bank_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file-archives" DROP CONSTRAINT "FK_cbfebbaacd1a0f1e0e2c843e89b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file-archives" DROP CONSTRAINT "FK_b2fed5bffd35e483df20eb4639e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file-archives" DROP COLUMN "qrCodeId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file-archives" DROP COLUMN "memberId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_bank_accounts" ADD "fileArchivalId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "file-archives" ADD "memberAvatarId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_bank_accounts" ADD CONSTRAINT "FK_ef84040a7f2a3468adb37767c2e" FOREIGN KEY ("fileArchivalId") REFERENCES "file-archives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "file-archives" ADD CONSTRAINT "FK_b80b872060cc08ac8acbc6c6ec9" FOREIGN KEY ("memberAvatarId") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
