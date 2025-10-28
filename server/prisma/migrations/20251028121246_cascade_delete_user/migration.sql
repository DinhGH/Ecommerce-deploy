-- DropForeignKey
ALTER TABLE `Cart` DROP FOREIGN KEY `Cart_userId_fkey`;

-- DropForeignKey
ALTER TABLE `CartItem` DROP FOREIGN KEY `CartItem_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `CartItem` DROP FOREIGN KEY `CartItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_userId_fkey`;

-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `PasswordResetToken` DROP FOREIGN KEY `PasswordResetToken_userId_fkey`;

-- DropForeignKey
ALTER TABLE `ReportIssue` DROP FOREIGN KEY `ReportIssue_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Review` DROP FOREIGN KEY `Review_productId_fkey`;

-- DropIndex
DROP INDEX `Cart_userId_fkey` ON `Cart`;

-- DropIndex
DROP INDEX `CartItem_productId_fkey` ON `CartItem`;

-- DropIndex
DROP INDEX `Order_userId_fkey` ON `Order`;

-- DropIndex
DROP INDEX `OrderItem_orderId_fkey` ON `OrderItem`;

-- DropIndex
DROP INDEX `OrderItem_productId_fkey` ON `OrderItem`;

-- DropIndex
DROP INDEX `PasswordResetToken_userId_fkey` ON `PasswordResetToken`;

-- DropIndex
DROP INDEX `ReportIssue_userId_fkey` ON `ReportIssue`;

-- DropIndex
DROP INDEX `Review_productId_fkey` ON `Review`;

-- AlterTable
ALTER TABLE `ReportIssue` MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReportIssue` ADD CONSTRAINT `ReportIssue_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasswordResetToken` ADD CONSTRAINT `PasswordResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
