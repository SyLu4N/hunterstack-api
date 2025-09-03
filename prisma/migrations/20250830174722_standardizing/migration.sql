/*
  Warnings:

  - You are about to drop the column `descricao` on the `Policys` table. All the data in the column will be lost.
  - You are about to drop the column `fonte` on the `Policys` table. All the data in the column will be lost.
  - Added the required column `name` to the `Categorys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Policys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `Policys` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Categorys" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Policys" DROP COLUMN "descricao",
DROP COLUMN "fonte",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "source" TEXT NOT NULL;
