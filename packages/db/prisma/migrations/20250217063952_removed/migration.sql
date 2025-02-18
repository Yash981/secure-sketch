/*
  Warnings:

  - You are about to drop the column `iv` on the `Drawing` table. All the data in the column will be lost.
  - You are about to drop the `SharedLink` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SharedLink" DROP CONSTRAINT "SharedLink_drawingId_fkey";

-- DropForeignKey
ALTER TABLE "SharedLink" DROP CONSTRAINT "SharedLink_userId_fkey";

-- AlterTable
ALTER TABLE "Drawing" DROP COLUMN "iv",
ALTER COLUMN "title" DROP NOT NULL;

-- DropTable
DROP TABLE "SharedLink";
