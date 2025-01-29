/*
  Warnings:

  - Added the required column `status` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('upload', 'pending', 'error');

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "status" "Status" NOT NULL;
