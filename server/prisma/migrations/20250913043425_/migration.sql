-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "public"."Participant" ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "public"."Room" ADD COLUMN     "Des" TEXT;
