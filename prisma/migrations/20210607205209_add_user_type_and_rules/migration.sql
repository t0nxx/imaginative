-- CreateEnum
CREATE TYPE "AccountRuleEnum" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "AccountTypeEnum" AS ENUM ('individual', 'company', 'institute');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "rule" "AccountRuleEnum" NOT NULL DEFAULT E'user',
ADD COLUMN     "type" "AccountTypeEnum" NOT NULL DEFAULT E'individual';
