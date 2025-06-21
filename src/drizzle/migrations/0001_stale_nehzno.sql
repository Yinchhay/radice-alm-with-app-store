CREATE TABLE `code_verifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`type` varchar(100) NOT NULL,
	`pending_change` varchar(255),
	`expires_at` datetime NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `code_verifications_id` PRIMARY KEY(`id`),
	CONSTRAINT `code_verifications_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` varchar(2083),
	`date` datetime NOT NULL,
	`files` json NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `media_id` PRIMARY KEY(`id`),
	CONSTRAINT `media_title_unique` UNIQUE(`title`)
);
--> statement-breakpoint
DROP TABLE `email_verifications`;--> statement-breakpoint
ALTER TABLE `application_forms` DROP FOREIGN KEY `application_forms_reviewed_by_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `files` DROP FOREIGN KEY `files_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `oauth_providers` DROP FOREIGN KEY `oauth_providers_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `project_categories` DROP FOREIGN KEY `project_categories_project_id_projects_id_fk`;
--> statement-breakpoint
ALTER TABLE `project_categories` DROP FOREIGN KEY `project_categories_category_id_categories_id_fk`;
--> statement-breakpoint
ALTER TABLE `project_members` DROP FOREIGN KEY `project_members_project_id_projects_id_fk`;
--> statement-breakpoint
ALTER TABLE `project_members` DROP FOREIGN KEY `project_members_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `project_partners` DROP FOREIGN KEY `project_partners_project_id_projects_id_fk`;
--> statement-breakpoint
ALTER TABLE `project_partners` DROP FOREIGN KEY `project_partners_partner_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `projects` DROP FOREIGN KEY `projects_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `role_permissions` DROP FOREIGN KEY `role_permissions_role_id_roles_id_fk`;
--> statement-breakpoint
ALTER TABLE `role_permissions` DROP FOREIGN KEY `role_permissions_permission_id_permissions_id_fk`;
--> statement-breakpoint
ALTER TABLE `sessions` DROP FOREIGN KEY `sessions_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `user_roles` DROP FOREIGN KEY `user_roles_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `user_roles` DROP FOREIGN KEY `user_roles_role_id_roles_id_fk`;
--> statement-breakpoint
ALTER TABLE `files` MODIFY COLUMN `user_id` varchar(255);--> statement-breakpoint
ALTER TABLE `projects` MODIFY COLUMN `description` varchar(400);--> statement-breakpoint
ALTER TABLE `projects` MODIFY COLUMN `project_content` json DEFAULT ('[]');--> statement-breakpoint
ALTER TABLE `projects` MODIFY COLUMN `links` json DEFAULT ('[]');--> statement-breakpoint
ALTER TABLE `projects` MODIFY COLUMN `pipeline_status` json;--> statement-breakpoint
ALTER TABLE `projects` MODIFY COLUMN `user_id` varchar(255);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `description` varchar(500);--> statement-breakpoint
ALTER TABLE `application_forms` ADD `reason` varchar(5000) NOT NULL;--> statement-breakpoint
ALTER TABLE `application_forms` ADD `cv` varchar(2083) NOT NULL;--> statement-breakpoint
ALTER TABLE `application_forms` ADD `approved` varchar(50) DEFAULT 'Pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `categories` ADD `logo` varchar(2083);--> statement-breakpoint
ALTER TABLE `files` ADD `belong_to` varchar(50);--> statement-breakpoint
ALTER TABLE `files` ADD `created_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `users` ADD `skill_set` json DEFAULT ('[]');--> statement-breakpoint
ALTER TABLE `code_verifications` ADD CONSTRAINT `code_verifications_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `application_forms` ADD CONSTRAINT `application_forms_reviewed_by_user_id_users_id_fk` FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `files` ADD CONSTRAINT `files_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `oauth_providers` ADD CONSTRAINT `oauth_providers_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_categories` ADD CONSTRAINT `project_categories_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_categories` ADD CONSTRAINT `project_categories_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_members` ADD CONSTRAINT `project_members_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_members` ADD CONSTRAINT `project_members_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_partners` ADD CONSTRAINT `project_partners_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_partners` ADD CONSTRAINT `project_partners_partner_id_users_id_fk` FOREIGN KEY (`partner_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_id_permissions_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `application_forms` DROP COLUMN `phone_number`;--> statement-breakpoint
ALTER TABLE `application_forms` DROP COLUMN `cv_url`;--> statement-breakpoint
ALTER TABLE `projects` DROP COLUMN `files`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `skillset`;