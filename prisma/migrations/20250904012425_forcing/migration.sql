/*
  Warnings:

  - You are about to drop the `Categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Policies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Policies" DROP CONSTRAINT "Policies_categoryId_fkey";

-- DropTable
DROP TABLE "Categories";

-- DropTable
DROP TABLE "Policies";

-- CreateTable
CREATE TABLE "poli" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "poli_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catego" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "catego_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "poli_slug_key" ON "poli"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "catego_slug_key" ON "catego"("slug");

-- AddForeignKey
ALTER TABLE "poli" ADD CONSTRAINT "poli_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "catego"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
