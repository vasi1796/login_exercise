/*
  Warnings:

  - Added the required column `user_password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "jwt_hash" TEXT,
ADD COLUMN     "user_password" TEXT NOT NULL;
