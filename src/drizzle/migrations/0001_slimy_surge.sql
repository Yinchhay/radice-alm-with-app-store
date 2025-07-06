ALTER TABLE `apps` MODIFY COLUMN `status` varchar(50) DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE `projects` MODIFY COLUMN `is_public` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` MODIFY COLUMN `is_app` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `versions` ADD `project_id` int;--> statement-breakpoint
ALTER TABLE `versions` ADD CONSTRAINT `versions_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;