/*
  Warnings:

  - Added the required column `address` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientPhone` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `altRecipientName` VARCHAR(191) NULL,
    ADD COLUMN `altRecipientPhone` VARCHAR(191) NULL,
    ADD COLUMN `deliveryTime` VARCHAR(191) NULL,
    ADD COLUMN `proofImage` VARCHAR(191) NULL,
    ADD COLUMN `recipientEmail` VARCHAR(191) NULL,
    ADD COLUMN `recipientName` VARCHAR(191) NOT NULL,
    ADD COLUMN `recipientPhone` VARCHAR(191) NOT NULL;
