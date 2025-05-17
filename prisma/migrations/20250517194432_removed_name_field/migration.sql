/*
  Warnings:

  - You are about to drop the column `name` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "name";
