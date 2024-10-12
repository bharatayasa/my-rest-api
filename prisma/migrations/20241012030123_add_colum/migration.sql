-- DropIndex
DROP INDEX `User_username_key` ON `User`;

-- AlterTable
ALTER TABLE `User` MODIFY `name` VARCHAR(50) NOT NULL,
    MODIFY `username` VARCHAR(50) NOT NULL;
