/*
  Warnings:

  - You are about to drop the column `avatar` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `clerkId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_clerkId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatar",
DROP COLUMN "clerkId",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "password" TEXT,
ALTER COLUMN "username" DROP NOT NULL;
