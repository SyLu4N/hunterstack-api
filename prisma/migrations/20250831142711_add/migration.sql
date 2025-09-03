/*
  Warnings:

  - Added the required column `summary` to the `Policies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Policies" ADD COLUMN     "summary" TEXT NOT NULL;
