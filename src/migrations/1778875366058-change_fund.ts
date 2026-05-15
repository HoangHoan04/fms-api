import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeFund1778875366058 implements MigrationInterface {
    name = 'ChangeFund1778875366058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "disbursement-confirmations" DROP CONSTRAINT "FK_afda5b87a9e9e5ba026219c1790"`);
        await queryRunner.query(`ALTER TABLE "disbursement-confirmations" DROP COLUMN "proofFileId"`);
        await queryRunner.query(`ALTER TABLE "file-archives" ADD "fundReceiptId" uuid`);
        await queryRunner.query(`ALTER TABLE "file-archives" ADD "disbursementConfirmationId" uuid`);
        await queryRunner.query(`ALTER TABLE "file-archives" ADD "disbursementConfirmation" uuid`);
        await queryRunner.query(`ALTER TABLE "file-archives" ADD CONSTRAINT "FK_5ce2d0853e2c598cf12b5d55ed6" FOREIGN KEY ("fundReceiptId") REFERENCES "fund-receipts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "file-archives" ADD CONSTRAINT "FK_4c80022a6186f8e1d022322885d" FOREIGN KEY ("disbursementConfirmation") REFERENCES "disbursement-confirmations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file-archives" DROP CONSTRAINT "FK_4c80022a6186f8e1d022322885d"`);
        await queryRunner.query(`ALTER TABLE "file-archives" DROP CONSTRAINT "FK_5ce2d0853e2c598cf12b5d55ed6"`);
        await queryRunner.query(`ALTER TABLE "file-archives" DROP COLUMN "disbursementConfirmation"`);
        await queryRunner.query(`ALTER TABLE "file-archives" DROP COLUMN "disbursementConfirmationId"`);
        await queryRunner.query(`ALTER TABLE "file-archives" DROP COLUMN "fundReceiptId"`);
        await queryRunner.query(`ALTER TABLE "disbursement-confirmations" ADD "proofFileId" uuid`);
        await queryRunner.query(`ALTER TABLE "disbursement-confirmations" ADD CONSTRAINT "FK_afda5b87a9e9e5ba026219c1790" FOREIGN KEY ("proofFileId") REFERENCES "file-archives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
