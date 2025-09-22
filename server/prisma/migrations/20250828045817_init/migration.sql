-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "password" TEXT,
ALTER COLUMN "googleId" DROP NOT NULL;
