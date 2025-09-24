-- CreateEnum
CREATE TYPE "public"."Seenenum" AS ENUM ('seen', 'notseen');

-- AlterTable
ALTER TABLE "public"."FriendRequest" ADD COLUMN     "seen" "public"."Seenenum" NOT NULL DEFAULT 'notseen';
