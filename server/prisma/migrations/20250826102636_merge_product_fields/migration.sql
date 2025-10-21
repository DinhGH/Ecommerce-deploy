/*
  Warnings:

  - You are about to drop the `Dimensions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Meta` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Dimensions` DROP FOREIGN KEY `Dimensions_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Meta` DROP FOREIGN KEY `Meta_productId_fkey`;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `barcode` VARCHAR(191) NULL,
    ADD COLUMN `depth` DOUBLE NULL,
    ADD COLUMN `height` DOUBLE NULL,
    ADD COLUMN `qrCode` VARCHAR(191) NULL,
    ADD COLUMN `width` DOUBLE NULL;

-- AlterTable
ALTER TABLE `Review` MODIFY `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `Dimensions`;

-- DropTable
DROP TABLE `Meta`;
