ALTER TABLE `app_screenshots` DROP FOREIGN KEY `app_screenshots_app_id_apps_id_fk`;
--> statement-breakpoint
ALTER TABLE `bug_reports` DROP FOREIGN KEY `bug_reports_tester_id_testers_id_fk`;
--> statement-breakpoint
ALTER TABLE `bug_reports` DROP FOREIGN KEY `bug_reports_app_id_apps_id_fk`;
--> statement-breakpoint
ALTER TABLE `feedbacks` DROP FOREIGN KEY `feedbacks_tester_id_testers_id_fk`;
--> statement-breakpoint
ALTER TABLE `feedbacks` DROP FOREIGN KEY `feedbacks_app_id_apps_id_fk`;
--> statement-breakpoint
ALTER TABLE `versions` DROP FOREIGN KEY `versions_app_id_apps_id_fk`;
--> statement-breakpoint
ALTER TABLE `app_screenshots` ADD CONSTRAINT `app_screenshots_app_id_apps_id_fk` FOREIGN KEY (`app_id`) REFERENCES `apps`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bug_reports` ADD CONSTRAINT `bug_reports_tester_id_testers_id_fk` FOREIGN KEY (`tester_id`) REFERENCES `testers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `bug_reports` ADD CONSTRAINT `bug_reports_app_id_apps_id_fk` FOREIGN KEY (`app_id`) REFERENCES `apps`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `feedbacks` ADD CONSTRAINT `feedbacks_tester_id_testers_id_fk` FOREIGN KEY (`tester_id`) REFERENCES `testers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `feedbacks` ADD CONSTRAINT `feedbacks_app_id_apps_id_fk` FOREIGN KEY (`app_id`) REFERENCES `apps`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `versions` ADD CONSTRAINT `versions_app_id_apps_id_fk` FOREIGN KEY (`app_id`) REFERENCES `apps`(`id`) ON DELETE set null ON UPDATE no action;