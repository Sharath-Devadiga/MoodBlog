/*
  Warnings:

  - You are about to drop the column `avatar` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[publicUsername]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatar",
DROP COLUMN "username",
ADD COLUMN     "avatarId" TEXT NOT NULL DEFAULT 'default-avatar-1',
ADD COLUMN     "publicUsername" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_publicUsername_key" ON "User"("publicUsername");
