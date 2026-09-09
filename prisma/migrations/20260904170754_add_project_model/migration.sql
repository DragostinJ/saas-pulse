/*
  Warnings:

  - You are about to drop the column `plan` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `stripeCustomerId` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `budget` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Project` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Organization_stripeCustomerId_key";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "plan",
DROP COLUMN "stripeCustomerId";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "budget",
DROP COLUMN "status";

-- DropEnum
DROP TYPE "BillingPlan";

-- DropEnum
DROP TYPE "ProjectStatus";
