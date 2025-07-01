ALTER TABLE `application_forms` MODIFY COLUMN `reason` varchar(5000) NOT NULL;--> statement-breakpoint
ALTER TABLE `application_forms` MODIFY COLUMN `cv` varchar(2083) NOT NULL;--> statement-breakpoint
ALTER TABLE `application_forms` MODIFY COLUMN `approved` varchar(50) NOT NULL DEFAULT 'Pending';--> statement-breakpoint
ALTER TABLE `media` MODIFY COLUMN `files` json NOT NULL;--> statement-breakpoint
ALTER TABLE `permissions` MODIFY COLUMN `id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `application_forms` DROP COLUMN `phone_number`;