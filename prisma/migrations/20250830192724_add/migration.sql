/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Categorys` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Categorys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Categorys" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Categorys_slug_key" ON "Categorys"("slug");
