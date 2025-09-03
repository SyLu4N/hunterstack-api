/*
  Warnings:

  - You are about to drop the `Policys` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Policys" DROP CONSTRAINT "Policys_categoryId_fkey";

-- DropTable
DROP TABLE "Policys";

-- CreateTable
CREATE TABLE "Policies" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Policies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Policies_slug_key" ON "Policies"("slug");

-- AddForeignKey
ALTER TABLE "Policies" ADD CONSTRAINT "Policies_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
