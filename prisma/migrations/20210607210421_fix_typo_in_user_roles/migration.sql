/*
  Warnings:

  - You are about to drop the column `rule` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "rule",
ADD COLUMN     "role" "AccountRuleEnum" NOT NULL DEFAULT E'user';
