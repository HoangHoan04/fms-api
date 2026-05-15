import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDatabase1778851955058 implements MigrationInterface {
  name = 'AddDatabase1778851955058';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "action-logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "createdById" character varying(250) NOT NULL, "createdByCode" character varying(250) NOT NULL, "createdByName" character varying(250) NOT NULL, "createdNote" character varying(500), "actionType" character varying(100) NOT NULL, "entityName" character varying(50) NOT NULL, "entityId" uuid NOT NULL, "oldValue" text, "newValue" text, "ipAddress" character varying(50), "userAgent" character varying(500), "description" text, "dataOld" json, "dataNew" json, "type" character varying(36), "functionType" character varying(250), "functionId" character varying(36), CONSTRAINT "PK_ffb219d8978756f5e8cfd9e7efe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_531adf52cf9e399d85c683643f" ON "action-logs" ("entityName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_Function" ON "action-logs" ("entityName", "entityId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "file-archives" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "fileName" character varying(255) NOT NULL, "fileUrl" character varying(500) NOT NULL, "fileType" character varying(50), "fileSizeBytes" bigint, "extension" character varying(10), "mimeType" character varying(100), "relatedId" uuid, "moduleType" character varying(50), "storageProvider" character varying(50), "storagePath" character varying(500), "checksum" character varying(64), "uploadedBy" uuid, "description" text, "memberAvatarId" uuid, "employeeId" uuid, CONSTRAINT "PK_2507f6ea0ec57cdd50b9c964215" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "member_bank_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "memberId" uuid NOT NULL, "bankName" character varying(100), "bankAccountNo" character varying(50), "bankAccountName" character varying(100), "fileArchivalId" uuid, CONSTRAINT "PK_d47bd84ed7da08b86ea24bb1813" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "userId" uuid, "code" character varying(50), "fullName" character varying(100), "shortName" character varying(100), "email" character varying(255), "phone" character varying(20), "gender" character varying(20), "birthday" date, "description" text, CONSTRAINT "UQ_8b08a36b59b238402b8c38d1f6f" UNIQUE ("code"), CONSTRAINT "UQ_2714af51e3f7dd42cf66eeb08d6" UNIQUE ("email"), CONSTRAINT "REL_839756572a2c38eb5a3b563126" UNIQUE ("userId"), CONSTRAINT "PK_28b53062261b996d9c99fa12404" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_8b08a36b59b238402b8c38d1f6" ON "members" ("code") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_2714af51e3f7dd42cf66eeb08d" ON "members" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "fund-receipt-documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "receiptId" uuid NOT NULL, "fileId" uuid, "documentType" character varying(50), "description" character varying(255), CONSTRAINT "PK_8d8a904bd1a88e75b364ccf9f59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "fund-receipt-approvals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "receiptId" uuid NOT NULL, "fromStatus" character varying(20), "toStatus" character varying(20) NOT NULL, "actionBy" uuid, "actionNote" text, "actionAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_c1571c86c32e280925fad5bd067" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "disbursement-confirmations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "disbursementId" uuid NOT NULL, "confirmedAt" TIMESTAMP WITH TIME ZONE, "confirmedBy" uuid, "proofFileId" uuid, "note" text, CONSTRAINT "PK_0af69cf53d6ab6c758653092d42" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "disbursements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "receiptId" uuid NOT NULL, "cycleId" uuid NOT NULL, "amount" numeric(18,2) NOT NULL, "disbursedAt" TIMESTAMP WITH TIME ZONE, "paymentMethod" character varying(50), "transactionRef" character varying(255), "proofFileId" uuid, "disbursedBy" uuid, "bankName" character varying(100), "bankAccountNo" character varying(50), "bankAccountName" character varying(100), "note" text, CONSTRAINT "PK_2f9ea0e5b8382113aaa3e51cdfa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "fund-receipts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "cycleId" uuid NOT NULL, "fundMemberId" uuid NOT NULL, "code" character varying(50) NOT NULL, "reason" text, "requestedAmount" numeric(18,2) NOT NULL, "approvedAmount" numeric(18,2), "priority" integer NOT NULL DEFAULT '0', "status" character varying(20) NOT NULL DEFAULT 'pending', "submittedAt" TIMESTAMP WITH TIME ZONE, "reviewedAt" TIMESTAMP WITH TIME ZONE, "reviewedBy" uuid, "reviewNote" text, "rejectedReason" text, "bankName" character varying(100), "bankAccountNo" character varying(50), "bankAccountName" character varying(100), CONSTRAINT "UQ_8a53cab5f2674477039ed791a23" UNIQUE ("code"), CONSTRAINT "PK_9038cb9a157e4be96b0f29cdbb9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_8a53cab5f2674477039ed791a2" ON "fund-receipts" ("code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "fund-cycle-summaries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "cycleId" uuid NOT NULL, "totalMembers" integer, "totalPaid" integer, "totalUnpaid" integer, "totalLate" integer, "amountExpected" numeric(18,2), "amountCollected" numeric(18,2), "amountDisbursed" numeric(18,2), "amountBalance" numeric(18,2), "totalRecipients" integer, "generatedAt" TIMESTAMP WITH TIME ZONE, "note" text, CONSTRAINT "PK_db7266572630718de73fb6114c3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "fund-cycles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "fundId" uuid NOT NULL, "code" character varying(50) NOT NULL, "cycleIndex" integer NOT NULL, "name" character varying(255) NOT NULL, "startDate" date, "endDate" date, "payoutDate" date, "contributionAmount" numeric(18,2) NOT NULL, "totalExpected" numeric(18,2), "totalCollected" numeric(18,2) NOT NULL DEFAULT '0', "totalPaidOut" numeric(18,2) NOT NULL DEFAULT '0', "status" character varying(20) NOT NULL DEFAULT 'open', "note" text, CONSTRAINT "UQ_b40dd74d401ba184281c040e7d0" UNIQUE ("code"), CONSTRAINT "PK_74f2f373259fbdba3d1f679ce53" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b40dd74d401ba184281c040e7d" ON "fund-cycles" ("code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "contribution-reminders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "contributionId" uuid NOT NULL, "reminderDate" TIMESTAMP WITH TIME ZONE, "channel" character varying(50), "status" character varying(20) NOT NULL DEFAULT 'pending', "sentAt" TIMESTAMP WITH TIME ZONE, "failReason" text, CONSTRAINT "PK_60c46fb3c25b17cf3e4b79b0cd1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contributions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "cycleId" uuid NOT NULL, "fundMemberId" uuid NOT NULL, "amount" numeric(18,2) NOT NULL, "requiredAmount" numeric(18,2) NOT NULL, "paidAt" TIMESTAMP WITH TIME ZONE, "dueDate" date, "paymentMethod" character varying(50), "transactionRef" character varying(255), "proofFileId" uuid, "status" character varying(20) NOT NULL DEFAULT 'pending', "isLate" boolean NOT NULL DEFAULT false, "lateDays" integer NOT NULL DEFAULT '0', "lateFee" numeric(18,2) NOT NULL DEFAULT '0', "confirmedBy" uuid, "note" text, CONSTRAINT "PK_ca2b4f39eb9e32a61278c711f79" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "member-receipt-history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "fundMemberId" uuid NOT NULL, "cycleId" uuid NOT NULL, "receiptId" uuid, "receivedAmount" numeric(18,2) NOT NULL, "receivedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2e64a49483a6cb14a7219332f3c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "fund-members" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "fundId" uuid NOT NULL, "memberId" uuid NOT NULL, "joinDate" date, "leaveDate" date, "status" character varying(20) NOT NULL DEFAULT 'active', "note" text, CONSTRAINT "PK_5b5714c2693e12eb9b1387ed433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "fund-transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "fundId" uuid NOT NULL, "cycleId" uuid, "transactionType" character varying(50) NOT NULL, "direction" character varying(10) NOT NULL, "amount" numeric(18,2) NOT NULL, "balanceBefore" numeric(18,2), "balanceAfter" numeric(18,2), "relatedId" uuid, "relatedType" character varying(50), "transactionDate" date, "description" text, "performedBy" uuid, CONSTRAINT "PK_fb5e09c93e9c53c074ec4820ac3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "funds" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "code" character varying(50) NOT NULL, "name" character varying(255) NOT NULL, "description" text, "contributionAmount" numeric(18,2) NOT NULL, "currency" character varying(10) NOT NULL DEFAULT 'VND', "cycleType" character varying(20) NOT NULL, "cycleDurationDays" integer, "maxRecipientPerCycle" integer NOT NULL DEFAULT '1', "totalMembers" integer, "status" character varying(20) NOT NULL DEFAULT 'active', "startDate" date, "endDate" date, "managedBy" uuid, CONSTRAINT "UQ_75c7a55653e339f03de7cea0e0e" UNIQUE ("code"), CONSTRAINT "PK_d785f4bb8f680f3febd40718f68" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_75c7a55653e339f03de7cea0e0" ON "funds" ("code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "templateId" uuid, "title" character varying(255) NOT NULL, "body" text, "payload" jsonb, "channel" character varying(50), "isRead" boolean NOT NULL DEFAULT false, "readAt" TIMESTAMP WITH TIME ZONE, "sentAt" TIMESTAMP WITH TIME ZONE, "failReason" text, "relatedEntityType" character varying(50), "relatedEntityId" uuid, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification-templates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "code" character varying(100) NOT NULL, "title" character varying(255) NOT NULL, "body" text, "channel" character varying(50), "eventType" character varying(100), CONSTRAINT "UQ_5f29cf0f46e8439f1a7bde5ae20" UNIQUE ("code"), CONSTRAINT "PK_b6b2ca30aebceb0385bc671d1f4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_5f29cf0f46e8439f1a7bde5ae2" ON "notification-templates" ("code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "employees" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "userId" uuid, "code" character varying(50), "fullName" character varying(100), "shortName" character varying(100), "email" character varying(255), "phone" character varying(20), "gender" character varying(20), "birthday" date, "description" text, CONSTRAINT "UQ_2f88c4dff473076e55ca2568d51" UNIQUE ("code"), CONSTRAINT "UQ_765bc1ac8967533a04c74a9f6af" UNIQUE ("email"), CONSTRAINT "REL_737991e10350d9626f592894ce" UNIQUE ("userId"), CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_2f88c4dff473076e55ca2568d5" ON "employees" ("code") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_765bc1ac8967533a04c74a9f6a" ON "employees" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "code" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "description" text, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_f6d54f95c31b73fb1bdd8e91d0c" UNIQUE ("code"), CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_f6d54f95c31b73fb1bdd8e91d0" ON "roles" ("code") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_648e3f5447f725579d7d4ffdfb" ON "roles" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "role-permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "roleId" uuid NOT NULL, "permissionId" uuid NOT NULL, CONSTRAINT "PK_74400d70b7b3c22cece90b63d67" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user-permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "permissionId" uuid NOT NULL, "grantType" character varying(10) NOT NULL, "reason" text, "grantedBy" uuid, "expiresAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_118cd45183a3a624b0b22b6aaf6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "code" character varying(100) NOT NULL, "name" character varying(255), "description" text, "module" character varying(50), "action" character varying(50), CONSTRAINT "UQ_8dad765629e83229da6feda1c1d" UNIQUE ("code"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_8dad765629e83229da6feda1c1" ON "permissions" ("code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user-roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "roleId" uuid NOT NULL, CONSTRAINT "PK_67fd48edef9676445ace51fd1c3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "verify-otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "otpCode" character varying(50) NOT NULL, "phone" character varying(50), "email" character varying(50), "sendMethod" character varying(50) NOT NULL, "dateExpired" TIMESTAMP WITH TIME ZONE, "error" text, CONSTRAINT "PK_5d319f6ca038c3a232d2c653ea9" PRIMARY KEY ("id")); COMMENT ON COLUMN "verify-otp"."otpCode" IS 'Mã otp'; COMMENT ON COLUMN "verify-otp"."phone" IS 'Số điện thoại'; COMMENT ON COLUMN "verify-otp"."email" IS 'email'; COMMENT ON COLUMN "verify-otp"."sendMethod" IS 'Phương thức gửi otp EOTPSendMethod'; COMMENT ON COLUMN "verify-otp"."dateExpired" IS 'Thời hạn mã xác thực'; COMMENT ON COLUMN "verify-otp"."error" IS 'Lỗi khi gửi (nếu có)'`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "code" character varying(50), "email" character varying(255), "username" character varying(100), "password" character varying(255) NOT NULL, "loginProvider" character varying(50), "googleId" character varying(255), "facebookId" character varying(255), "isVerified" boolean NOT NULL DEFAULT false, "isAdmin" boolean NOT NULL DEFAULT false, "lastLoginAt" TIMESTAMP WITH TIME ZONE, "isActive" boolean NOT NULL DEFAULT true, "refreshToken" text NOT NULL, "memberId" uuid, "employeeId" uuid, CONSTRAINT "UQ_1f7a2b11e29b1422a2622beab36" UNIQUE ("code"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "REL_bb2a621ce92bc6b86177c331fc" UNIQUE ("memberId"), CONSTRAINT "REL_a7191f881489123fab6c8e5273" UNIQUE ("employeeId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_1f7a2b11e29b1422a2622beab3" ON "users" ("code") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON "users" ("username") `,
    );
    await queryRunner.query(
      `CREATE TABLE "login-logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying(36) NOT NULL, "updatedAt" TIMESTAMP DEFAULT now(), "updatedBy" character varying(36), "isDeleted" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "actorType" character varying(20) NOT NULL, "actorId" uuid, "loginProvider" character varying(50), "status" character varying(20) NOT NULL, "failReason" character varying(100), "ipAddress" character varying(50), "userAgent" character varying(500), "deviceType" character varying(20), "os" character varying(50), "browser" character varying(50), "country" character varying(50), "city" character varying(100), "sessionId" character varying(255), "loggedInAt" TIMESTAMP WITH TIME ZONE, "loggedOutAt" TIMESTAMP WITH TIME ZONE, "sessionDuration" integer, "isForced" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_6354cdf5aad4a8ce8b3b003ad87" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "file-archives" ADD CONSTRAINT "FK_cefa99e8b111f07cb54b25d55b7" FOREIGN KEY ("uploadedBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "file-archives" ADD CONSTRAINT "FK_b80b872060cc08ac8acbc6c6ec9" FOREIGN KEY ("memberAvatarId") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "file-archives" ADD CONSTRAINT "FK_125897e9eb65655f152867aa263" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_bank_accounts" ADD CONSTRAINT "FK_35bafd775235c082ac9bc0b2e1c" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_bank_accounts" ADD CONSTRAINT "FK_ef84040a7f2a3468adb37767c2e" FOREIGN KEY ("fileArchivalId") REFERENCES "file-archives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "members" ADD CONSTRAINT "FK_839756572a2c38eb5a3b563126e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-receipt-documents" ADD CONSTRAINT "FK_a2bd885496cfa6b7492e0a0278e" FOREIGN KEY ("receiptId") REFERENCES "fund-receipts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-receipt-documents" ADD CONSTRAINT "FK_71332800a4d130bf1f0df774b31" FOREIGN KEY ("fileId") REFERENCES "file-archives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-receipt-approvals" ADD CONSTRAINT "FK_5fcb33ab35aaaebc99f7e66418d" FOREIGN KEY ("receiptId") REFERENCES "fund-receipts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-receipt-approvals" ADD CONSTRAINT "FK_3dff7f3cc311f0bea76b31403c5" FOREIGN KEY ("actionBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "disbursement-confirmations" ADD CONSTRAINT "FK_0a74b4aae02d5541acfc372cd66" FOREIGN KEY ("disbursementId") REFERENCES "disbursements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "disbursement-confirmations" ADD CONSTRAINT "FK_88a8c85667b3b5491a8df9b1e14" FOREIGN KEY ("confirmedBy") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "disbursement-confirmations" ADD CONSTRAINT "FK_afda5b87a9e9e5ba026219c1790" FOREIGN KEY ("proofFileId") REFERENCES "file-archives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "disbursements" ADD CONSTRAINT "FK_5663021050c3649f63bfc8a6485" FOREIGN KEY ("receiptId") REFERENCES "fund-receipts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "disbursements" ADD CONSTRAINT "FK_e1fb806a7653b0fc5a8e6dbf4e0" FOREIGN KEY ("cycleId") REFERENCES "fund-cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "disbursements" ADD CONSTRAINT "FK_068b0f3cebdc8760da2adb3e64d" FOREIGN KEY ("proofFileId") REFERENCES "file-archives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "disbursements" ADD CONSTRAINT "FK_1d966f381c8a982fbeb343d4a80" FOREIGN KEY ("disbursedBy") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-receipts" ADD CONSTRAINT "FK_32873ced0aac814ba7ce4f92d4c" FOREIGN KEY ("cycleId") REFERENCES "fund-cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-receipts" ADD CONSTRAINT "FK_1f41fe384e0ee77949fd8dc3a0a" FOREIGN KEY ("fundMemberId") REFERENCES "fund-members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-receipts" ADD CONSTRAINT "FK_20170b8f800b642acd89f3a520a" FOREIGN KEY ("reviewedBy") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-cycle-summaries" ADD CONSTRAINT "FK_e07aacfba32caf8a42e1cd14d95" FOREIGN KEY ("cycleId") REFERENCES "fund-cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-cycles" ADD CONSTRAINT "FK_7b77f4501df8fcf3963faf9b70c" FOREIGN KEY ("fundId") REFERENCES "funds"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contribution-reminders" ADD CONSTRAINT "FK_a3321d41777b897bf536eafc38f" FOREIGN KEY ("contributionId") REFERENCES "contributions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributions" ADD CONSTRAINT "FK_54033da0e8339b59da96be62c7e" FOREIGN KEY ("cycleId") REFERENCES "fund-cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributions" ADD CONSTRAINT "FK_41052dc8e5ee22b8ea82bf051d8" FOREIGN KEY ("fundMemberId") REFERENCES "fund-members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributions" ADD CONSTRAINT "FK_91ae6373c589ff23acab011a094" FOREIGN KEY ("proofFileId") REFERENCES "file-archives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributions" ADD CONSTRAINT "FK_31fa37e5f9217c4ebae2ac388bc" FOREIGN KEY ("confirmedBy") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member-receipt-history" ADD CONSTRAINT "FK_f79fd3efac0d8b8c49e910861b5" FOREIGN KEY ("fundMemberId") REFERENCES "fund-members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member-receipt-history" ADD CONSTRAINT "FK_277690d3f33451ee0bdefbdac37" FOREIGN KEY ("cycleId") REFERENCES "fund-cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "member-receipt-history" ADD CONSTRAINT "FK_c4856e21f64dea665fca7ce960b" FOREIGN KEY ("receiptId") REFERENCES "fund-receipts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-members" ADD CONSTRAINT "FK_9dc18403ceb3b4b13881029e30d" FOREIGN KEY ("fundId") REFERENCES "funds"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-members" ADD CONSTRAINT "FK_5be96e130e2df9b427acba33718" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-transactions" ADD CONSTRAINT "FK_bca40394e96fba7165d86e2f074" FOREIGN KEY ("fundId") REFERENCES "funds"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-transactions" ADD CONSTRAINT "FK_2f1fdc20b31bc5c70d100c5d8f5" FOREIGN KEY ("cycleId") REFERENCES "fund-cycles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-transactions" ADD CONSTRAINT "FK_02784692d8a3e85a7d9cddd22d3" FOREIGN KEY ("performedBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funds" ADD CONSTRAINT "FK_c37ac3efdf4e443d74f209b8b60" FOREIGN KEY ("managedBy") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_4b3957148ccff1ea6ed6cfead41" FOREIGN KEY ("templateId") REFERENCES "notification-templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "employees" ADD CONSTRAINT "FK_737991e10350d9626f592894cef" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role-permissions" ADD CONSTRAINT "FK_832f9475661d055310963d2f20d" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role-permissions" ADD CONSTRAINT "FK_92ee53f7b01b6aaf1e6eac3297e" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-permissions" ADD CONSTRAINT "FK_95ae8c92259717c22ced22437bc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-permissions" ADD CONSTRAINT "FK_5012f73c39824319d792beb4a14" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-permissions" ADD CONSTRAINT "FK_b6205a857e3d77453b0c3730040" FOREIGN KEY ("grantedBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-roles" ADD CONSTRAINT "FK_78ba3fb777ed710228e892e1a0d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-roles" ADD CONSTRAINT "FK_77ec5015f425496930fb82eb860" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_bb2a621ce92bc6b86177c331fc8" FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a7191f881489123fab6c8e52738" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "login-logs" ADD CONSTRAINT "FK_52e9d7bc6f1692e59fd504c5643" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "login-logs" DROP CONSTRAINT "FK_52e9d7bc6f1692e59fd504c5643"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a7191f881489123fab6c8e52738"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_bb2a621ce92bc6b86177c331fc8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-roles" DROP CONSTRAINT "FK_77ec5015f425496930fb82eb860"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-roles" DROP CONSTRAINT "FK_78ba3fb777ed710228e892e1a0d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-permissions" DROP CONSTRAINT "FK_b6205a857e3d77453b0c3730040"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-permissions" DROP CONSTRAINT "FK_5012f73c39824319d792beb4a14"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user-permissions" DROP CONSTRAINT "FK_95ae8c92259717c22ced22437bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role-permissions" DROP CONSTRAINT "FK_92ee53f7b01b6aaf1e6eac3297e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role-permissions" DROP CONSTRAINT "FK_832f9475661d055310963d2f20d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employees" DROP CONSTRAINT "FK_737991e10350d9626f592894cef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_4b3957148ccff1ea6ed6cfead41"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funds" DROP CONSTRAINT "FK_c37ac3efdf4e443d74f209b8b60"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-transactions" DROP CONSTRAINT "FK_02784692d8a3e85a7d9cddd22d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-transactions" DROP CONSTRAINT "FK_2f1fdc20b31bc5c70d100c5d8f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-transactions" DROP CONSTRAINT "FK_bca40394e96fba7165d86e2f074"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-members" DROP CONSTRAINT "FK_5be96e130e2df9b427acba33718"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-members" DROP CONSTRAINT "FK_9dc18403ceb3b4b13881029e30d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member-receipt-history" DROP CONSTRAINT "FK_c4856e21f64dea665fca7ce960b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member-receipt-history" DROP CONSTRAINT "FK_277690d3f33451ee0bdefbdac37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member-receipt-history" DROP CONSTRAINT "FK_f79fd3efac0d8b8c49e910861b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributions" DROP CONSTRAINT "FK_31fa37e5f9217c4ebae2ac388bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributions" DROP CONSTRAINT "FK_91ae6373c589ff23acab011a094"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributions" DROP CONSTRAINT "FK_41052dc8e5ee22b8ea82bf051d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contributions" DROP CONSTRAINT "FK_54033da0e8339b59da96be62c7e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contribution-reminders" DROP CONSTRAINT "FK_a3321d41777b897bf536eafc38f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-cycles" DROP CONSTRAINT "FK_7b77f4501df8fcf3963faf9b70c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-cycle-summaries" DROP CONSTRAINT "FK_e07aacfba32caf8a42e1cd14d95"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-receipts" DROP CONSTRAINT "FK_20170b8f800b642acd89f3a520a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-receipts" DROP CONSTRAINT "FK_1f41fe384e0ee77949fd8dc3a0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-receipts" DROP CONSTRAINT "FK_32873ced0aac814ba7ce4f92d4c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "disbursements" DROP CONSTRAINT "FK_1d966f381c8a982fbeb343d4a80"`,
    );
    await queryRunner.query(
      `ALTER TABLE "disbursements" DROP CONSTRAINT "FK_068b0f3cebdc8760da2adb3e64d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "disbursements" DROP CONSTRAINT "FK_e1fb806a7653b0fc5a8e6dbf4e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "disbursements" DROP CONSTRAINT "FK_5663021050c3649f63bfc8a6485"`,
    );
    await queryRunner.query(
      `ALTER TABLE "disbursement-confirmations" DROP CONSTRAINT "FK_afda5b87a9e9e5ba026219c1790"`,
    );
    await queryRunner.query(
      `ALTER TABLE "disbursement-confirmations" DROP CONSTRAINT "FK_88a8c85667b3b5491a8df9b1e14"`,
    );
    await queryRunner.query(
      `ALTER TABLE "disbursement-confirmations" DROP CONSTRAINT "FK_0a74b4aae02d5541acfc372cd66"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-receipt-approvals" DROP CONSTRAINT "FK_3dff7f3cc311f0bea76b31403c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-receipt-approvals" DROP CONSTRAINT "FK_5fcb33ab35aaaebc99f7e66418d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-receipt-documents" DROP CONSTRAINT "FK_71332800a4d130bf1f0df774b31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund-receipt-documents" DROP CONSTRAINT "FK_a2bd885496cfa6b7492e0a0278e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "members" DROP CONSTRAINT "FK_839756572a2c38eb5a3b563126e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_bank_accounts" DROP CONSTRAINT "FK_ef84040a7f2a3468adb37767c2e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "member_bank_accounts" DROP CONSTRAINT "FK_35bafd775235c082ac9bc0b2e1c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file-archives" DROP CONSTRAINT "FK_125897e9eb65655f152867aa263"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file-archives" DROP CONSTRAINT "FK_b80b872060cc08ac8acbc6c6ec9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file-archives" DROP CONSTRAINT "FK_cefa99e8b111f07cb54b25d55b7"`,
    );
    await queryRunner.query(`DROP TABLE "login-logs"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fe0bb3f6520ee0469504521e71"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1f7a2b11e29b1422a2622beab3"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "verify-otp"`);
    await queryRunner.query(`DROP TABLE "user-roles"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8dad765629e83229da6feda1c1"`,
    );
    await queryRunner.query(`DROP TABLE "permissions"`);
    await queryRunner.query(`DROP TABLE "user-permissions"`);
    await queryRunner.query(`DROP TABLE "role-permissions"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_648e3f5447f725579d7d4ffdfb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f6d54f95c31b73fb1bdd8e91d0"`,
    );
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_765bc1ac8967533a04c74a9f6a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2f88c4dff473076e55ca2568d5"`,
    );
    await queryRunner.query(`DROP TABLE "employees"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5f29cf0f46e8439f1a7bde5ae2"`,
    );
    await queryRunner.query(`DROP TABLE "notification-templates"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_75c7a55653e339f03de7cea0e0"`,
    );
    await queryRunner.query(`DROP TABLE "funds"`);
    await queryRunner.query(`DROP TABLE "fund-transactions"`);
    await queryRunner.query(`DROP TABLE "fund-members"`);
    await queryRunner.query(`DROP TABLE "member-receipt-history"`);
    await queryRunner.query(`DROP TABLE "contributions"`);
    await queryRunner.query(`DROP TABLE "contribution-reminders"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b40dd74d401ba184281c040e7d"`,
    );
    await queryRunner.query(`DROP TABLE "fund-cycles"`);
    await queryRunner.query(`DROP TABLE "fund-cycle-summaries"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8a53cab5f2674477039ed791a2"`,
    );
    await queryRunner.query(`DROP TABLE "fund-receipts"`);
    await queryRunner.query(`DROP TABLE "disbursements"`);
    await queryRunner.query(`DROP TABLE "disbursement-confirmations"`);
    await queryRunner.query(`DROP TABLE "fund-receipt-approvals"`);
    await queryRunner.query(`DROP TABLE "fund-receipt-documents"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2714af51e3f7dd42cf66eeb08d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8b08a36b59b238402b8c38d1f6"`,
    );
    await queryRunner.query(`DROP TABLE "members"`);
    await queryRunner.query(`DROP TABLE "member_bank_accounts"`);
    await queryRunner.query(`DROP TABLE "file-archives"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_Function"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_531adf52cf9e399d85c683643f"`,
    );
    await queryRunner.query(`DROP TABLE "action-logs"`);
  }
}
