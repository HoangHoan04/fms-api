import * as bcrypt from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdmin1778851992770 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = '123@';
    const hashedPassword = await bcrypt.hash(password, 10);

    await queryRunner.query(
      `INSERT INTO "users" 
            ("id", "createdAt", "createdBy", "username", "email", "password", "refreshToken", "isActive", "isAdmin") 
            VALUES 
            (gen_random_uuid(), now(), 'system', 'admin', 'admin@example.com', '${hashedPassword}', '', true, true)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
