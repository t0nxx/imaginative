/*
  Warnings:

  - The values [institute] on the enum `AccountTypeEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AccountTypeEnum_new" AS ENUM ('individual', 'company', 'institution');
ALTER TABLE "users" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "type" TYPE "AccountTypeEnum_new" USING ("type"::text::"AccountTypeEnum_new");
ALTER TYPE "AccountTypeEnum" RENAME TO "AccountTypeEnum_old";
ALTER TYPE "AccountTypeEnum_new" RENAME TO "AccountTypeEnum";
DROP TYPE "AccountTypeEnum_old";
ALTER TABLE "users" ALTER COLUMN "type" SET DEFAULT 'individual';
COMMIT;
