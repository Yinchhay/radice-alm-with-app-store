-- MySQL dump 10.13  Distrib 8.4.5, for macos15.2 (arm64)
--
-- Host: radice-alm-app-1-do-user-17547996-0.d.db.ondigitalocean.com    Database: radiceappstore
-- ------------------------------------------------------
-- Server version	8.0.35
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;

/*!50503 SET NAMES utf8mb4 */
;

/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */
;

/*!40103 SET TIME_ZONE='+00:00' */
;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */
;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */
;

/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */
;

/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */
;

SET
  @MYSQLDUMP_TEMP_LOG_BIN = @ @SESSION.SQL_LOG_BIN;

SET
  @ @SESSION.SQL_LOG_BIN = 0;

--
-- GTID state at the beginning of the backup 
--
SET
  @ @GLOBAL.GTID_PURGED =
  /*!80000 '+'*/
  'dda393a2-5589-11f0-8522-daec5656b813:1-529';

--
-- Table structure for table `app_priority`
--
DROP TABLE IF EXISTS `app_priority`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `app_priority` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `app_priority_name_unique` (`name`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `app_priority`
--
LOCK TABLES `app_priority` WRITE;

/*!40000 ALTER TABLE `app_priority` DISABLE KEYS */
;

INSERT INTO
  `app_priority`
VALUES
  (
    1,
    'Live',
    'Live applications',
    1,
    '2025-06-30 09:31:56',
    '2025-06-30 09:31:56'
  ),
  (
    2,
    'Open for Testing',
    'Applications open for testing',
    1,
    '2025-06-30 09:31:56',
    '2025-06-30 09:31:56'
  );

/*!40000 ALTER TABLE `app_priority` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `app_types`
--
DROP TABLE IF EXISTS `app_types`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `app_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `app_types_name_unique` (`name`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `app_types`
--
LOCK TABLES `app_types` WRITE;

/*!40000 ALTER TABLE `app_types` DISABLE KEYS */
;

INSERT INTO
  `app_types`
VALUES
  (
    1,
    'Web',
    'Web applications',
    1,
    '2025-06-30 09:33:07',
    '2025-06-30 09:33:07'
  ),
  (
    2,
    'Mobile',
    'Mobile applications',
    1,
    '2025-06-30 09:33:07',
    '2025-06-30 09:33:07'
  ),
  (
    3,
    'API',
    'API applications',
    1,
    '2025-06-30 09:33:07',
    '2025-06-30 09:33:07'
  ),
  (
    4,
    'Test App Type',
    'Test App Description',
    1,
    '2025-07-03 10:14:31',
    '2025-07-03 10:14:31'
  );

/*!40000 ALTER TABLE `app_types` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `testers`
--
DROP TABLE IF EXISTS `testers`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `testers` (
  `id` varchar(255) NOT NULL DEFAULT (uuid()),
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(30) DEFAULT NULL,
  `profile_url` varchar(255) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `testers_email_unique` (`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `testers`
--
LOCK TABLES `testers` WRITE;

/*!40000 ALTER TABLE `testers` DISABLE KEYS */
;

INSERT INTO
  `testers`
VALUES
  (
    '012aca1c-5755-11f0-952a-daec5656b813',
    'Kolbot',
    'Pen',
    'kpe5@gmail.com',
    '$2b$10$tK76ja.k.LjrvIpBuBkZceZ7jMlfnV0./fTOLzAErjz5qsuqhdpNy',
    NULL,
    NULL,
    NULL,
    '2025-07-02 14:58:25',
    '2025-07-02 14:58:25'
  ),
  (
    '383fd65d-5720-11f0-952a-daec5656b813',
    'Kolbot',
    'Pen',
    'kpe4@gmail.com',
    '$2b$10$yTUDswPMk8UTigy0OYFV3uCgFOUmWtLtQJf4otJ0r1XE3EX8esw3u',
    NULL,
    NULL,
    NULL,
    '2025-07-02 08:40:34',
    '2025-07-02 08:40:34'
  ),
  (
    '91714528-571f-11f0-952a-daec5656b813',
    'Kolbot',
    'Pen',
    'kpe3@gmail.com',
    '$2b$10$y0RsA7ELMp70/v3PtaIuNOUCTZ7lVQvThs3W7svEZit6WPcnAysXy',
    NULL,
    NULL,
    NULL,
    '2025-07-02 08:35:54',
    '2025-07-02 08:35:54'
  ),
  (
    'df8f6494-571c-11f0-952a-daec5656b813',
    'Kolbot',
    'Pen',
    'kpen@gmail.com',
    '$2b$10$YiLZzh2sypONIgQMXCq7T.Gq5m2Dw5.CYMgDXJUXnCfR9cRrPPmWe',
    NULL,
    NULL,
    NULL,
    '2025-07-02 08:16:36',
    '2025-07-02 08:16:36'
  ),
  (
    'ef1712c0-57ed-11f0-952a-daec5656b813',
    'Yinchhay',
    'Im',
    'imyinchhay@gmail.com',
    '$2b$10$UpLHtBC49Rct.VxWQfpNTuhgJL11pkzoWWagygqDmo45mox7k4t0O',
    NULL,
    NULL,
    NULL,
    '2025-07-03 09:13:07',
    '2025-07-03 09:13:07'
  ),
  (
    'f2dff970-571c-11f0-952a-daec5656b813',
    'Kolbot',
    'Pen',
    'kpe2@gmail.com',
    '$2b$10$tA.kjWncLeIKLZYO5ADirO5ks3S4tJOQg.AlaPQcosWFikzZcZtAG',
    NULL,
    NULL,
    NULL,
    '2025-07-02 08:17:09',
    '2025-07-02 08:17:09'
  ),
  (
    'f7fbd2fd-5754-11f0-952a-daec5656b813',
    'Kolbot',
    'Pen',
    'kpe6@gmail.com',
    '$2b$10$7xJkaOWHD34aKCxbeaXkeu.mGQJO8MmxtNSI4SPReTIVVyif6.sSK',
    NULL,
    NULL,
    NULL,
    '2025-07-02 14:58:09',
    '2025-07-02 14:58:09'
  );

/*!40000 ALTER TABLE `testers` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `bug_reports`
--
DROP TABLE IF EXISTS `bug_reports`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `bug_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `image` varchar(500) DEFAULT NULL,
  `video` varchar(500) DEFAULT NULL,
  `tester_id` varchar(255) DEFAULT NULL,
  `app_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `bug_reports_tester_id_testers_id_fk` (`tester_id`),
  KEY `bug_reports_app_id_apps_id_fk` (`app_id`),
  CONSTRAINT `bug_reports_app_id_apps_id_fk` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bug_reports_tester_id_testers_id_fk` FOREIGN KEY (`tester_id`) REFERENCES `testers` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 8 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `bug_reports`
--
LOCK TABLES `bug_reports` WRITE;

/*!40000 ALTER TABLE `bug_reports` DISABLE KEYS */
;

INSERT INTO
  `bug_reports`
VALUES
  (
    2,
    'Test bug report',
    'This is a description of the bug',
    'https://example.com/image.png',
    'https://example.com/video.mp4',
    NULL,
    1,
    '2025-07-01 08:24:31',
    '2025-07-01 08:24:31'
  ),
  (
    3,
    'mega report report bug report',
    'This damn daniel of bug',
    'https://nude.com/image.png',
    'https://sex.com/video.mp4',
    NULL,
    NULL,
    '2025-07-01 15:01:29',
    '2025-07-01 15:01:29'
  ),
  (
    4,
    'sadsa',
    'sadas',
    NULL,
    NULL,
    NULL,
    NULL,
    '2025-07-02 10:11:07',
    '2025-07-02 10:11:07'
  ),
  (
    5,
    'chhay is a bitch',
    'yes he is',
    NULL,
    NULL,
    NULL,
    NULL,
    '2025-07-02 10:31:56',
    '2025-07-02 10:31:56'
  ),
  (
    6,
    'alsidj',
    'awldijalwi',
    NULL,
    NULL,
    NULL,
    NULL,
    '2025-07-02 15:20:57',
    '2025-07-02 15:20:57'
  ),
  (
    7,
    'best bug report ever report',
    'leeroyy jenkinnnnnn',
    'https://god.com/image.png',
    'https://godess.com/video.mp4',
    'ef1712c0-57ed-11f0-952a-daec5656b813',
    1,
    '2025-07-03 15:17:18',
    '2025-07-03 15:17:18'
  );

/*!40000 ALTER TABLE `bug_reports` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `media`
--
DROP TABLE IF EXISTS `media`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `media` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(2083) DEFAULT NULL,
  `date` datetime NOT NULL,
  `files` json NOT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `media_title_unique` (`title`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `media`
--
LOCK TABLES `media` WRITE;

/*!40000 ALTER TABLE `media` DISABLE KEYS */
;

/*!40000 ALTER TABLE `media` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `app_screenshots`
--
DROP TABLE IF EXISTS `app_screenshots`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `app_screenshots` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_id` int DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `sort_order` int NOT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `app_screenshots_app_id_apps_id_fk` (`app_id`),
  CONSTRAINT `app_screenshots_app_id_apps_id_fk` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `app_screenshots`
--
LOCK TABLES `app_screenshots` WRITE;

/*!40000 ALTER TABLE `app_screenshots` DISABLE KEYS */
;

/*!40000 ALTER TABLE `app_screenshots` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--
DROP TABLE IF EXISTS `user_roles`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `user_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_roles_user_id_users_id_fk` (`user_id`),
  KEY `user_roles_role_id_roles_id_fk` (`role_id`),
  CONSTRAINT `user_roles_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_roles_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 17 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `user_roles`
--
LOCK TABLES `user_roles` WRITE;

/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */
;

INSERT INTO
  `user_roles`
VALUES
  (1, '0de18ca4-34ba-11ef-a8f3-bc241176b8c5', 1),
  (15, '3c532c4e-654b-11ef-b0a8-bc241176b8c5', 2);

/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `project_members`
--
DROP TABLE IF EXISTS `project_members`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `project_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `can_edit` tinyint(1) DEFAULT '0',
  `project_id` int NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `project_members_project_id_projects_id_fk` (`project_id`),
  KEY `project_members_user_id_users_id_fk` (`user_id`),
  CONSTRAINT `project_members_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_members_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 20 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `project_members`
--
LOCK TABLES `project_members` WRITE;

/*!40000 ALTER TABLE `project_members` DISABLE KEYS */
;

INSERT INTO
  `project_members`
VALUES
  (
    2,
    '',
    1,
    18,
    '0de18ca4-34ba-11ef-a8f3-bc241176b8c5',
    '2024-08-07 02:11:18',
    '2024-08-07 02:11:18'
  ),
  (
    10,
    '',
    1,
    1,
    '23771528-6448-11ef-b0a8-bc241176b8c5',
    '2024-08-27 07:45:25',
    '2024-08-27 07:45:25'
  ),
  (
    12,
    '',
    1,
    5,
    '3c532c4e-654b-11ef-b0a8-bc241176b8c5',
    '2024-08-28 15:27:55',
    '2024-08-28 15:27:55'
  ),
  (
    18,
    '',
    1,
    21,
    '0de18ca4-34ba-11ef-a8f3-bc241176b8c5',
    '2025-07-01 07:51:10',
    '2025-07-01 07:51:10'
  ),
  (
    19,
    '',
    1,
    21,
    '20dde738-571e-11f0-952a-daec5656b813',
    '2025-07-02 08:34:14',
    '2025-07-02 08:48:08'
  );

/*!40000 ALTER TABLE `project_members` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--
DROP TABLE IF EXISTS `role_permissions`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `role_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `role_permissions_role_id_roles_id_fk` (`role_id`),
  KEY `role_permissions_permission_id_permissions_id_fk` (`permission_id`),
  CONSTRAINT `role_permissions_permission_id_permissions_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 17 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `role_permissions`
--
LOCK TABLES `role_permissions` WRITE;

/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */
;

INSERT INTO
  `role_permissions`
VALUES
  (1, 1, 1),
  (2, 1, 3),
  (3, 1, 4),
  (4, 1, 5),
  (5, 1, 6),
  (6, 1, 7),
  (7, 1, 8),
  (8, 1, 9),
  (9, 1, 10),
  (10, 1, 12),
  (11, 1, 13),
  (12, 1, 14),
  (13, 1, 15),
  (14, 1, 17),
  (15, 1, 18),
  (16, 1, 19);

/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `oauth_providers`
--
DROP TABLE IF EXISTS `oauth_providers`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `oauth_providers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider_id` varchar(50) NOT NULL,
  `provider_user_id` varchar(255) NOT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `oauth_providers_provider_user_id_unique` (`provider_user_id`),
  KEY `oauth_providers_user_id_users_id_fk` (`user_id`),
  CONSTRAINT `oauth_providers_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 18 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `oauth_providers`
--
LOCK TABLES `oauth_providers` WRITE;

/*!40000 ALTER TABLE `oauth_providers` DISABLE KEYS */
;

INSERT INTO
  `oauth_providers`
VALUES
  (
    3,
    'github',
    '45393928',
    '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',
    NULL,
    '0de18ca4-34ba-11ef-a8f3-bc241176b8c5',
    '2024-07-07 22:18:30',
    '2025-06-02 11:00:58'
  ),
  (
    10,
    'github',
    '53991529',
    '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',
    NULL,
    '23771528-6448-11ef-b0a8-bc241176b8c5',
    '2024-08-27 07:44:54',
    '2024-08-27 07:44:54'
  ),
  (
    12,
    'github',
    '83124370',
    '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',
    NULL,
    '3c532c4e-654b-11ef-b0a8-bc241176b8c5',
    '2024-08-28 15:26:41',
    '2024-08-28 15:26:41'
  );

/*!40000 ALTER TABLE `oauth_providers` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `__drizzle_migrations`
--
DROP TABLE IF EXISTS `__drizzle_migrations`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `__drizzle_migrations` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `hash` text NOT NULL,
  `created_at` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `__drizzle_migrations`
--
LOCK TABLES `__drizzle_migrations` WRITE;

/*!40000 ALTER TABLE `__drizzle_migrations` DISABLE KEYS */
;

INSERT INTO
  `__drizzle_migrations`
VALUES
  (
    1,
    '667f34f0fe2c5da2a80e8081d8da231daf25e5156588478da901eb349a3bcc34',
    1751003515317
  );

/*!40000 ALTER TABLE `__drizzle_migrations` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `version_logs`
--
DROP TABLE IF EXISTS `version_logs`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `version_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `version_id` int DEFAULT NULL,
  `action` varchar(50) DEFAULT NULL,
  `content` text,
  `created_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  KEY `version_logs_version_id_versions_id_fk` (`version_id`),
  CONSTRAINT `version_logs_version_id_versions_id_fk` FOREIGN KEY (`version_id`) REFERENCES `versions` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `version_logs`
--
LOCK TABLES `version_logs` WRITE;

/*!40000 ALTER TABLE `version_logs` DISABLE KEYS */
;

/*!40000 ALTER TABLE `version_logs` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `projects`
--
DROP TABLE IF EXISTS `projects`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `logo_url` varchar(2083) DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT '0',
  `project_content` json DEFAULT (_utf8mb4 '[]'),
  `links` json DEFAULT (_utf8mb4 '[]'),
  `pipeline_status` json DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `is_app` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `projects_name_unique` (`name`),
  KEY `projects_user_id_users_id_fk` (`user_id`),
  CONSTRAINT `projects_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE
  SET
    NULL
) ENGINE = InnoDB AUTO_INCREMENT = 22 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `projects`
--
LOCK TABLES `projects` WRITE;

/*!40000 ALTER TABLE `projects` DISABLE KEYS */
;

INSERT INTO
  `projects`
VALUES
  (
    1,
    'Scholarize',
    'Scholarize is a platform designed to facilitate academic research and collaboration. The research repository allows users to effortlessly search, read, and download research papers in PDF format. In addition, Scholarize\'s innovative research collaboration dashboard enables advisors to create groups, invite students, and utilize advanced tools for task management, file storage, and scheduling.',
    'Scholarize-whitebg-944602c5-1e0c-415a-9e54-743ab9da892e.png',
    1,
    '\"[{\\\"id\\\":\\\"591568a6-3311-4773-8e8c-65f50f88f2f1\\\",\\\"name\\\":\\\"What is Scholarize?\\\",\\\"components\\\":[{\\\"id\\\":\\\"3afbafdc-fb69-4485-8efd-e5c692ee43ab\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"What is Scholarize?\\\"},{\\\"id\\\":\\\"08a7f416-9749-46bb-acf5-94536b3faba7\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"Scholarize is a web application platform designed to facilitate academic research and collaboration. Scholarize’s research repository allows users to effortlessly search, read, and download research papers in PDF format. In addition, Scholarize\'s innovative research collaboration dashboard enables advisors to create groups, invite students, and utilize advanced tools for task management, file storage, and scheduling. By making it easier for researchers to find references and for advisors to manage multiple collaborations, Scholarize streamlines academic research, making it more efficient and productive.\\\"},{\\\"id\\\":\\\"bac75ccc-840c-43f7-b9f2-1552463b6885\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Problem\\\"},{\\\"id\\\":\\\"7b99c8e9-3135-4c8a-9192-73ca28f011c3\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"New paragraphThe senior students in the ICT Faculty at Paragon International University encounter a lack of effective research guidance due to insufficient reference availability, restrictive collaboration tools, and insufficient task monitoring. What is the effective approach to address these problems?\\\"},{\\\"id\\\":\\\"c58bcb60-4491-493d-abf7-f1dfc9595a87\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"Screenshot 2024-08-29 at 11.54.15 in the morning-ae9da1a9-5803-4772-b888-77a8f2a28058.png\\\"},{\\\"id\\\":\\\"ef0cee92-fd3e-47db-b6e8-7b32f67a912d\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Objective\\\"},{\\\"id\\\":\\\"18f27d3c-5bd2-4272-aac0-28196c421cc3\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"The main objective of this study is to find an effective approach to address the challenges faced by senior students and advisors at Paragon International University in terms of lack of adequate research guidance due to insufficient reference availability, restrictive collaboration tools, and insufficient task monitoring. Specifically, the researchers seek to work on the specific objectives:\\\",\\\"rows\\\":[\\\"To develop a digital platform called \\\\\\\"Scholarize\\\\\\\" that includes a research repository system, task management system, scheduling, and file storage.\\\",\\\"To deploy the platform by following the deployment diagram design for Cloud Lab.\\\",\\\"To conduct user acceptance testing through a questionnaire and present the findings.\\\"]}]},{\\\"id\\\":\\\"5a66da4d-f205-4ca9-bc47-15a62ef39f4d\\\",\\\"name\\\":\\\"Project Scope\\\",\\\"components\\\":[{\\\"id\\\":\\\"153dd60a-7de1-4849-8270-65eac333741e\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Scope\\\"},{\\\"id\\\":\\\"c512c2f2-a26c-4c57-959f-080a333c5896\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"Repository\\\",\\\"style\\\":{\\\"fontWeight\\\":2,\\\"fontSize\\\":2}},{\\\"id\\\":\\\"0a58e851-8a55-40e0-8dc6-7a60b9e4c397\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"A digital library that stores research papers published by the students of Paragon International University. Students can submit their research papers for approval by the Head of Departments before being published.\\\"},{\\\"id\\\":\\\"34de7a06-8937-4332-a1c0-b1d9c8e65dd4\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"Task Management\\\",\\\"style\\\":{\\\"fontSize\\\":2,\\\"fontWeight\\\":2}},{\\\"id\\\":\\\"d3f942f6-5a76-4fcd-9a7c-d384c73053e2\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"Managing lists of tasks, including creating, editing, and deleting, is streamlined through our platform. Scholarize helps students and advisors organize, assign, and track various project tasks efficiently. Users can set priorities, update progress, and communicate effortlessly, ensuring smooth and effective collaboration for all involved.\\\"},{\\\"id\\\":\\\"89082a06-d24d-4234-ae1f-8e1c70230455\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"File Storage\\\",\\\"style\\\":{\\\"fontSize\\\":2,\\\"fontWeight\\\":2}},{\\\"id\\\":\\\"d317de6d-5800-45d9-aa4a-b9751ef61742\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"An organized digital storage where students and advisors can store and manage their research documents. This feature ensures that all files related to the research process, including documents and drafts, are easily accessible within the platform.\\\"},{\\\"id\\\":\\\"90737b0a-98c6-44c6-8a8e-ade2122408f0\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"Scheduling\\\",\\\"style\\\":{\\\"fontSize\\\":2,\\\"fontWeight\\\":2}},{\\\"id\\\":\\\"ca3b3fb1-fc57-4151-80ac-b7385cd386e7\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"A shared calendar helps students and advisors to book meetings without any conflicts. This tool visually displays everyone\'s schedules, making it easy to identify suitable meeting times and manage project timelines effectively.\\\"}]},{\\\"id\\\":\\\"1e129de2-358f-4e44-9b94-b059c09e0749\\\",\\\"name\\\":\\\"Conceptual Framework\\\",\\\"components\\\":[{\\\"id\\\":\\\"fde0578b-a986-4c66-89ed-d2ddf50bb723\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Our Conceptual Framework\\\"},{\\\"id\\\":\\\"d882e38f-ca35-4494-93a1-0826c5ab655f\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"Screenshot 2024-08-29 at 11.53.53 in the morning-feae0a9f-431d-4830-a977-edcc5b49d95c.png\\\"}]},{\\\"id\\\":\\\"2d262e28-681e-436c-96f1-7a379744419a\\\",\\\"name\\\":\\\"Tool\\\",\\\"components\\\":[{\\\"id\\\":\\\"b7f8cfda-6010-4950-8bc7-aa2f4b3c8fe4\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Application Technologies of Scholarize\\\"},{\\\"id\\\":\\\"0266cfa7-b0fc-43c5-b0d3-90d914011a08\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"Screenshot 2024-08-29 at 11.46.22 in the morning-9dc5dc1d-4d44-4f78-8887-9a3525bccef5.png\\\"},{\\\"id\\\":\\\"b456ab6e-40bc-4771-8741-36fb4dcb03c7\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Deployment Technologies of Scholarize\\\"},{\\\"id\\\":\\\"d38cc840-c89a-4458-8ed9-8f0ea5f68c20\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"Screenshot 2024-08-29 at 11.47.12 in the morning-1e362a23-c0da-4827-b2cf-626a0ca3cf77.png\\\"}]},{\\\"id\\\":\\\"4d821cae-1acd-4ab7-a90e-c78c2c01216e\\\",\\\"name\\\":\\\"Team\\\",\\\"components\\\":[{\\\"id\\\":\\\"7be5653f-cd0f-49de-9220-e02411f857a6\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Our Team\\\"},{\\\"id\\\":\\\"66c5ecb6-73bd-41cb-bf73-c11135112e3c\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"Screenshot 2024-09-03 at 2.52.48 in the afternoon-fa04d6b2-b5fb-4407-883c-18e39c74e28f.png\\\"}]}]\"',
    '[{\"link\": \"https://sites.google.com/paragoniu.edu.kh/scholarize\", \"title\": \"Google site\"}]',
    '{\"live\": true, \"test\": true, \"build\": true, \"design\": true, \"release\": true, \"retired\": false, \"analysis\": true, \"approved\": true, \"retiring\": false, \"chartered\": true, \"definition\": true, \"development\": true, \"requirements\": true}',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-06-27 08:09:14',
    '2024-09-03 07:53:14',
    0
  ),
  (
    2,
    'Bit-Pi',
    'Bit-Pi is a CS department website designed to help students learn asynchronously.  It provides learning materials like lecture notes and code snippets outside of class time.',
    'bitpi (1)-c9fc37e8-109c-4d34-9f37-bfcb495b4200.png',
    1,
    '\"[]\"',
    '[]',
    '{\"live\": true, \"test\": true, \"build\": true, \"design\": true, \"release\": true, \"retired\": false, \"analysis\": true, \"approved\": true, \"retiring\": false, \"chartered\": true, \"definition\": true, \"development\": true, \"requirements\": true}',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-06-27 08:11:06',
    '2025-06-20 16:45:30',
    0
  ),
  (
    3,
    'MyEPS',
    'MYEPS is web application designed tailor for the EPS department for grade record management where allowing EPS instructors to easily submit students’ grades which equip with approval flow process with the director where to provide a standardized method for grade recording.',
    'MY (3) - Daravid Ngauv-40112a72-9149-431a-ba61-bf646b6eeab7.png',
    1,
    '\"[]\"',
    '[{\"link\": \"https://sites.google.com/paragoniu.edu.kh/preppify?usp=sharing\", \"title\": \"Google site\"}]',
    '{\"live\": true, \"test\": true, \"build\": true, \"design\": true, \"release\": true, \"retired\": false, \"analysis\": true, \"approved\": true, \"retiring\": false, \"chartered\": true, \"definition\": true, \"development\": true, \"requirements\": true}',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-06-27 08:31:35',
    '2025-06-30 08:50:01',
    0
  ),
  (
    4,
    'JolRean',
    'JolRean was created to address the inefficiencies and inaccuracies associated with traditional attendance collection methods in classroom settings. Conventional methods like manual roll calls and paper-based systems are not only time-consuming but also prone to errors and disruptions, impacting the overall classroom experience.',
    'jolrean.logo - Solyta Teng-664cfad5-207e-4c0d-a724-7e060eb12b03.png',
    1,
    '\"[{\\\"id\\\":\\\"ca55dddd-1c28-4f56-bf0f-7f5baad48a1f\\\",\\\"name\\\":\\\"What is JolRean?\\\",\\\"components\\\":[{\\\"id\\\":\\\"b7f874b8-f11e-40f2-b0ed-4878ccba5bd4\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"What is JolRean\\\"},{\\\"id\\\":\\\"d4096ffb-be87-4c7f-b69c-569f666bbd7a\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"JolRean is a classroom attendance collecting system for Paragon.U. It utilizes QR code technology for a flexible and convenient checking method. You can try our solution at: https://jolrean.paragoniu.app\\\\n\\\"},{\\\"id\\\":\\\"4662d613-c5b9-4a15-81fd-a7d4f820947e\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Problem Statement\\\"},{\\\"id\\\":\\\"01369dff-2dd6-4edf-914a-0e7c34302d4c\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"During our preliminary survey, the instructors and students found the current method of collecting attendances to be time-consuming and taking away their study time away. Moreover, the administrative burden fell heavily onto the instructors.\\\"}]},{\\\"id\\\":\\\"ed644bcb-16bd-4d0a-b77a-88569042ff13\\\",\\\"name\\\":\\\"What JolRean can offer?\\\",\\\"components\\\":[{\\\"id\\\":\\\"23933e2f-122a-44d1-86c3-9cce5f0e9e01\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Why use JolRean? \\\"},{\\\"id\\\":\\\"7ceb7a94-4738-4d14-8088-36cde66a0ef3\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"JolRean can offer the following:\\\",\\\"rows\\\":[\\\"Flexible tardy time: the instructor can have dynamic tardy time that automatically mark students are Present, Tardy, or Absent.\\\",\\\"Save time: with a click of a button from the instructor, the system will automatically collect and determine the student\'s attendance status during the class hour, allowing the instructor to use their time more efficiently and more productively.\\\",\\\"Minimize human error: since our system will determine the attendance status based on the student\'s check-in time and the tardy time set by the instructor, it will ensure that the student will get their well-deserved status.\\\",\\\"Self check-in: using our system, the administrative burden now will rely on each student instead. Each student is responsible for their own attendance status.\\\"]},{\\\"id\\\":\\\"308855da-8223-4171-ace4-989e09b13e80\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Features of JolRean\\\"},{\\\"id\\\":\\\"01a29f9d-7501-4182-8555-8e6ed5f1fbc4\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"These are the features of JolRean:\\\",\\\"rows\\\":[\\\"Import data: you can populate the classes and users in our system by importing an excel file. We have a template for you to follow.\\\",\\\"Custom tardy time: each instructor can set different tardy time according to their preferrence. Our system will automatically apply this when it marks the students\' attendance statuses.\\\",\\\"Continous attendance collection: for each long-hour class, the instructor can start the collection process with a click of a button.\\\",\\\"Check-in using QR Code: students can check-in by scanning the QR code on their classroom wall using either the web app\'s camera or their native phone camera if it has the capability to scan QR code.\\\",\\\"Geolocation: our system will check if the student is in school area when they check-in.\\\"]}]},{\\\"id\\\":\\\"0d63052e-78a2-4dc6-bcf4-c3879ac62cba\\\",\\\"name\\\":\\\"Conceptual Framework\\\",\\\"components\\\":[{\\\"id\\\":\\\"cee76d50-0b6e-481e-8501-f4a68cb0edeb\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Conceptual Framework\\\"},{\\\"id\\\":\\\"85dcd053-a452-4dd0-994b-334393b613c2\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"Screenshot 2024-08-23 193727-7df2e2d7-6d25-41e3-99a2-aa660e07321d.png\\\"}]},{\\\"id\\\":\\\"f5313ad8-2281-43fd-867b-bf846dc75c81\\\",\\\"name\\\":\\\"Fishbone\\\",\\\"components\\\":[{\\\"id\\\":\\\"26cbd878-6710-4692-9e47-33c2c6b5334e\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Fishbone\\\"},{\\\"id\\\":\\\"3d1f1dcc-54e7-42d1-8dfb-46f8d253c305\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"Screenshot 2024-08-23 195010-19fade1c-3152-442d-9a26-6184cde8cef3.png\\\"}]},{\\\"id\\\":\\\"bf637c9b-b591-4110-8b55-36ef144c98db\\\",\\\"name\\\":\\\"Flow Chart\\\",\\\"components\\\":[{\\\"id\\\":\\\"835009f0-2910-4c5a-a114-235f351841e8\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Flow Chart\\\"},{\\\"id\\\":\\\"883a6e39-fb6e-40ba-a219-e85d92b87096\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"Screenshot 2024-08-23 194238-5add8d5d-2cda-4797-af40-6987f86255c7.png\\\"},{\\\"id\\\":\\\"26a00977-e9c3-423f-b7b4-7cc0c3bae882\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"The logic of this proposed solution is as follow:\\\\n 1. If the class session is ended by the instructor, the student will get status\\\\n “Present”.\\\\n 2. If the class session is dismissed and the student has never scanned the QR\\\\n code; therefore, the student will get status “Absent”.\\\\n 3.  If the current class session is the first session, then:\\\\n      3.1. If the student scans the QR code before the instructor enables the\\\\n              collection process, the student will get the status “Check-In”. When the\\\\n              instructor clicks the collection process of the current class section, the\\\\n              “Check-In” student will be migrated to “Present”.\\\\n      3.2. If the student scans the QR code after the instructor enables the\\\\n              collection process, the student will be “Present” if he/she scans the QR\\\\n              code within the tardy buffer time. If the student is past the tardy buffer\\\\n              time, the student will be “Tardy”.\\\\n 4. If the current class session is not the first session, then:\\\\n      4.1. If the student was either “Present” or “Tardy” in the previous session,\\\\n              the student gets Present if he/she scans the QR code. If not, he/she gets\\\\n              “Absent”.\\\\n     4.2. If the student was Absent in the previous session, the process of\\\\n             checking the tardy time follows 3.2. However, this time, the buffer\\\\n             time begins after the class session starts. For example, if the second\\\\n             session begins at 9 AM and the tardy time is 10 minutes, then the\\\\n             student must scan the QR code between 9:00 AM and 9:10 AM to get\\\\n             the status Present. Else, he/she will get Tardy\\\"}]},{\\\"id\\\":\\\"02cec648-eac4-464a-9dc5-f11863fcf852\\\",\\\"name\\\":\\\"Summary Finding\\\",\\\"components\\\":[{\\\"id\\\":\\\"feb59dc0-128a-4229-9db2-67cc2ed26407\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Summary Finding\\\"},{\\\"id\\\":\\\"c409338d-f6c1-40c7-9160-b2c329978804\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"Instructors:\\\",\\\"rows\\\":[\\\"ImprovedAttendance Tracking Efficiency: Compared to traditional\\\\n methods, the system significantly reduced time spent recording attendance and\\\\n minimized errors in data collection. It takes a maximum of 2 minutes for an\\\\n instructor to collect attendance.\\\",\\\"Positive User Experience: Both instructors and students reported a\\\\n user-friendly and efficient experience with the system. We received an overall\\\\n rating from instructor 5/5.\\\"]},{\\\"id\\\":\\\"7b87aa86-a930-458f-8377-3e25b49098da\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"Students:\\\",\\\"rows\\\":[\\\"ImprovedUser Experience: students found the QR code scanning process\\\\n convenient, they rated the overall experiences 4.22 out of 5.\\\",\\\" Challenges and Limitations: User’s browser has different versions and\\\\n limitations such as the ability to zoom in for the QR scanning. Some browsers\\\\n have difficulty managing the geo-location and camera permissions. We have\\\\n found out the issue caused by Apple iOS privacy protection feature called\\\\n “Precise Location”. According to 9to5Mac, starting from iOS 14, users need to\\\\n manually allow the Precise Location in their setting. Otherwise, the\\\\n website and app can only see the general location, which affects the accuracy\\\\n of our location verification.\\\"]}]},{\\\"id\\\":\\\"fb3dfbf4-67fb-4442-80cc-153ca6adfa48\\\",\\\"name\\\":\\\"Recommendations\\\",\\\"components\\\":[{\\\"id\\\":\\\"a1521257-8ffb-41af-8d17-fd61e3133222\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Recommendations\\\"},{\\\"id\\\":\\\"afb87f7c-ff5e-4193-bcc3-ca69948685f2\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"These are recommendations for fellow students/developers who want to continue our project:\\\",\\\"rows\\\":[\\\"Allow instructors to start class earlier than the scheduled time: JolRean\\\\n allows instructors to end class earlier; however, some instructors suggested\\\\n having a feature that allows the attendance collection to start before the\\\\n scheduled time.\\\",\\\"One time check in for multiple consecutive classes: JolRean requires\\\\n students to check in every class. To increase convenience, future researchers\\\\n should add the feature that requires students to check in only once.\\\",\\\"Allow the instructor to start the collection process by scanning the QR\\\\n code: JolRean allows the instructors to start the attendance collection process\\\\n by clicking a button on the dashboard page. However, some instructors want\\\\n to start their collection process by scanning the QR code because it would be\\\\n much easier and convenient for them, and we can verify that the instructors are\\\\n at the school when they start the collection process.\\\",\\\"Biometric verification for students: JolRean allows the students to scan the\\\\n QRcode, and it will use the room number from the QR code, the students’\\\\n active schedules, and the location of the students’ devices upon sending the\\\\n request to mark the students. The coordinator suggests requiring the students’\\\\n biometric information; however, this would need to transfer this web\\\\n application to a mobile application. In addition, the students’ devices need to\\\\n have the biometric feature.\\\",\\\"HR role in the system: JolRean only has 3 roles including instructor, admin,\\\\n and student. The coordinator suggests allowing the HR officers to also see the\\\\n timestamps which the instructors start their collection process.\\\",\\\"Software as a service (SaaS) of the API: admin can communicate with\\\\n JolRean backend using the JolRean frontend. The coordinator to develop a\\\\n SaaS version of the backend, so that the school can easily incorporate,\\\\n integrate, and utilize the JolRean API without interacting with the frontend.\\\"]}]}]\"',
    '[{\"link\": \"https://sites.google.com/paragoniu.edu.kh/jolrean/home\", \"title\": \"Google site\"}]',
    '{\"live\": true, \"test\": true, \"build\": true, \"design\": true, \"release\": true, \"retired\": false, \"analysis\": true, \"approved\": true, \"retiring\": false, \"chartered\": true, \"definition\": true, \"development\": true, \"requirements\": true}',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-06-27 08:31:51',
    '2024-08-27 07:47:21',
    0
  ),
  (
    5,
    'KruKit',
    '\"Krukit\" is an innovative educational platform designed to simplify classroom management and student assessment by the tools, including class record management, random team generation, rubric-based scoring, and score exporting. \r\n\r\n\"Krukit\" has been developed as a stand-alone enterprise project which already gave the special offers to let all Paragon IU users can access without payment.',
    'IMG_20240828_211748_204 - Rotnak Hang-4fde65a1-768d-4115-b1ff-1e4b15c6ca8b.png',
    1,
    '\"[{\\\"id\\\":\\\"80f012dc-8c49-4f54-9442-87d5c11821b4\\\",\\\"name\\\":\\\"Note\\\",\\\"components\\\":[{\\\"id\\\":\\\"9efe2f70-eed5-4758-924c-c4d2b9dcce7e\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Copyright 2024 Krukit:\\\",\\\"style\\\":{\\\"fontSize\\\":0,\\\"fontWeight\\\":1,\\\"fontAlign\\\":0}},{\\\"id\\\":\\\"33912606-5fcf-4e91-9399-e00985838c49\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"Since Krukit already gave special offers for all Paragon IU users to freely access without requiring payment, therefore this project is not owned by Radice.\\\\n\\\\n If this project gets copied, modified, merged, published, distributed, sublicensed, and/or sold copies of the Software, those individuals have to ask permission and sign an agreement with Krukit according to Cambodia legal law.\\\",\\\"style\\\":{\\\"fontSize\\\":0}}]}]\"',
    '[{\"link\": \"https://sites.google.com/paragoniu.edu.kh/krukit/about-us?authuser=1\", \"title\": \"Google site\"}]',
    '{\"live\": true, \"test\": true, \"build\": true, \"design\": true, \"release\": true, \"retired\": false, \"analysis\": true, \"approved\": true, \"retiring\": false, \"chartered\": true, \"definition\": true, \"development\": true, \"requirements\": true}',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-06-27 08:31:56',
    '2024-08-29 11:51:53',
    0
  ),
  (
    6,
    'Alumnify',
    'ALUMNIFY, an alumni platform equipped with valuable resources that support career development, professional network, and digital yearbooks, where each generation\'s stories are highlighted.',
    'Alumnify_Logo - Sambathmonyneath Pich-d980d6a0-0733-478d-9e3e-163434519e8a.png',
    1,
    '\"[{\\\"id\\\":\\\"fbae2832-236b-4c02-b9b9-6e44dc8dd3d9\\\",\\\"name\\\":\\\"What is Alumnify?\\\",\\\"components\\\":[{\\\"id\\\":\\\"2482426a-af39-48e7-8410-01737d074fe1\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"What is Alumnify\\\"},{\\\"id\\\":\\\"d8894340-1260-4734-a3b2-a42d26c0d5b7\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"\\\\\\\"Alumnify\\\\\\\" reconnect alumni and the university on one digital platform by allowing the alumni to access the Paragon.U alumni network via digital yearbook, explore career opportunities, check the upcoming events, and customize their own professional profile. \\\\n\\\"}]},{\\\"id\\\":\\\"ad9c66a6-25db-4466-a7fa-013179c6122e\\\",\\\"name\\\":\\\"Project Objective\\\",\\\"components\\\":[{\\\"id\\\":\\\"48bc4a65-401a-4875-ae1c-c26e0b70d280\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Project Objective\\\"},{\\\"id\\\":\\\"76bc2a53-14df-4b22-81a4-fad827cdda62\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"The objective of this project is to find an effective solution to ease the alumni affairs difficulties in managing alumni information that help in building, and maintaining relationships with alumni. The study takes two approaches by first identifying the key challenges that the alumni affairs are facing which is data management and secondly, analyzing the value proposition that can be included in the system that is beneficial to the alumni.\\\\n\\\"}]},{\\\"id\\\":\\\"8ac15012-1319-42df-a841-49dba81ddad5\\\",\\\"name\\\":\\\"Fishbone Diagram\\\",\\\"components\\\":[{\\\"id\\\":\\\"d9eb0872-051e-44f4-9852-b0d9cde47021\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Fishbone Diagram\\\"},{\\\"id\\\":\\\"e01b5ae5-2788-4f07-97cd-af943f3472c6\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"Snipaste_2024-08-31_11-11-06-e24dcd57-1d45-44a3-a058-35bf1bda5bc7.png\\\"},{\\\"id\\\":\\\"213f233e-2a6b-4da6-8b20-b1ff73e132a8\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"The fishbone diagram is a cause and effect diagram to dig deeper and find the\\\\nvarious underlying problems. In our case, the fishbone diagram above identifies four\\\\nmain factors contributing to the challenge in alumni engagement where each bone has\\\\ntheir own respective effects that lead to the main cause. The first fin “Low Engagement\\\\nfrom Alumni” above is the key challenges faced by the alumni while the other four fins\\\\nare the issues faced by the Alumni Affairs and the Career Center units and root causes\\\\nfrom the previous research (Influencing Factors on Response Rate and Response\\\\n44\\\\nQuality) that are addressed in this research.\\\"}]},{\\\"id\\\":\\\"bc1c0a2b-a1ce-4fd2-9876-cc34bfbe63ef\\\",\\\"name\\\":\\\"Conceptual Framework\\\",\\\"components\\\":[{\\\"id\\\":\\\"1c5110f0-6c26-4822-83bc-d69b9ff06380\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Conceptual Framework\\\"},{\\\"id\\\":\\\"c6583958-34b0-4c59-be90-ed454ae33eb4\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"Snipaste_2024-08-31_11-14-30-5b209110-2371-4302-9b9c-0384805dbee5.png\\\"},{\\\"id\\\":\\\"46a8bfb0-9f74-404e-b5b0-f1294ca61229\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"Standard B-M-L Loop Framework\\\",\\\"style\\\":{\\\"fontAlign\\\":1,\\\"fontSize\\\":0,\\\"fontWeight\\\":2}},{\\\"id\\\":\\\"be4cde67-d026-47e7-b33c-334dcaf3a5fe\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"Snipaste_2024-08-31_11-15-36-74c8ac0c-2c90-4326-9215-48521911244a.png\\\"},{\\\"id\\\":\\\"1d2f20d3-0e03-4ce0-9ad1-fe73865341b9\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"Conceptual Framework of Alumnify\\\",\\\"style\\\":{\\\"fontSize\\\":0,\\\"fontWeight\\\":2,\\\"fontAlign\\\":1}}]},{\\\"id\\\":\\\"49be6f7c-1ec9-4370-924e-7a5e70969030\\\",\\\"name\\\":\\\"Tools\\\",\\\"components\\\":[{\\\"id\\\":\\\"0f8ccd6c-c5d6-46fd-9368-0661fc457232\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Tools\\\"},{\\\"id\\\":\\\"138aaaa0-5d73-40d7-be72-879ac32e14b6\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"Alumnify will be crafted with as a hybrid platform, employing a customized mixed of technologies to cater to its specific needs:\\\",\\\"rows\\\":[\\\"GoFiber: a lightweight and fast web framework for Go Programming Language.\\\",\\\"MySQL: an open-source relational database that is widely used for storing and managing structured data.\\\",\\\"NextJS: a Javascript framework for front-end web development.\\\"]}]},{\\\"id\\\":\\\"85546a31-f923-4515-ab23-99cb593095e6\\\",\\\"name\\\":\\\"Disclaimer\\\",\\\"components\\\":[{\\\"id\\\":\\\"665a3987-0026-4632-ad6d-602293d2ca70\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Disclaimer\\\"},{\\\"id\\\":\\\"b9821551-e1e5-452d-a78e-232dd5d9dc71\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"This project was created for the Final Year Project of class 2024 as a solution for solving the problem of Alumni Affairs and Career Centre.\\\\n\\\\nWe did not receive any incentives from the school in the cost of the production of this project.\\\",\\\"style\\\":{\\\"fontSize\\\":0}}]}]\"',
    '[{\"link\": \"https://sites.google.com/paragoniu.edu.kh/alumnify?usp=sharing\", \"title\": \"Google site\"}]',
    '{\"live\": true, \"test\": true, \"build\": true, \"design\": true, \"release\": true, \"retired\": false, \"analysis\": true, \"approved\": true, \"retiring\": false, \"chartered\": true, \"definition\": true, \"development\": true, \"requirements\": true}',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-06-27 08:32:08',
    '2024-08-31 04:20:21',
    0
  ),
  (
    7,
    'UniClub',
    '',
    NULL,
    0,
    '[]',
    '[]',
    NULL,
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-06-27 08:32:13',
    '2024-06-28 15:16:33',
    0
  ),
  (
    8,
    'SyllaBank',
    'SyllaBank is a web-application that is exist to improve academic accessibility, where students may requests and receive syllabi. Additionally, SyllaBank is also catering towards the organizational\'s side of PIU\'s syllabi management structure for ease of storing, accessing, and sharing.',
    'Syllabank-whitebg-3d8be1bb-4949-4674-9e0f-147851d00a3c.png',
    1,
    '\"[{\\\"id\\\":\\\"b1bb18c4-6cd9-415b-88c0-1d02effe0e78\\\",\\\"name\\\":\\\"Objective\\\",\\\"components\\\":[{\\\"id\\\":\\\"38efaf52-5293-4ea6-8a7b-c24352f2bd0f\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Objective\\\"},{\\\"id\\\":\\\"fc87a801-7b82-4cca-b43f-c18e9d84b05b\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"The primary objectives of this project include:\\\\n\\\",\\\"rows\\\":[\\\"ease the Provost\'s Office’s repetitive process of managing and compiling syllabi.  \\\",\\\"optimize a clear process for syllabus creation, approval, and submission to the system.\\\",\\\"provide students with access to viewing and downloading according to the courses that they have taken in their study plan. \\\",\\\"provide the heads of department and deans features of reviewing submitted syllabi from lecturers.\\\",\\\"allow the corresponding user permission according to exceptional circumstances such as a user who has a position as a lecturer, head of department, dean, and Provost’s Office.\\\"]},{\\\"id\\\":\\\"c4a54f4e-c693-45ec-af0d-4109fd9cbeb9\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Project Context\\\"},{\\\"id\\\":\\\"9db40a15-6590-4103-a705-c18fabd91cb3\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"Proposed Context Diagram-Page-3.drawio-f21a15c0-d0c0-42c3-9098-0675a7576918.png\\\"},{\\\"id\\\":\\\"b03b0d68-3a91-4065-be62-faf4dbae1bd1\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"The figure above illustrates the proposed project of SyllaBank for the administration side and students side. As it is a requirement for the evaluation and review process to be done by the head of department and dean of faculty, the project will follow the same flow but will be streamlined for ease of the process.\\\\n\\\"},{\\\"id\\\":\\\"1cbf1f31-16b2-4ae8-9dba-3a48a98edcdc\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Key Features\\\"},{\\\"id\\\":\\\"c282382e-5401-45eb-bf68-a05f0367cade\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"\\\",\\\"rows\\\":[\\\"The ability to provide controlled access for different users of different roles to have access to syllabi in the syllabi management system.\\\",\\\"Provost\'s Office, deans, heads of department, and lecturers will have the ability to create, edit, delete, suggest, comment, approve and reject syllabi. Heads of department can provide access for students to retrieve their syllabi.\\\",\\\"The platform will allow students to view, download, and share syllabi.\\\"]},{\\\"id\\\":\\\"236ae60e-b964-4146-8fe0-3ee54007784e\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Conceptual Framework\\\"},{\\\"id\\\":\\\"115efa73-649b-40a4-89e1-a3d100666968\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"image (4)-b8009eb1-40ef-4441-9bb0-4d1fee11fad8.png\\\"},{\\\"id\\\":\\\"1ad90b5f-358c-475b-9c40-06088c396136\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Summary of Findings\\\"},{\\\"id\\\":\\\"f2a58bf2-0411-4f37-8200-4d625b3c1a71\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"The researchers have found the following from the research that was done:\\\\n\\\",\\\"rows\\\":[\\\"After an insightful discussion with the Provost’s Office, it was found that they had trouble gathering the syllabi. They had to scroll through Google Classrooms and Drives repetitively to search for syllabi. The researchers provided the ability to bulk download for the Provost’s Office. They wanted the researchers to add a select all button in the bulk download feature. Furthermore, they went through the naming convention of syllabi in the system and the researchers applied the changes.\\\\n\\\",\\\"The creation of syllabus was initially done using Latex editor but after getting feedback from the panelists, they find this technique complex and difficult. So after further considerations, the researchers changed the Latex editor to dynamic form for users to input data. The panelists found this technique more acceptable and simpler. As for the evaluation of syllabus, a timeline was added to keep track of changes made to a syllabus created by lecturers.\\\\n\\\",\\\"Students initially were able to have a syllabi request link for non-affiliated individuals but after further considerations between the researchers and panelists, the feature was no longer required  and alternatively allowed students to download syllabi for their future use. \\\\n\\\",\\\"HoDs and deans have the ability to review syllabi. After the addition of the timeline, HoDs and deans are able to comment on syllabi that is being created. This would inform lecturers on the feedback that the HoDs and deans want to mention.\\\\n\\\",\\\"Users can be assigned multiple roles by the super admin or system admin so that they have features of the many roles that was assigned to them.\\\\n\\\"]},{\\\"id\\\":\\\"04e3458d-1a61-4df7-9854-55fb6b212c44\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Recommendations\\\"},{\\\"id\\\":\\\"1daba5d8-d089-4929-ad6c-80edaa9d6791\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"Based on the findings and studies, suggestions can be provided for future research that are going to further investigate on this issue:\\\\n\\\",\\\"rows\\\":[\\\"SyllaBank can be improved on the user experience for managing and compiling syllabi.\\\\n\\\",\\\"The dynamic form for syllabus creation can be improved by the future researchers. As for the evaluation process, there can be an improved timeline with a better activity log.\\\\n\\\",\\\"Adding the ability to request for share links for non-affiliated individuals could be a future improvement in terms of the system’s functionality as it was an initial scope but was not able to be implemented.\\\\n\\\",\\\"The application can be improved in terms of its user interface and user experience. Future researchers can recommend a user-friendly, intuitive design which ensure that the system will be easy to navigate for all users.\\\\n\\\",\\\"Future researchers may also integrate our system into the existing university’s student information system to simplify access and updates. This will allow students to have access into their classroom and syllabus conveniently.\\\"]}]},{\\\"id\\\":\\\"e03d6538-63a3-4ece-a571-99b5e06ae65b\\\",\\\"name\\\":\\\"Conceptual Framework\\\",\\\"components\\\":[]}]\"',
    '[]',
    NULL,
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-06-27 08:32:18',
    '2024-11-01 03:30:38',
    0
  ),
  (
    9,
    'Cur-IQA-Lum',
    '',
    NULL,
    0,
    '[]',
    '[]',
    NULL,
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-06-27 08:32:24',
    '2024-06-28 15:16:24',
    0
  ),
  (
    10,
    'TestLuy',
    'TestLuy is a payment simulator system providing easy access to test mode for students and users to test their application\'s payment gateway. It offers a sandbox environment with a dashboard for payment settings, tools for simulating purchase methods, API documentation for testing and implementation, and a mock payment gateway to support transactions in a secure environment.',
    'TestLuy Logo-d0d1f2e5-a79e-4a17-a87f-b1a6e5658d07.png',
    1,
    '\"[]\"',
    '[{\"link\": \"https://sites.google.com/paragoniu.edu.kh/testluy/home\", \"title\": \"Google site\"}]',
    '{\"live\": false, \"test\": true, \"build\": true, \"design\": true, \"release\": true, \"retired\": false, \"analysis\": true, \"approved\": true, \"retiring\": false, \"chartered\": true, \"definition\": true, \"development\": true, \"requirements\": true}',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-06-28 13:31:49',
    '2024-08-27 07:47:02',
    0
  ),
  (
    11,
    'PR Ledger',
    'PR Ledger is a mobile solution designed to effectively record and manage accounts receivable and accounts payable for informal businesses. Notably, the PR Ledger streamlines the recording of receivables by initiating payment records, where users record payments according to specified payment terms. Similarly, the process applies to accounts payable.',
    '1 - Seakliv Khou-787ca8a6-3356-4557-9caf-19e91d91b447.png',
    1,
    '\"[{\\\"id\\\":\\\"1f09dce6-09e0-4515-ac74-e49e2573c7b5\\\",\\\"name\\\":\\\"What\'s PR Ledger?\\\",\\\"components\\\":[{\\\"id\\\":\\\"7b70341d-6516-4e01-8ac4-6cea984ea26a\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"What\'s PR Ledger?\\\"},{\\\"id\\\":\\\"f0535fd5-a131-4e40-9e0c-da3955840017\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"Mobile Application work as Digital Ledger for account receivable and account payable management for any type of merchants.\\\"},{\\\"id\\\":\\\"0bc33247-5293-40bc-9d5d-191152e044a6\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Why we do?\\\"},{\\\"id\\\":\\\"89c7273c-34b3-408e-ae45-f3b99d54058d\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"Many merchants use manual methods like paper books or simple tools like note apps and Excel to track receivables and payables. While these methods are easy, they are prone to errors, inconvenience, and inefficiency. Despite the availability of platforms like QuickBooks, which offer comprehensive financial management tools, the lack of accounting knowledge among small business owners limits their ability to use. This highlights the need for an accessible solution that doesn\'t require extensive accounting knowledge to manage business finances efficiently.\\\"}]},{\\\"id\\\":\\\"487bc15d-b1de-4899-9a20-6e1bcb1cf67a\\\",\\\"name\\\":\\\"What We do?\\\",\\\"components\\\":[{\\\"id\\\":\\\"181a778b-3a0e-4fd7-aeb1-1406a3dcfa79\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"What We do?\\\"},{\\\"id\\\":\\\"ebe432e8-d268-49d7-b923-10664e425d80\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"With a vision to provide merchants with a comprehensive solution for effectively managing accounts receivable and accounts payable for improved performance of personal business owners. By offering an application with features specific to:\\\\n\\\\n(a) managing accounts receivable by simplify the process of recording the payment from customers\\\\n\\\\n(b) managing accounts payable by simplify the process of recording the payments to supplier\\\\n\\\\n(c) assisting collector role to simplify cash collection from customers.\\\"},{\\\"id\\\":\\\"8165c843-e07f-46ed-8a62-f10f40752b58\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Key Feature\\\"},{\\\"id\\\":\\\"cdbe75a7-c212-40dd-b80d-5f1b7f4e0030\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"\\\",\\\"rows\\\":[\\\"Receivable Management\\\",\\\"Payable Management\\\",\\\"Customer Management\\\",\\\"Supplier Management\\\",\\\"Collector\\\"]}]},{\\\"id\\\":\\\"91d4f5a5-a896-40c2-b880-f7d429b446fe\\\",\\\"name\\\":\\\"Diagram\\\",\\\"components\\\":[{\\\"id\\\":\\\"72967a18-9025-4e36-8874-1ded27a1440e\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Conceptual Framwork\\\"},{\\\"id\\\":\\\"c2232fab-73c0-4875-860d-e3010a09a05b\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"Screenshot 2024-08-28 at 11.53.54 at night-902f841e-946a-446c-a9d2-05c1e8912689.png\\\"},{\\\"id\\\":\\\"b5d6b5a9-ac22-4d3e-83c8-b9d3832a1666\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Fishbone Diagram\\\"},{\\\"id\\\":\\\"cb467419-bd22-463e-8fec-253505a8c706\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"Screenshot 2024-08-28 at 11.56.20 at night-82550559-02b4-4404-bfe8-1d769772d95c.png\\\"},{\\\"id\\\":\\\"3fe9bc4e-4fb1-4b27-a97b-e2dbde7c9f4a\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Product Demo\\\"},{\\\"id\\\":\\\"9d529486-dafc-4667-b608-7df7567d833b\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"UI-5a529b7a-8466-4dcf-817c-985923799fca.jpg\\\"},{\\\"id\\\":\\\"632f290c-1d8e-4eb3-8252-fe6c9f9d5727\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"48-d3fea100-0e0b-4f7a-a330-6da1a02411e4.jpg\\\"},{\\\"id\\\":\\\"e6e6ef67-3491-4ec6-8779-10801356e3e0\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"46-4ef91df0-d369-430a-ae86-a0a7bcb0bad0.jpg\\\"},{\\\"id\\\":\\\"991417f2-212f-4d1d-a3f3-abf46cd6ef29\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"47-f8a050ef-0c89-4ed2-8e46-0610e93bc6f9.jpg\\\"}]},{\\\"id\\\":\\\"ef2d8c04-ee33-456c-8c3e-509cd3d6bd45\\\",\\\"name\\\":\\\"Conclusion\\\",\\\"components\\\":[{\\\"id\\\":\\\"4f47bbf4-d5ec-40e2-a601-1af8ca7aa39a\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Conclusion & Finding\\\"},{\\\"id\\\":\\\"553ac3f0-2ea4-45bc-8d25-7c17a64cd065\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"Overall, PR Ledger system addresses the needs of merchants in tracking and managing accounts receivable and accounts payable, facilitating better financial control and improved operational efficiency. Given the findings, several improvement of PR Ledger should consider. Available on IOS device for accessibility, adding features to improve the user experience, such as attaching files to records, editing records, and managing collectors. \\\\n\\\"}]}]\"',
    '[{\"link\": \"https://sites.google.com/paragoniu.edu.kh/pr-ledger\", \"title\": \"Google site\"}]',
    '{\"live\": true, \"test\": true, \"build\": true, \"design\": true, \"release\": true, \"retired\": false, \"analysis\": true, \"approved\": true, \"retiring\": false, \"chartered\": true, \"definition\": true, \"development\": true, \"requirements\": true}',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-06-28 15:14:25',
    '2024-08-30 01:24:43',
    0
  ),
  (
    12,
    'Kitku',
    'KitKu App is a digital library for food processing with marketplace integration. It allows users to share and discover food processing recipes and methods, and connects them with sellers of food products, ingredients, and equipment. The app helps sellers showcase their products and pin their shop locations on a map, reducing delivery times by linking users with nearby sellers.',
    'KitKuLOGO - Mouthe Ty-089ef538-5e21-4fa2-a594-6232246deccc.png',
    1,
    '\"[{\\\"id\\\":\\\"9068acc4-217a-4ae1-8597-17d4c1f131b0\\\",\\\"name\\\":\\\"What is KitKu?\\\",\\\"components\\\":[{\\\"id\\\":\\\"ecf5031d-9ec3-4642-b407-38d365938a39\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"What is KitKu?\\\"},{\\\"id\\\":\\\"7b8f8958-bfb8-42c6-9c5e-ce29d26208ec\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"KitKu is a mobile application to change how the food industry in Cambodia presently deals with issues of food spoilage and market inefficiencies. KitKu acts as a digital library for food processing with marketplace integration, which ensures knowledge sharing and prolonged shelf life. It allows consumers to publish and access food processing recipes and methods, facilitates direct connections with sellers of food products, ingredients, materials and equipment, and finished processing products. It helps the sellers in effectively showcasing their products and pinning shop locations, thus cutting down the time it takes for delivery by finding nearby sellers. Vendors listed with KitKu do not offer an integrated payment-processing system; instead, buyers will need to contact the sellers directly in order to arrange a transaction.\\\",\\\"style\\\":{\\\"fontAlign\\\":0}},{\\\"id\\\":\\\"302cc6fc-ce75-4ed4-8f44-b6a909ec78ef\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Problem Statement\\\"},{\\\"id\\\":\\\"347927b1-a65e-4e33-8389-2ba6cf79fb26\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"Several impediments exist to extending the shelf life and productivity of food resources in Cambodia. Traditional practices passed down through generations usually have lower output efficiency compared to the modern ones. Inevitably, this lowers productivity and quality standards. A complex supply chain characterizes local raw materials supply blighted by high costs of transport and risk of spoilage among other factors. Besides, most of them do not have the necessary information and resources to use better food processing techniques. Therefore, they are unable to upgrade their food preparation to be more long-lasting or more palatable.\\\"},{\\\"id\\\":\\\"42635c8a-8ea9-4226-9199-339561e3b754\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"FYP2-Manuscript_KitKu-bc70c00a-9999-4caa-8220-7891f33609ed.jpg\\\"},{\\\"id\\\":\\\"93d684b5-77f7-49d8-8c82-c0a8e59f2454\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Project Objective\\\"},{\\\"id\\\":\\\"114da6f4-ce83-4ae9-a85a-f85b70de96e5\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"To develop a digital platform called \\\\\\\"KitKu\\\\\\\" that features a Food Processing Library, a Marketplace, and Map Search capabilities.\\\"},{\\\"id\\\":\\\"2f6577f1-4f9f-480c-aab2-00539f975c22\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"Offer features that allow consumers to share and access food processing methods and recipes, promoting knowledge exchange on extending the shelf life of food and preventing spoilage.\\\"}]},{\\\"id\\\":\\\"a1010b75-9687-4fdc-84db-8813670b3dc8\\\",\\\"name\\\":\\\"Project Scope\\\",\\\"components\\\":[{\\\"id\\\":\\\"62401549-11b6-434a-bfbe-3171810713fa\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Project Scope\\\"},{\\\"id\\\":\\\"acb5ffb2-215d-42b8-8644-dc20b7044b1e\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"Food Processing Library\\\",\\\"style\\\":{\\\"fontWeight\\\":2}},{\\\"id\\\":\\\"c812c77f-d719-49d2-99a9-51ee68c4eb94\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"A digital library that stores and displays food processing recipes and methods published by consumers, promoting knowledge exchange on extending the shelf life of food and preventing spoilage. \\\",\\\"style\\\":{\\\"fontWeight\\\":1}},{\\\"id\\\":\\\"22410d46-8321-4e4b-bd31-7eb6ad50efc3\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"Marketplace\\\",\\\"style\\\":{\\\"fontWeight\\\":2}},{\\\"id\\\":\\\"eb36bfc9-7a0f-45e2-a810-1e5edd96502e\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"A place where consumers can benefit by becoming sellers, allowing them to showcase and sell their products, including food, food ingredients, materials, equipment and final processed food items.\\\"},{\\\"id\\\":\\\"9aa5c561-fb5b-45c8-8f84-41ceb1fc9eee\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"Map Search System\\\",\\\"style\\\":{\\\"fontWeight\\\":2}},{\\\"id\\\":\\\"b64cadfb-0a22-4fa3-90fc-b8549381eacd\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"A system where consumers can search for products and view the shop\'s location and seller details. \\\"}]},{\\\"id\\\":\\\"c892b8e1-557a-49f1-84d3-fd32fbaab77a\\\",\\\"name\\\":\\\"Conceptual Framework\\\",\\\"components\\\":[{\\\"id\\\":\\\"adbfe3de-0359-4a66-b385-ddf574b5aef6\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Conceptual Framework\\\"},{\\\"id\\\":\\\"56b470b5-f5d8-400b-a60e-efbfde042b55\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"FRAMEWORK FYP2 - Conceptual Framework-a8b76089-7122-4fd5-a3a6-fde8650c1a34.png\\\"}]},{\\\"id\\\":\\\"02ea1dbc-9fcd-4f94-b602-f7678c5fe40b\\\",\\\"name\\\":\\\"Tool\\\",\\\"components\\\":[{\\\"id\\\":\\\"3cb2523f-a693-4f60-b0fa-996100af0ffc\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Application Technologies of KitKu\\\"},{\\\"id\\\":\\\"2aa2e5c2-0964-4fd3-bc9b-747ed6188b97\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"technologies-5be0bd74-2442-4870-9025-88ff3adc49ff.png\\\"}]},{\\\"id\\\":\\\"99493d73-bace-44c9-ac63-1b9cfa86d07b\\\",\\\"name\\\":\\\"Team\\\",\\\"components\\\":[{\\\"id\\\":\\\"7d0e58d3-d5ca-4e84-b370-d859c6b939b4\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Our Team Members\\\"},{\\\"id\\\":\\\"f1214a0f-dcd7-4114-be42-5990a2e745d6\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"Team-d7b1c8ff-f120-4633-a811-7b84d94bad7f.png\\\"}]}]\"',
    '[{\"link\": \"https://sites.google.com/paragoniu.edu.kh/kitku/home\", \"title\": \"Google site\"}]',
    '{\"live\": true, \"test\": true, \"build\": true, \"design\": true, \"release\": true, \"retired\": false, \"analysis\": true, \"approved\": true, \"retiring\": false, \"chartered\": true, \"definition\": true, \"development\": true, \"requirements\": true}',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-06-28 15:14:42',
    '2024-08-31 04:05:04',
    0
  ),
  (
    13,
    'Growth Connect',
    'This project seeks to bridge the gap between daycare centers and parents, creating a symbiotic relationship that contributes to the development of each child, redefining standards in childcare communication.',
    'Growth_Connect_logo-22c2c186-3b48-423f-a833-03f4a6418cd9.png',
    1,
    '\"[{\\\"id\\\":\\\"04512f49-2cd9-4162-8fcd-9300a3ed178f\\\",\\\"name\\\":\\\"What is Growth Connect\\\",\\\"components\\\":[{\\\"id\\\":\\\"535a3201-30c9-4834-80d5-ef2f16d27b9e\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"What is Growth Connect\\\"},{\\\"id\\\":\\\"0312540e-6954-48e3-a230-47fbba8fad86\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"It is a digital system for daycare centers and parent. We have a web application for daycare centers and able for many tenants to register and use our platform. While the parents can view updates and records of their child at daycare center.\\\"}]},{\\\"id\\\":\\\"b7671db5-a157-4160-83e7-4fb6a0c8e83a\\\",\\\"name\\\":\\\"Problem Statement\\\",\\\"components\\\":[{\\\"id\\\":\\\"23a36c23-b6bf-4e32-8715-ad83129db194\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Problem Statement\\\"},{\\\"id\\\":\\\"4033eb90-7d6f-4e92-bf15-72b1c9192033\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\" The studies provide evidence of the incoming rise and importance of daycare centers in Cambodia. Related Literature reviews also support the use of technology in enhancing parental involvement in childcare. However, the previous implementation of the Daycare center was not considered a success due to a few reasons. Such as Lack of trust by Parents and the location of the daycare center is far from their workplace and the main reason is the Disconnect between factory-working parents and their children at day care center.\\\"}]},{\\\"id\\\":\\\"4f90400e-d9cc-49db-b593-040c1831fd58\\\",\\\"name\\\":\\\"Significance of the project\\\",\\\"components\\\":[{\\\"id\\\":\\\"0d1468d2-6cb5-429c-bfd6-5522358e6b4d\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Significance of the Project\\\"},{\\\"id\\\":\\\"1d235a75-4629-4e9d-b7f6-e5c1b66b4047\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"This project holds substantial importance for working parents within the factory workforce. Its central objective is to introduce a technologically advanced application aimed at enhancing the childcare experience. In the world of modern industrial work, where professional obligations often compete with parental responsibilities, the significance of this project becomes particularly evident. The proposed application is not merely a tool for efficiency; it serves as a catalyst for a fundamental shift in how childcare is perceived and managed within the context of contemporary workforce dynamics. At its core, the project seeks to address the emotional challenges arising from the physical separation necessitated by work commitments. We seek to give the parents the documentation and records of their child when they are away at work. This serves as our main motivation for this project. \\\\n\\\"}]},{\\\"id\\\":\\\"66f7058d-3cc2-421b-b4cf-3a5f0e80bfb3\\\",\\\"name\\\":\\\"Major Features\\\",\\\"components\\\":[{\\\"id\\\":\\\"81f963b7-a86d-4821-9f63-31ee9a1e3796\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Major Features\\\"},{\\\"id\\\":\\\"4a36517d-9902-451e-9b1b-0050ac63d8b0\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"List of Features : \\\",\\\"rows\\\":[\\\" Account Management: Comprehensive account management, including adding, editing, and changing the status of accounts.\\\",\\\"Export Organization Data to CSV: Export data related to organizations to CSV format.\\\",\\\"Assign Roles: Ability to assign and manage user roles within the system.\\\",\\\"Backend Role-Based Access Control: Access control based on user roles for backend systems.\\\",\\\"Add Logs: Detailed logging of user actions and system events.\\\",\\\"Registration Process for Daycare Centers: Organizational registration process for onboarding daycare centers.\\\",\\\"Unified Database System: Central database connecting all daycare centers for unified data management.\\\",\\\"Login, Authentication, and Recovery: Secure login, authentication process, and account recovery system.\\\",\\\"Data Display: Displays data on children’s activities, staff performance, and operational metrics.\\\",\\\"Automated Child Development Report: Generates personalized child development reports based on milestones.\\\",\\\"Milestone Photo and Video Sharing: Multimedia sharing of children’s activities with parents.\\\",\\\"Web Application for Daycare Staff and Administrators: Comprehensive platform for managing daycare operations.\\\",\\\"Mobile Application for Parents: Mobile app for parent updates, reports, and engagement.\\\",\\\"Role-Based UI: User interface varies based on user roles.\\\",\\\"Multi-Tenant Architecture: Supports multiple daycare centers on a single application instance.\\\"]}]},{\\\"id\\\":\\\"41e9f692-3793-4401-be53-4915f6cf9c8c\\\",\\\"name\\\":\\\"Conceptual Framework\\\",\\\"components\\\":[{\\\"id\\\":\\\"4983b3a5-01fa-4826-a10d-10c9ad5b1ef1\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Conceptual Framework\\\"},{\\\"id\\\":\\\"dc8fc96e-6aaf-4b82-bda3-8065d72d8e52\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"Screenshot_2024-08-27_at_6.05.32_PM-0fd5dadf-115d-4041-a7ef-0196d8ac50ed.png\\\"}]},{\\\"id\\\":\\\"6532889d-0fa4-4120-b1b3-d0d66616b54d\\\",\\\"name\\\":\\\"Summary of Findings\\\",\\\"components\\\":[{\\\"id\\\":\\\"38da194f-a44a-46c2-b223-852e2ed8f52c\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Summary of Findings\\\"},{\\\"id\\\":\\\"83e54be1-4533-4067-a590-1292e1b58246\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"Development of Growth Connect Platform:\\\",\\\"rows\\\":[\\\"Objective: Develop a platform for parents to monitor child progress and for daycare centers to document and share updates with parents.\\\",\\\"Implementation Success: All functional requirements were successfully implemented, resulting in a functional web and mobile application.\\\"]},{\\\"id\\\":\\\"9145e100-6236-483b-be81-2901d8c3cc31\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"Key Features and Implementations:\\\",\\\"rows\\\":[\\\"Multi-Tenant System: Scalable architecture for multiple daycare centers, ensuring data privacy and efficient resource usage.\\\",\\\"Role-Based Access Control (RBAC) and UI: Tailored access and interfaces based on user roles, enhancing security and user experience.\\\",\\\"Mobile Application for Parents: A mobile app providing parents with updates and milestones of their child\'s development.\\\",\\\"Web Application for Daycare Staff and Administrators: Centralized management platform for documenting child progress and managing daycare accounts\\\",\\\"Milestone Tracking and Multimedia Sharing: A system for recording and sharing children’s milestones, including photos and videos, fostering stronger parent-daycare connections.\\\",\\\"Automated Child Development Reports: Automatic generation of personalized child development reports for easy documentation.\\\"]},{\\\"id\\\":\\\"01561cee-853f-4cf5-9c8d-49eaebe5ed74\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"Limitations: \\\",\\\"rows\\\":[\\\"System Adaptability: The system currently does not support multiple parent accounts per child, limiting its usefulness for families.\\\",\\\"Economic Feasibility: Developed for an NGO, limiting future enhancements and scalability due to lack of funding.\\\",\\\"Deployment Limitations: Budget constraints prevented the mobile app from being deployed on major platforms like Google Play and the App Store.\\\"]},{\\\"id\\\":\\\"f8535f43-3d05-432d-b4f4-06f78fa9de75\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"Testing and Results:\\\",\\\"rows\\\":[\\\"Testing Methods: Functional, compatibility, performance, system, and acceptance testing.\\\",\\\"Tools Used: Sauce Labs, Jmeter, and manual testing procedures.\\\",\\\"Results: High pass rates for functional requirements; minor issues resolved. Compatibility across devices confirmed; performance testing showed stability and efficiency. However, UI/UX needs improvement due to insufficient acceptance testing or user feedback.\\\"]}]},{\\\"id\\\":\\\"4348b5d0-96ca-4426-935d-3c11fc7ba322\\\",\\\"name\\\":\\\"Recommendations\\\",\\\"components\\\":[{\\\"id\\\":\\\"f95d2eb0-7aea-4bc9-ab3b-585ba9b40491\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Recommendations\\\"},{\\\"id\\\":\\\"cc9f0191-3cad-438f-b94f-7b0412de57f7\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"Lists of Recommendations of features for future developers: \\\\n\\\",\\\"rows\\\":[\\\"Khmer Language Option: Implement Khmer language support to cater to Cambodian parents and evaluate the English proficiency of factory-working parents for system usability.\\\",\\\"Live Environment Testing: Plan thoroughly for live environment testing, including securing permissions, setting up the system, training staff, and gathering feedback over an extended period.\\\",\\\"Audit Logs for Admins: Develop a monitoring page for control admins to view activities across all daycare centers and organizations, improving oversight and audit trails.\\\",\\\"Direct Messaging Feature: Add direct messaging for easier communication between parents and daycare staff, with real-time updates and notifications on both web and mobile apps.\\\",\\\"Scalability of Account Management: Improve the scalability of account management features, such as role creation and permissions, by studying flexible user management systems like Discord.\\\",\\\"Security Concerns: Address the issue of multiple device logins for a single account, ensuring users are logged out after password resets to enhance security.\\\"]}]}]\"',
    '[{\"link\": \"https://sites.google.com/view/growth-connect/home\", \"title\": \"Google site\"}]',
    '{\"live\": true, \"test\": true, \"build\": true, \"design\": true, \"release\": true, \"retired\": false, \"analysis\": true, \"approved\": true, \"retiring\": false, \"chartered\": true, \"definition\": true, \"development\": true, \"requirements\": true}',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-06-28 15:14:51',
    '2024-08-27 12:29:07',
    0
  ),
  (
    14,
    'Scientia Base',
    '',
    NULL,
    0,
    '\"[]\"',
    '[]',
    NULL,
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-06-28 15:14:57',
    '2025-06-23 07:07:09',
    0
  ),
  (
    15,
    'Unused Project 1',
    '',
    'RadiceLogo_light-141c7b9d-1b09-4ac0-b934-1aced0f979c5.png',
    0,
    '[]',
    '[]',
    '{\"live\": true, \"test\": true, \"build\": true, \"design\": true, \"release\": true, \"retired\": false, \"analysis\": true, \"approved\": true, \"retiring\": false, \"chartered\": true, \"definition\": true, \"development\": true, \"requirements\": true}',
    NULL,
    '2024-07-11 09:52:18',
    '2024-08-25 12:48:47',
    0
  ),
  (
    16,
    'RGIS',
    '',
    NULL,
    0,
    '\"[]\"',
    '[]',
    '{\"live\": true, \"test\": true, \"build\": true, \"design\": true, \"release\": true, \"retired\": false, \"analysis\": true, \"approved\": true, \"retiring\": false, \"chartered\": true, \"definition\": true, \"development\": true, \"requirements\": true}',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-07-11 13:31:46',
    '2024-08-29 15:22:41',
    0
  ),
  (
    17,
    'Srong Data',
    '',
    NULL,
    0,
    '\"[]\"',
    '[]',
    '{\"live\": true, \"test\": true, \"build\": true, \"design\": true, \"release\": true, \"retired\": false, \"analysis\": true, \"approved\": true, \"retiring\": false, \"chartered\": true, \"definition\": true, \"development\": true, \"requirements\": true}',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-07-11 13:31:59',
    '2024-08-27 06:18:23',
    0
  ),
  (
    18,
    'Radice-ALM',
    'The Radice Application Lifecycle Management system is a web-based system to showcase RaDICe projects, members, and partnerships, enabling easy access to information for the public and providing members to be able to manage various sections of the website.',
    'RadiceLogoNoText_light_square-93f3c51b-f8bf-48fe-baef-af864685e265.png',
    1,
    '\"[]\"',
    '[]',
    '{\"live\": true, \"test\": true, \"build\": true, \"design\": true, \"release\": true, \"retired\": false, \"analysis\": true, \"approved\": true, \"retiring\": false, \"chartered\": true, \"definition\": true, \"development\": true, \"requirements\": true}',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-07-30 19:09:04',
    '2025-06-02 11:01:46',
    0
  ),
  (
    19,
    'SENTIMENTIK',
    'This project aims to develop a sentiment analysis model specifically tailored for the Khmer language, focusing on customer reviews. Sentiment analysis involves processing and analyzing text data to determine the emotional tone behind the words, whether it\'s positive, negative, or neutral.',
    'PIU-CS-3b989cae-64a1-4d6c-bf44-1999a31bafce.png',
    0,
    '\"[]\"',
    '[]',
    NULL,
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-08-29 08:03:22',
    '2024-08-29 08:57:54',
    0
  ),
  (
    20,
    'UniSaga',
    'UniSaga is a gamified mobile app that transforms university life into an engaging adventure. By scanning QR codes hidden around campus, students unlock virtual cards containing information about university staff, courses, and facilities. Completing quests and collecting cards rewards students with valuable knowledge and a deeper connection to their university.',
    'UniSaga - Sakvipubp Suy-59efa3c8-6a29-489b-abaf-a3329a4e6cbb.png',
    1,
    '\"[{\\\"id\\\":\\\"25eff885-458f-404e-8b91-0f3985e39df6\\\",\\\"name\\\":\\\"Objectives of the Project\\\",\\\"components\\\":[{\\\"id\\\":\\\"1af6690a-1797-4b80-8e75-354235aea200\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"\\\"},{\\\"id\\\":\\\"f7be5d92-a319-4d24-a694-dde9daccf522\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Objective\\\"},{\\\"id\\\":\\\"664b5990-2e36-44b6-842e-f0c31636edc9\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"The main objective of this project is to develop a gamified system to potentially motivate students to explore the university and promote more engagement between students and professors.\\\\n\\\"},{\\\"id\\\":\\\"b6683086-660d-4f2b-8e06-2e774c0cef70\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"To achieve this, the researchers will seek to complete the following objectives: \\\",\\\"rows\\\":[\\\"Develop a functional mobile application (\\\\\\\"UniSaga\\\\\\\") for Android devices \\\",\\\"Implement a backend system to manage user data, quests, and card collection \\\",\\\"Deploy the system to Paragon Cloud Lab Server \\\"]}]},{\\\"id\\\":\\\"e23899a3-d1dd-4705-8fce-651bbc293ab3\\\",\\\"name\\\":\\\"Conceptual Framework\\\",\\\"components\\\":[{\\\"id\\\":\\\"3a21193b-4fe2-49d1-acb4-8b3f929b433e\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Conceptual Framework\\\"},{\\\"id\\\":\\\"2c1de9e4-d0f1-4366-9b53-465385d438df\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"FYP-ConceptualFramework-b66ac079-8676-4a4f-b386-edb4d0019d59.png\\\"},{\\\"id\\\":\\\"f885df00-a44e-4f9b-9288-b67b93e4ab24\\\",\\\"type\\\":\\\"image\\\",\\\"text\\\":\\\"FYP-ConceptualFramework2-6dfef77e-afac-494c-a664-25fc94715829.png\\\"}]},{\\\"id\\\":\\\"bf52cb2b-d0f0-48e0-947b-36e82c7a151a\\\",\\\"name\\\":\\\"Scope of The Project\\\",\\\"components\\\":[{\\\"id\\\":\\\"4bc06868-1d5a-4257-b03e-fa05379cb137\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"\\\"},{\\\"id\\\":\\\"30e43313-a8be-4cc7-939c-c460db329264\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"Scope of the project\\\"},{\\\"id\\\":\\\"3174b8fb-2896-4b2b-94f3-a7ea4da343e4\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"Web application for super-admins or admins\\\",\\\"rows\\\":[\\\"Decks and Cards management\\\",\\\"Quests management\\\",\\\"Tiers management\\\",\\\"Reputation System management\\\"]},{\\\"id\\\":\\\"20377ca2-4d64-4f66-917e-3ded185522cc\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"Mobile application for players \\\",\\\"rows\\\":[\\\"Energy system\\\",\\\"Quests\\\",\\\"Decks and Cards\\\",\\\"Card versions\\\",\\\"QR Scanner\\\",\\\"Trades\\\"]}]},{\\\"id\\\":\\\"66f7f189-3969-40c7-9bc3-aa2a20d9b27d\\\",\\\"name\\\":\\\"About Us\\\",\\\"components\\\":[{\\\"id\\\":\\\"3abd2dd5-97c2-4412-8153-242871bcde50\\\",\\\"type\\\":\\\"heading\\\",\\\"text\\\":\\\"About Us\\\"},{\\\"id\\\":\\\"fed1422a-0773-4ebb-af56-9bea02c17f11\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"Developers \\\",\\\"rows\\\":[\\\"Sakvipubp Suy\\\",\\\"Samrin Nuon\\\"]},{\\\"id\\\":\\\"744f4021-6a58-480a-925a-237cf88e9f02\\\",\\\"type\\\":\\\"list\\\",\\\"text\\\":\\\"Advisor\\\",\\\"rows\\\":[\\\"Dr.Mony Ho\\\"]},{\\\"id\\\":\\\"2a4728f2-6ea1-400c-8411-f8c3f00f0327\\\",\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"For more details, visit our Google Site! \\\\nhttps://sites.google.com/paragoniu.edu.kh/unisaga/our-project\\\\nFor our apk file, download here!\\\\nhttps://drive.google.com/drive/folders/1gHZ-KiRlZ1WKqqu_jbEHkDwcsUduxNXR?usp=drive_link\\\\n\\\"}]}]\"',
    '[{\"link\": \"https://sites.google.com/paragoniu.edu.kh/unisaga/our-project\", \"title\": \"Google site\"}]',
    '{\"live\": true, \"test\": true, \"build\": true, \"design\": true, \"release\": true, \"retired\": false, \"analysis\": true, \"approved\": true, \"retiring\": false, \"chartered\": true, \"definition\": true, \"development\": true, \"requirements\": true}',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-10-23 17:08:37',
    '2024-10-28 14:53:57',
    0
  ),
  (
    21,
    'Test Project',
    '',
    NULL,
    0,
    '\"[]\"',
    '[]',
    NULL,
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2025-06-23 07:07:00',
    '2025-06-30 08:32:57',
    1
  );

/*!40000 ALTER TABLE `projects` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `application_forms`
--
DROP TABLE IF EXISTS `application_forms`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `application_forms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `reason` varchar(5000) NOT NULL,
  `cv` varchar(2083) NOT NULL,
  `approved` varchar(50) NOT NULL DEFAULT 'Pending',
  `reviewed_by_user_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `application_forms_email_unique` (`email`),
  KEY `application_forms_reviewed_by_user_id_users_id_fk` (`reviewed_by_user_id`),
  CONSTRAINT `application_forms_reviewed_by_user_id_users_id_fk` FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `users` (`id`) ON DELETE
  SET
    NULL
) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `application_forms`
--
LOCK TABLES `application_forms` WRITE;

/*!40000 ALTER TABLE `application_forms` DISABLE KEYS */
;

INSERT INTO
  `application_forms`
VALUES
  (
    2,
    'Phearamoneath',
    'Phan',
    'pphan@paragoniu.edu.kh',
    'testing',
    'Instruction_2210000008252110-b639a82c-4c6f-4fc0-b315-7ed0e8f7897f.pdf',
    'Approved',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2025-06-20 17:10:03',
    '2025-06-20 17:10:23'
  ),
  (
    4,
    'Kolbot',
    'Pen',
    'kolbot.pen@gmail.com',
    'Testing For FLow',
    'BUS230_IntroductionSpeech-1 (1)-03d916d1-135b-44f4-9221-841078024dd4.pdf',
    'Approved',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2025-06-23 06:50:54',
    '2025-06-23 06:51:47'
  ),
  (
    5,
    'Kolbot',
    'Pen',
    'kolbotpen@gmail.com',
    'i want my picture in the cool who we are page',
    'CS394_Sec1_DecentralizedDatabase_KolbotPen-c2efff4e-a581-4e83-a760-30321eb2bf7b.pdf',
    'Approved',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2025-07-01 06:33:36',
    '2025-07-01 06:34:03'
  ),
  (
    6,
    'Sothea',
    'Seng',
    'sseng7@paragoniu.edu.kh',
    'Test',
    'CS 313 Final - Radice ALM_ Application Lifecycle Management (App Store Integrated ALM) (3)-572439a2-5dc5-4dd8-8f65-83c0b8d21f18.pdf',
    'Approved',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2025-07-01 07:47:52',
    '2025-07-01 07:48:11'
  ),
  (
    7,
    'Test',
    'Account',
    'test@gmail.com',
    'Testing',
    'CS394_Sec1_DecentralizedDatabase_KolbotPen-c2efff4e-a581-4e83-a760-30321eb2bf7b-86d55032-6bc0-4bfe-be47-5511bd906b29.pdf',
    'Approved',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2025-07-02 08:21:51',
    '2025-07-02 08:23:37'
  ),
  (
    8,
    'sothea',
    'otjesprer',
    'computer@gmail.com',
    'lsdijfalid',
    'BUS230_WelcomeSpeech-7c90420e-0ce2-45fa-a6ae-93f0bbe5e3fb.pdf',
    'Approved',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2025-07-02 08:25:19',
    '2025-07-02 08:25:35'
  );

/*!40000 ALTER TABLE `application_forms` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `project_categories`
--
DROP TABLE IF EXISTS `project_categories`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `project_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `project_categories_project_id_projects_id_fk` (`project_id`),
  KEY `project_categories_category_id_categories_id_fk` (`category_id`),
  CONSTRAINT `project_categories_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_categories_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 20 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `project_categories`
--
LOCK TABLES `project_categories` WRITE;

/*!40000 ALTER TABLE `project_categories` DISABLE KEYS */
;

INSERT INTO
  `project_categories`
VALUES
  (1, 1, 2),
  (2, 2, 2),
  (3, 10, 3),
  (4, 8, 2),
  (5, 3, 2),
  (6, 4, 2),
  (7, 5, 2),
  (8, 6, 2),
  (9, 9, 2),
  (10, 7, 2),
  (11, 11, 3),
  (12, 12, 4),
  (13, 13, 4),
  (14, 14, 5),
  (16, 17, 6),
  (17, 16, 6),
  (18, 18, 2),
  (19, 20, 5);

/*!40000 ALTER TABLE `project_categories` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `versions`
--
DROP TABLE IF EXISTS `versions`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `versions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_id` int DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `content_id` text DEFAULT NULL,
  `version_number` varchar(50) DEFAULT NULL,
  `major_version` int DEFAULT NULL,
  `minor_version` int DEFAULT NULL,
  `patch_version` int DEFAULT NULL,
  `is_current` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `versions_app_id_apps_id_fk` (`app_id`),
  KEY `versions_project_id_projects_id_fk` (`project_id`),
  CONSTRAINT `versions_app_id_apps_id_fk` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE
  SET
    NULL,
    CONSTRAINT `versions_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `versions`
--
LOCK TABLES `versions` WRITE;

/*!40000 ALTER TABLE `versions` DISABLE KEYS */
;

/*!40000 ALTER TABLE `versions` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `files`
--
DROP TABLE IF EXISTS `files`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `size` varchar(50) NOT NULL,
  `belong_to` varchar(50) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `files_filename_unique` (`filename`),
  KEY `files_user_id_users_id_fk` (`user_id`),
  KEY `files_project_id_projects_id_fk` (`project_id`),
  CONSTRAINT `files_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `files_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE
  SET
    NULL
) ENGINE = InnoDB AUTO_INCREMENT = 154 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `files`
--
LOCK TABLES `files` WRITE;

/*!40000 ALTER TABLE `files` DISABLE KEYS */
;

INSERT INTO
  `files`
VALUES
  (
    2,
    'B1t faceit-cdaa89a1-ad43-45e8-aacb-b34606d12d88.jpg',
    '15.46 kB',
    'user',
    NULL,
    NULL,
    '2024-06-24 10:25:52'
  ),
  (
    4,
    'bitpi (1)-c9fc37e8-109c-4d34-9f37-bfcb495b4200.png',
    '5.74 kB',
    'project_setting',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    NULL,
    '2024-06-27 09:51:54'
  ),
  (
    5,
    'DSC01502_1to1-7ce69ff0-4cdd-4384-b046-a03c9b72d130.png',
    '5.11 MB',
    'user',
    NULL,
    NULL,
    '2024-06-27 18:22:00'
  ),
  (
    6,
    'DSC01502_1to1-66cad14e-1124-47e3-94ab-c08c77688e78.png',
    '5.11 MB',
    'user',
    NULL,
    NULL,
    '2024-06-27 18:22:36'
  ),
  (
    8,
    'Syllabank-whitebg-3d8be1bb-4949-4674-9e0f-147851d00a3c.png',
    '11.12 kB',
    'project_setting',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    NULL,
    '2024-06-28 15:06:21'
  ),
  (
    9,
    'Scholarize-whitebg-944602c5-1e0c-415a-9e54-743ab9da892e.png',
    '15.20 kB',
    'project_setting',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    NULL,
    '2024-06-28 15:08:57'
  ),
  (
    11,
    'close-up-hand-holding-smartphone-ff740b19-8a50-4bbe-bdee-ab136d5c7dbe.jpg',
    '221.90 kB',
    'category',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    NULL,
    '2024-07-07 16:06:15'
  ),
  (
    13,
    'young-asia-businesswoman-using-laptop-talk-colleague-about-plan-video-call-meeting-while-work-from-home-living-room-b71e2285-9ab3-4d76-97ca-7336483b94b2.jpg',
    '188.08 kB',
    'category',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    NULL,
    '2024-07-07 16:06:27'
  ),
  (
    15,
    'pexels-pixabay-277124-02f4ce1a-01e1-418b-8630-2cc23ce538ba.jpg',
    '187.18 kB',
    'category',
    '0de18ca4-34ba-11ef-a8f3-bc241176b8c5',
    NULL,
    '2024-07-08 23:51:04'
  ),
  (
    16,
    'pexels-cristian-rojas-8853502-620d0acd-b990-4904-b770-556c0f468609.jpg',
    '318.84 kB',
    'category',
    '0de18ca4-34ba-11ef-a8f3-bc241176b8c5',
    NULL,
    '2024-07-08 23:51:10'
  ),
  (
    17,
    'Screenshot 2024-07-10 015020-898157ed-6dda-48fa-a527-d762a71e6e9b.png',
    '109.36 kB',
    'content_builder',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    14,
    '2024-07-09 18:51:32'
  ),
  (
    18,
    'international-day-eradication-poverty-flat-illustration-typography_421953-69624-88beb3f8-9eb3-4439-b35e-83adc5b62f4c.png',
    '382.71 kB',
    'category',
    NULL,
    NULL,
    '2024-07-11 13:42:15'
  ),
  (
    19,
    'TestLuy Logo-d0d1f2e5-a79e-4a17-a87f-b1a6e5658d07.png',
    '30.99 kB',
    'project_setting',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    NULL,
    '2024-07-12 13:02:50'
  ),
  (
    20,
    'Growth_Connect_logo-22c2c186-3b48-423f-a833-03f4a6418cd9.png',
    '147.54 kB',
    'project_setting',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    NULL,
    '2024-07-13 01:36:34'
  ),
  (
    21,
    'RadiceLogo_light-141c7b9d-1b09-4ac0-b934-1aced0f979c5.png',
    '75.24 kB',
    'project_setting',
    NULL,
    NULL,
    '2024-07-15 07:50:35'
  ),
  (
    22,
    'Screenshot (4)-336db75a-ba1c-41b5-a8ff-423f5ea6ceaf.png',
    '2.97 MB',
    'content_builder',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    8,
    '2024-07-27 15:18:01'
  ),
  (
    26,
    'RadiceLogoNoText_light_square-93f3c51b-f8bf-48fe-baef-af864685e265.png',
    '47.05 kB',
    'project_setting',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    NULL,
    '2024-07-30 19:10:14'
  ),
  (
    27,
    'jolrean.logo - Solyta Teng-664cfad5-207e-4c0d-a724-7e060eb12b03.png',
    '19.35 kB',
    'project_setting',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    NULL,
    '2024-08-07 07:47:10'
  ),
  (
    28,
    'JolRean_Classroom_Attendance_Collection_System_Using_QR_Code_with_Geolocation-b6fe43f2-34ec-4d04-877b-3ed451a58c50.pdf',
    '14.51 MB',
    'project_setting',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    4,
    '2024-08-22 09:19:16'
  ),
  (
    30,
    'Screenshot 2024-08-23 193727-7df2e2d7-6d25-41e3-99a2-aa660e07321d.png',
    '168.89 kB',
    'content_builder',
    NULL,
    4,
    '2024-08-23 12:40:34'
  ),
  (
    31,
    'Screenshot 2024-08-23 193727-99eb52c5-0a90-450c-abe6-426a777aba6f.png',
    '168.89 kB',
    'content_builder',
    NULL,
    4,
    '2024-08-23 12:40:36'
  ),
  (
    33,
    'Screenshot 2024-08-23 194238-5add8d5d-2cda-4797-af40-6987f86255c7.png',
    '131.07 kB',
    'content_builder',
    NULL,
    4,
    '2024-08-23 12:45:16'
  ),
  (
    35,
    'Screenshot 2024-08-23 195010-19fade1c-3152-442d-9a26-6184cde8cef3.png',
    '300.63 kB',
    'content_builder',
    NULL,
    4,
    '2024-08-23 12:50:30'
  ),
  (
    36,
    'KitKuLOGO - Mouthe Ty-089ef538-5e21-4fa2-a594-6232246deccc.png',
    '74.75 kB',
    'project_setting',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    NULL,
    '2024-08-23 17:13:17'
  ),
  (
    37,
    '1 - Seakliv Khou-787ca8a6-3356-4557-9caf-19e91d91b447.png',
    '136.28 kB',
    'project_setting',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    NULL,
    '2024-08-27 06:11:21'
  ),
  (
    38,
    'MY (3) - Daravid Ngauv-40112a72-9149-431a-ba61-bf646b6eeab7.png',
    '9.84 kB',
    'project_setting',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    NULL,
    '2024-08-27 06:14:29'
  ),
  (
    39,
    'Alumnify_Logo - Sambathmonyneath Pich-d980d6a0-0733-478d-9e3e-163434519e8a.png',
    '5.56 kB',
    'project_setting',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    NULL,
    '2024-08-27 06:16:01'
  ),
  (
    40,
    'Final - FYP - Growth Connect Mobile Application FYP Capstone Project-d8ff5145-0361-481c-baa8-34d9aeb0ad1f.pdf',
    '12.52 MB',
    'project_setting',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    13,
    '2024-08-27 06:48:23'
  ),
  (
    49,
    'Screenshot_2024-08-27_at_6.05.32_PM-94a768d1-080a-4840-82a8-ec90ea9f6373.png',
    '193.24 kB',
    'content_builder',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    13,
    '2024-08-27 11:15:41'
  ),
  (
    56,
    'Screenshot_2024-08-27_at_6.05.32_PM-0fd5dadf-115d-4041-a7ef-0196d8ac50ed.png',
    '193.24 kB',
    'content_builder',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    13,
    '2024-08-27 11:29:17'
  ),
  (
    57,
    'IMG_20240828_211748_204 - Rotnak Hang-4fde65a1-768d-4115-b1ff-1e4b15c6ca8b.png',
    '39.56 kB',
    'project_setting',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    NULL,
    '2024-08-28 14:38:29'
  ),
  (
    59,
    '2-3ae178c0-278c-4fc2-a16f-aabce9961ad5.png',
    '91.33 kB',
    'content_builder',
    NULL,
    11,
    '2024-08-28 16:23:16'
  ),
  (
    64,
    'Screenshot 2024-08-28 at 11.53.54 at night-902f841e-946a-446c-a9d2-05c1e8912689.png',
    '152.90 kB',
    'content_builder',
    NULL,
    11,
    '2024-08-28 17:10:25'
  ),
  (
    66,
    'Screenshot 2024-08-28 at 11.56.20 at night-82550559-02b4-4404-bfe8-1d769772d95c.png',
    '208.27 kB',
    'content_builder',
    NULL,
    11,
    '2024-08-28 17:10:33'
  ),
  (
    69,
    'PR Ledger_Documentation Video-79355188-4461-404f-bec5-6748d13acf63.jpg',
    '307.32 kB',
    'content_builder',
    NULL,
    11,
    '2024-08-28 17:15:27'
  ),
  (
    71,
    'PR Ledger_Documentation Video (1)-25cdc9d6-d312-45a7-a610-edf6749b8f9d.jpg',
    '309.74 kB',
    'content_builder',
    NULL,
    11,
    '2024-08-28 17:17:54'
  ),
  (
    72,
    'UI-5a529b7a-8466-4dcf-817c-985923799fca.jpg',
    '127.44 kB',
    'content_builder',
    NULL,
    11,
    '2024-08-28 17:24:06'
  ),
  (
    73,
    '48-d3fea100-0e0b-4f7a-a330-6da1a02411e4.jpg',
    '88.27 kB',
    'content_builder',
    NULL,
    11,
    '2024-08-28 17:24:17'
  ),
  (
    74,
    '46-4ef91df0-d369-430a-ae86-a0a7bcb0bad0.jpg',
    '99.81 kB',
    'content_builder',
    NULL,
    11,
    '2024-08-28 17:24:27'
  ),
  (
    75,
    '47-f8a050ef-0c89-4ed2-8e46-0610e93bc6f9.jpg',
    '93.23 kB',
    'content_builder',
    NULL,
    11,
    '2024-08-28 17:24:53'
  ),
  (
    83,
    'Screenshot 2024-08-29 at 11.46.22 in the morning-9dc5dc1d-4d44-4f78-8887-9a3525bccef5.png',
    '481.12 kB',
    'content_builder',
    '23771528-6448-11ef-b0a8-bc241176b8c5',
    1,
    '2024-08-29 04:46:36'
  ),
  (
    85,
    'Screenshot 2024-08-29 at 11.47.12 in the morning-ae17471d-0ed6-49f8-acdf-d0386e1b4fb4.png',
    '157.11 kB',
    'content_builder',
    '23771528-6448-11ef-b0a8-bc241176b8c5',
    1,
    '2024-08-29 04:47:27'
  ),
  (
    87,
    'Screenshot 2024-08-29 at 11.54.15 in the morning-ae9da1a9-5803-4772-b888-77a8f2a28058.png',
    '271.50 kB',
    'content_builder',
    '23771528-6448-11ef-b0a8-bc241176b8c5',
    1,
    '2024-08-29 04:54:50'
  ),
  (
    89,
    'Screenshot 2024-08-29 at 11.53.53 in the morning-feae0a9f-431d-4830-a977-edcc5b49d95c.png',
    '99.61 kB',
    'content_builder',
    '23771528-6448-11ef-b0a8-bc241176b8c5',
    1,
    '2024-08-29 04:54:58'
  ),
  (
    92,
    '1 (3)-418da5bf-0e16-4832-8220-195568bc8bc5.png',
    '1011.64 kB',
    'content_builder',
    '23771528-6448-11ef-b0a8-bc241176b8c5',
    1,
    '2024-08-29 05:00:48'
  ),
  (
    97,
    'Screenshot 2024-08-29 at 12.20.19 in the afternoon-958151af-e9fe-47bd-ad16-54d2f3f601c1.png',
    '1011.31 kB',
    'content_builder',
    '23771528-6448-11ef-b0a8-bc241176b8c5',
    1,
    '2024-08-29 05:21:01'
  ),
  (
    98,
    'Alumnify Final_Final_Manuscript-3signed-7abe09af-e8cb-4999-8715-abaecee9d67f.pdf',
    '10.25 MB',
    'project_setting',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    6,
    '2024-08-29 07:32:10'
  ),
  (
    99,
    'PIU-CS-3b989cae-64a1-4d6c-bf44-1999a31bafce.png',
    '46.01 kB',
    'project_setting',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    NULL,
    '2024-08-29 08:11:33'
  ),
  (
    100,
    'PR Final V3-08c512d7-249d-4df2-be16-c47deab00c88.pdf',
    '9.27 MB',
    'project_setting',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    11,
    '2024-08-29 08:29:29'
  ),
  (
    102,
    'Screenshot 2024-08-29 at 11.47.12 in the morning-1e362a23-c0da-4827-b2cf-626a0ca3cf77.png',
    '157.11 kB',
    'content_builder',
    '23771528-6448-11ef-b0a8-bc241176b8c5',
    1,
    '2024-08-29 08:36:57'
  ),
  (
    103,
    '_SENTIMENTIK_ A SENTIMENT ANALYSIS FOR KHMER TEXT STUDY ON THE DEVELOPMENT OF NLP METHODS IN CUSTOMER REVIEW DATA-460ed20a-5a78-4436-8baa-6bdb16b5307d.docx',
    '7.27 kB',
    'project_setting',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    19,
    '2024-08-29 09:01:18'
  ),
  (
    109,
    'Pizigani_1367_Chart_10MB-82b1aa55-5558-418e-ac90-14a3ed03a798.jpg',
    '9.70 MB',
    'content_builder',
    '0de18ca4-34ba-11ef-a8f3-bc241176b8c5',
    18,
    '2024-08-29 15:33:33'
  ),
  (
    113,
    'FYP2-Manuscript_KitKu-bc70c00a-9999-4caa-8220-7891f33609ed.jpg',
    '42.36 kB',
    'content_builder',
    NULL,
    12,
    '2024-08-30 04:23:11'
  ),
  (
    114,
    'FRAMEWORK FYP2 - Conceptual Framework-a8b76089-7122-4fd5-a3a6-fde8650c1a34.png',
    '111.75 kB',
    'content_builder',
    NULL,
    12,
    '2024-08-30 04:26:32'
  ),
  (
    118,
    'Team-d7b1c8ff-f120-4633-a811-7b84d94bad7f.png',
    '214.71 kB',
    'content_builder',
    NULL,
    12,
    '2024-08-30 04:30:28'
  ),
  (
    120,
    'technologies-5be0bd74-2442-4870-9025-88ff3adc49ff.png',
    '124.09 kB',
    'content_builder',
    NULL,
    12,
    '2024-08-31 04:05:04'
  ),
  (
    122,
    'Snipaste_2024-08-31_11-11-06-e24dcd57-1d45-44a3-a058-35bf1bda5bc7.png',
    '211.85 kB',
    'content_builder',
    NULL,
    6,
    '2024-08-31 04:11:23'
  ),
  (
    124,
    'Snipaste_2024-08-31_11-14-30-5b209110-2371-4302-9b9c-0384805dbee5.png',
    '100.58 kB',
    'content_builder',
    NULL,
    6,
    '2024-08-31 04:14:55'
  ),
  (
    126,
    'Snipaste_2024-08-31_11-15-36-74c8ac0c-2c90-4326-9215-48521911244a.png',
    '244.91 kB',
    'content_builder',
    NULL,
    6,
    '2024-08-31 04:15:46'
  ),
  (
    128,
    'Screenshot 2024-09-03 at 2.52.48 in the afternoon-fa04d6b2-b5fb-4407-883c-18e39c74e28f.png',
    '1000.01 kB',
    'content_builder',
    '23771528-6448-11ef-b0a8-bc241176b8c5',
    1,
    '2024-09-03 07:53:13'
  ),
  (
    130,
    'no-profile-picture-icon-12-2f5dc61c-fee8-472c-a068-b7d1dadddfd5.webp',
    '5.79 kB',
    'user',
    NULL,
    NULL,
    '2024-10-23 16:02:37'
  ),
  (
    131,
    'UniSaga - Sakvipubp Suy-59efa3c8-6a29-489b-abaf-a3329a4e6cbb.png',
    '82.09 kB',
    'project_setting',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    NULL,
    '2024-10-23 17:12:07'
  ),
  (
    134,
    'FYP-ConceptualFramework2-80936cac-e399-4b72-a243-adddcadcca91.png',
    '178.97 kB',
    'content_builder',
    NULL,
    20,
    '2024-10-23 18:06:11'
  ),
  (
    135,
    'FYP-ConceptualFramework-b66ac079-8676-4a4f-b386-edb4d0019d59.png',
    '246.23 kB',
    'content_builder',
    NULL,
    20,
    '2024-10-23 18:06:54'
  ),
  (
    137,
    'FYP-ConceptualFramework2-6dfef77e-afac-494c-a664-25fc94715829.png',
    '178.97 kB',
    'content_builder',
    NULL,
    20,
    '2024-10-23 18:07:01'
  ),
  (
    138,
    'Manuscript_Final-0097a9c2-9d88-42ff-95d7-1982cf08ed8b.pdf',
    '13.94 MB',
    'project_setting',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    20,
    '2024-10-23 18:24:20'
  ),
  (
    140,
    'image (4)-b8009eb1-40ef-4441-9bb0-4d1fee11fad8.png',
    '313.95 kB',
    'content_builder',
    NULL,
    8,
    '2024-10-30 17:38:08'
  ),
  (
    141,
    'Proposed Context Diagram-Page-3.drawio-f21a15c0-d0c0-42c3-9098-0675a7576918.png',
    '198.67 kB',
    'content_builder',
    NULL,
    8,
    '2024-11-01 03:25:05'
  ),
  (
    143,
    'Instruction_2210000008252110-b639a82c-4c6f-4fc0-b315-7ed0e8f7897f.pdf',
    '78.90 kB',
    'application_form',
    NULL,
    NULL,
    '2025-06-20 17:10:03'
  ),
  (
    145,
    'BUS230_IntroductionSpeech-1 (1)-03d916d1-135b-44f4-9221-841078024dd4.pdf',
    '50.81 kB',
    'application_form',
    NULL,
    NULL,
    '2025-06-23 06:50:54'
  ),
  (
    147,
    'gns3_epermit_architecture_diagram-122deaf0-4e11-4d56-b393-6ea6bdd2f6f5.png',
    '90.26 kB',
    'content_builder',
    NULL,
    14,
    '2025-06-23 06:59:03'
  ),
  (
    148,
    'thebends-a37bc490-7094-471f-ac4d-51ce3f16ebd2.jpeg',
    '138.46 kB',
    'user',
    NULL,
    NULL,
    '2025-06-23 07:01:13'
  ),
  (
    149,
    'CS394_Sec1_DecentralizedDatabase_KolbotPen-66f6dd03-abc3-4983-a596-dcf1f50167a7.pdf',
    '1.43 MB',
    'application_form',
    NULL,
    NULL,
    '2025-07-01 06:33:27'
  ),
  (
    150,
    'CS394_Sec1_DecentralizedDatabase_KolbotPen-c2efff4e-a581-4e83-a760-30321eb2bf7b.pdf',
    '1.43 MB',
    'application_form',
    NULL,
    NULL,
    '2025-07-01 06:33:36'
  ),
  (
    151,
    'CS 313 Final - Radice ALM_ Application Lifecycle Management (App Store Integrated ALM) (3)-572439a2-5dc5-4dd8-8f65-83c0b8d21f18.pdf',
    '166.97 kB',
    'application_form',
    NULL,
    NULL,
    '2025-07-01 07:47:52'
  ),
  (
    152,
    'CS394_Sec1_DecentralizedDatabase_KolbotPen-c2efff4e-a581-4e83-a760-30321eb2bf7b-86d55032-6bc0-4bfe-be47-5511bd906b29.pdf',
    '1.43 MB',
    'application_form',
    NULL,
    NULL,
    '2025-07-02 08:21:51'
  ),
  (
    153,
    'BUS230_WelcomeSpeech-7c90420e-0ce2-45fa-a6ae-93f0bbe5e3fb.pdf',
    '45.54 kB',
    'application_form',
    NULL,
    NULL,
    '2025-07-02 08:25:19'
  );

/*!40000 ALTER TABLE `files` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `apps`
--
DROP TABLE IF EXISTS `apps`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `apps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `type` int DEFAULT NULL,
  `about_desc` varchar(1000) DEFAULT NULL,
  `content` text,
  `web_url` varchar(500) DEFAULT NULL,
  `app_file` varchar(500) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `card_image` varchar(500) DEFAULT NULL,
  `banner_image` varchar(500) DEFAULT NULL,
  `featured_priority` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `apps_project_id_projects_id_fk` (`project_id`),
  KEY `apps_type_app_types_id_fk` (`type`),
  KEY `apps_featured_priority_app_priority_id_fk` (`featured_priority`),
  CONSTRAINT `apps_featured_priority_app_priority_id_fk` FOREIGN KEY (`featured_priority`) REFERENCES `app_priority` (`id`),
  CONSTRAINT `apps_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  CONSTRAINT `apps_type_app_types_id_fk` FOREIGN KEY (`type`) REFERENCES `app_types` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 20 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `apps`
--
LOCK TABLES `apps` WRITE;

/*!40000 ALTER TABLE `apps` DISABLE KEYS */
;

INSERT INTO
  `apps`
VALUES
  (
    1,
    3,
    'Educational Platform',
    3,
    'This application is made to satisfy Neil\'s needs.',
    'I WANT TO KILL MYSELF',
    NULL,
    NULL,
    'pending',
    NULL,
    NULL,
    1,
    '2025-06-30 08:37:35',
    '2025-07-02 13:09:08'
  ),
  (
    2,
    1,
    'This is Scholarize',
    2,
    'This application is made to satisfy Neil\'s needs.',
    'I WANT TO KILL MYSELF',
    NULL,
    NULL,
    'accepted',
    NULL,
    NULL,
    2,
    '2025-06-30 08:48:48',
    '2025-07-03 08:50:14'
  ),
  (
    6,
    2,
    'TESTING ',
    1,
    'chhay is gay chhay is gay chhay is gay chhay is gay chhay is gay chhay is gay chhay is gay ',
    'chhay is gay chhay is gay chhay is gay ',
    'https://radice.paragoniu.app/',
    NULL,
    'accepted',
    NULL,
    NULL,
    1,
    '2025-07-01 17:04:44',
    '2025-07-02 06:36:15'
  ),
  (
    11,
    1,
    'This is Scholarize',
    3,
    'This application is made to satisfy Neil\'s needs.',
    'I WANT TO KILL MYSELF',
    NULL,
    NULL,
    'accepted',
    NULL,
    NULL,
    1,
    '2025-07-03 08:50:26',
    '2025-07-03 09:38:03'
  ),
  (
    12,
    4,
    'LOL',
    2,
    'fuck neil fuck neil fuck neil fuck neil fuck neil fuck neil fuck neil fuck neil fuck neil fuck neil fuck neil fuck neil ',
    'fuck neil fuck neil ',
    NULL,
    NULL,
    'accepted',
    NULL,
    NULL,
    2,
    '2025-07-03 09:31:42',
    '2025-07-03 09:38:03'
  ),
  (
    13,
    2,
    'chealinh',
    1,
    'wtf is this',
    'huh huh huh huh huh huh huh huh ',
    NULL,
    NULL,
    'accepted',
    NULL,
    NULL,
    1,
    '2025-07-03 09:31:48',
    '2025-07-03 09:38:03'
  ),
  (
    14,
    5,
    'chan',
    3,
    'tf boom boom boom boom ',
    'lol lol lol lol lol lol lol lol lol lol ',
    NULL,
    NULL,
    'accepted',
    NULL,
    NULL,
    2,
    '2025-07-03 09:31:54',
    '2025-07-03 09:38:03'
  ),
  (
    15,
    6,
    'pen',
    2,
    'boom boom boom boom ',
    'boom boom boom boom boom boom boom boom boom boom boom boom ',
    NULL,
    NULL,
    'accepted',
    NULL,
    NULL,
    1,
    '2025-07-03 09:31:58',
    '2025-07-03 09:38:03'
  ),
  (
    16,
    7,
    'kol',
    1,
    'info info info info info info info info ',
    'info info info info ',
    NULL,
    NULL,
    'accepted',
    NULL,
    NULL,
    2,
    '2025-07-03 09:32:02',
    '2025-07-03 09:38:03'
  ),
  (
    17,
    8,
    'bot',
    3,
    'HELOSA SADON SALKD sadpasj d',
    'dsaiojdoiasjndio a',
    NULL,
    NULL,
    'accepted',
    NULL,
    NULL,
    2,
    '2025-07-03 09:32:05',
    '2025-07-03 09:40:10'
  ),
  (
    18,
    9,
    'so',
    2,
    'saidjiapsdjaspid',
    'dsakldnaskndasd',
    NULL,
    NULL,
    'accepted',
    NULL,
    NULL,
    2,
    '2025-07-03 09:32:11',
    '2025-07-03 09:38:03'
  ),
  (
    19,
    10,
    'tea',
    1,
    'saandlksadalsnkd',
    'anskldnalskndasd',
    NULL,
    NULL,
    'accepted',
    NULL,
    NULL,
    2,
    '2025-07-03 09:32:16',
    '2025-07-03 09:39:53'
  );

/*!40000 ALTER TABLE `apps` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `sessions`
--
DROP TABLE IF EXISTS `sessions`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_users_id_fk` (`user_id`),
  CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `sessions`
--
LOCK TABLES `sessions` WRITE;

/*!40000 ALTER TABLE `sessions` DISABLE KEYS */
;

INSERT INTO
  `sessions`
VALUES
  (
    '254uxjau3oeifdwokw4yvr3xrvjelzsaimxc5zuy',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2025-07-14 08:34:30',
    '2025-06-30 08:34:29',
    '2025-06-30 08:34:29'
  ),
  (
    '3x75cdzfjxnliu8um3o9chpbclt8a2xj5mi4vxtd',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-08-13 19:06:47',
    '2024-07-23 11:02:23',
    '2024-07-30 19:06:46'
  ),
  (
    '4edvfl5z5ceiv55mvsyzw2zk8hzp57yd6omcpx2t',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-07-21 16:04:45',
    '2024-06-27 18:52:39',
    '2024-07-07 16:04:44'
  ),
  (
    '597he02y4b01neb8m72pdbpg9qpgtjr3znk9eg8n',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-09-12 11:51:00',
    '2024-08-22 09:18:34',
    '2024-08-29 11:50:59'
  ),
  (
    '93qju00b1vofae5ysqb96ptsk7ufnlr0u0ceadu3',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2025-07-04 16:38:30',
    '2025-06-20 16:38:30',
    '2025-06-20 16:38:30'
  ),
  (
    'dmtusdhui7mgq3bhffhw9j6pegarsc2g8pxywlnf',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-11-25 07:07:39',
    '2024-10-23 15:53:06',
    '2024-11-11 07:07:38'
  ),
  (
    'f27blzdyrpd7i7pyn5djfno7amyo7s3yleexjgsa',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2025-07-16 08:33:07',
    '2025-07-02 08:33:06',
    '2025-07-02 08:33:06'
  ),
  (
    'g1yoaqtpzkh2gxoe9d5td50t8r2m8749zquo5ixy',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-08-21 08:09:55',
    '2024-07-26 10:16:40',
    '2024-08-07 08:09:54'
  ),
  (
    'hmrfeiied7tnowhfljtw5n8sj6f4jpxzh7ltzef1',
    '3c532c4e-654b-11ef-b0a8-bc241176b8c5',
    '2024-09-11 16:42:57',
    '2024-08-28 16:42:56',
    '2024-08-28 16:42:56'
  ),
  (
    'ivhidakz6jc2xtmxau62w2xl6tqwe2d3yofiybv7',
    '20dde738-571e-11f0-952a-daec5656b813',
    '2025-07-16 08:32:40',
    '2025-07-02 08:32:40',
    '2025-07-02 08:32:40'
  ),
  (
    'jdbirknelsqinserlhk6rkfefnoyd7topzgrbxm7',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2025-07-16 06:08:38',
    '2025-07-02 06:08:44',
    '2025-07-02 06:08:44'
  ),
  (
    'ngc6c99vi6on4d86fy0qd4xhyfxb5bul70vl1vgs',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-09-10 07:53:51',
    '2024-08-27 07:53:50',
    '2024-08-27 07:53:50'
  ),
  (
    'nzovmn09qvadtymm9h86p8fd6hhizkosp6j36dj8',
    '3c532c4e-654b-11ef-b0a8-bc241176b8c5',
    '2024-09-12 07:19:48',
    '2024-08-29 07:19:47',
    '2024-08-29 07:19:47'
  ),
  (
    'o5p6z3m42g3iww3xrohs1fqf78b02sxmmn1pu7y4',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-09-21 03:07:30',
    '2024-08-29 11:51:18',
    '2024-09-07 03:07:29'
  ),
  (
    'oc52sdx3eg75w4305y8aksjkof9ireot3d0xr4m6',
    '23771528-6448-11ef-b0a8-bc241176b8c5',
    '2025-02-04 10:09:41',
    '2025-01-21 10:09:40',
    '2025-01-21 10:09:40'
  ),
  (
    'okiaavubw2wtpp7utg2636e4a5ks4mws3cklwexg',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2025-07-16 08:25:28',
    '2025-07-02 08:25:28',
    '2025-07-02 08:25:28'
  ),
  (
    'olizmjay6jt03alp2kyd6gw6dxt05e18bgc1d6rr',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-08-29 06:59:27',
    '2024-08-07 07:45:08',
    '2024-08-15 06:59:26'
  ),
  (
    'qw1q3b4y0efddsng9ev88byg2dokbsmjay28w8qn',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-09-05 09:17:35',
    '2024-08-15 06:59:46',
    '2024-08-22 09:17:35'
  ),
  (
    'rw7iedk7uks0859rs4bxzr3nysb9dsux8tr0bmw1',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-09-30 03:09:21',
    '2024-09-07 03:07:52',
    '2024-09-16 03:09:21'
  ),
  (
    'spxnpj5d9zthe0auxu6s8rlhqbef6rxo1hssa8gv',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2025-07-04 16:34:22',
    '2025-06-20 16:34:21',
    '2025-06-20 16:34:21'
  ),
  (
    'u8dbxctm4jojj5hryhegpt2dibgs93nxego06tnf',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-08-01 09:45:12',
    '2024-07-05 06:01:56',
    '2024-07-18 09:45:11'
  ),
  (
    'v4ehil9qn4atqkkyyv62mh4a8ajmkta9b8dihb2u',
    '23771528-6448-11ef-b0a8-bc241176b8c5',
    '2024-09-17 07:50:39',
    '2024-08-27 07:44:41',
    '2024-09-03 07:50:38'
  ),
  (
    'v833dgym0ielmpe35cvg7j7ryyonzkks5nw7i9iq',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2024-10-07 17:01:37',
    '2024-09-16 03:11:46',
    '2024-09-23 17:01:36'
  ),
  (
    'wps1du66ioaxy7bdeuw2jptf4a7c9dwjguans3y0',
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    '2025-07-03 12:55:52',
    '2025-06-19 12:55:51',
    '2025-06-19 12:55:51'
  );

/*!40000 ALTER TABLE `sessions` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `project_partners`
--
DROP TABLE IF EXISTS `project_partners`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `project_partners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `partner_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `project_partners_project_id_projects_id_fk` (`project_id`),
  KEY `project_partners_partner_id_users_id_fk` (`partner_id`),
  CONSTRAINT `project_partners_partner_id_users_id_fk` FOREIGN KEY (`partner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_partners_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `project_partners`
--
LOCK TABLES `project_partners` WRITE;

/*!40000 ALTER TABLE `project_partners` DISABLE KEYS */
;

/*!40000 ALTER TABLE `project_partners` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `roles`
--
DROP TABLE IF EXISTS `roles`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `roles`
--
LOCK TABLES `roles` WRITE;

/*!40000 ALTER TABLE `roles` DISABLE KEYS */
;

INSERT INTO
  `roles`
VALUES
  (
    1,
    'Admin',
    NULL,
    1,
    '2024-06-29 04:02:54',
    '2024-06-29 04:02:54'
  ),
  (
    2,
    'Alumni',
    NULL,
    1,
    '2024-08-07 07:49:01',
    '2024-08-07 07:49:01'
  );

/*!40000 ALTER TABLE `roles` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `permissions`
--
DROP TABLE IF EXISTS `permissions`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `permissions` (
  `id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_unique` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `permissions`
--
LOCK TABLES `permissions` WRITE;

/*!40000 ALTER TABLE `permissions` DISABLE KEYS */
;

INSERT INTO
  `permissions`
VALUES
  (
    1,
    'Create users',
    'Permission to create users',
    1,
    '2024-06-24 10:09:26',
    '2024-06-24 10:09:26'
  ),
  (
    3,
    'Delete users',
    'Permission to delete users',
    1,
    '2024-06-24 10:09:26',
    '2024-06-24 10:09:26'
  ),
  (
    4,
    'Create categories',
    'Permission to create categories',
    1,
    '2024-06-24 10:09:26',
    '2024-06-24 10:09:26'
  ),
  (
    5,
    'Edit categories',
    'Permission to edit categories',
    1,
    '2024-06-24 10:09:26',
    '2024-06-24 10:09:26'
  ),
  (
    6,
    'Delete categories',
    'Permission to delete categories',
    1,
    '2024-06-24 10:09:26',
    '2024-06-24 10:09:26'
  ),
  (
    7,
    'Create roles',
    'Permission to create roles',
    1,
    '2024-06-24 10:09:26',
    '2024-06-24 10:09:26'
  ),
  (
    8,
    'Edit roles',
    'Permission to edit roles',
    1,
    '2024-06-24 10:09:26',
    '2024-06-24 10:09:26'
  ),
  (
    9,
    'Delete roles',
    'Permission to delete roles',
    1,
    '2024-06-24 10:09:26',
    '2024-06-24 10:09:26'
  ),
  (
    10,
    'Create partners',
    'Permission to create partners',
    1,
    '2024-06-24 10:09:26',
    '2024-06-24 10:09:26'
  ),
  (
    12,
    'Delete partners',
    'Permission to delete partners',
    1,
    '2024-06-24 10:09:26',
    '2024-06-24 10:09:26'
  ),
  (
    13,
    'Approve and reject application forms',
    'Permission to approve and reject application forms',
    1,
    '2024-06-24 10:09:26',
    '2024-06-24 10:09:26'
  ),
  (
    14,
    'Create own projects',
    'Permission to create own projects',
    1,
    '2024-06-24 10:09:26',
    '2024-06-24 10:09:26'
  ),
  (
    15,
    'Change project status',
    'Permission to change project status',
    1,
    '2024-06-24 10:09:26',
    '2024-06-24 10:09:26'
  ),
  (
    17,
    'Create media',
    'Permission to create media',
    1,
    '2024-06-24 10:09:26',
    '2024-06-24 10:09:26'
  ),
  (
    18,
    'Edit media',
    'Permission to edit media',
    1,
    '2024-06-24 10:09:26',
    '2024-06-24 10:09:26'
  ),
  (
    19,
    'Delete media',
    'Permission to delete media',
    1,
    '2024-06-24 10:09:26',
    '2024-06-24 10:09:26'
  );

/*!40000 ALTER TABLE `permissions` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `feedbacks`
--
DROP TABLE IF EXISTS `feedbacks`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `feedbacks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tester_id` varchar(255) DEFAULT NULL,
  `app_id` int DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `review` text,
  `star_rating` enum('1', '2', '3', '4', '5') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `feedbacks_tester_id_testers_id_fk` (`tester_id`),
  KEY `feedbacks_app_id_apps_id_fk` (`app_id`),
  CONSTRAINT `feedbacks_app_id_apps_id_fk` FOREIGN KEY (`app_id`) REFERENCES `apps` (`id`) ON DELETE CASCADE,
  CONSTRAINT `feedbacks_tester_id_testers_id_fk` FOREIGN KEY (`tester_id`) REFERENCES `testers` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 17 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `feedbacks`
--
LOCK TABLES `feedbacks` WRITE;

/*!40000 ALTER TABLE `feedbacks` DISABLE KEYS */
;

INSERT INTO
  `feedbacks`
VALUES
  (
    1,
    NULL,
    6,
    'Test feedback',
    'This is a description of the feedback',
    '1',
    '2025-07-01 14:54:38',
    '2025-07-02 07:58:01'
  ),
  (
    2,
    NULL,
    6,
    'best fucking feedback',
    'This is the best app ever',
    '5',
    '2025-07-01 15:06:36',
    '2025-07-02 07:58:02'
  ),
  (
    3,
    NULL,
    6,
    'fuckass app',
    'chhay is gay',
    '4',
    '2025-07-02 08:39:14',
    '2025-07-02 08:39:14'
  ),
  (
    4,
    NULL,
    6,
    'kolbot small pp',
    'ponloe is gay',
    '1',
    '2025-07-02 08:40:40',
    '2025-07-02 08:40:40'
  ),
  (
    5,
    NULL,
    2,
    'testing1',
    'testing ?',
    '3',
    '2025-07-02 09:23:56',
    '2025-07-02 09:23:56'
  ),
  (
    6,
    NULL,
    6,
    'dick',
    'ponloe is a dick',
    '4',
    '2025-07-02 10:31:38',
    '2025-07-02 10:31:38'
  ),
  (
    7,
    NULL,
    2,
    'test',
    'does this work?',
    '5',
    '2025-07-02 15:20:30',
    '2025-07-02 15:20:30'
  ),
  (
    8,
    'ef1712c0-57ed-11f0-952a-daec5656b813',
    1,
    'best fucking feedback',
    'This is the best app ever',
    '5',
    '2025-07-03 09:14:03',
    '2025-07-03 09:14:03'
  ),
  (
    9,
    NULL,
    6,
    'asdas',
    'sadasdd asdkopasd',
    '4',
    '2025-07-03 09:42:45',
    '2025-07-03 09:42:45'
  ),
  (
    10,
    NULL,
    6,
    'sadasda s',
    'asdasd',
    '3',
    '2025-07-03 09:43:02',
    '2025-07-03 09:43:02'
  ),
  (
    11,
    NULL,
    6,
    'sadas',
    'sadasd',
    '4',
    '2025-07-03 09:45:17',
    '2025-07-03 09:45:17'
  ),
  (
    12,
    NULL,
    6,
    'gay is chhay',
    'gay',
    '4',
    '2025-07-03 09:48:55',
    '2025-07-03 09:48:55'
  ),
  (
    13,
    NULL,
    6,
    'sadas',
    'sadasd',
    '3',
    '2025-07-03 09:57:21',
    '2025-07-03 09:57:21'
  ),
  (
    14,
    NULL,
    6,
    'sadas',
    'sadasd',
    '4',
    '2025-07-03 10:03:21',
    '2025-07-03 10:03:21'
  ),
  (
    15,
    NULL,
    6,
    'rctfyvg',
    'vuhjk',
    '1',
    '2025-07-03 10:15:34',
    '2025-07-03 10:15:34'
  ),
  (
    16,
    'ef1712c0-57ed-11f0-952a-daec5656b813',
    1,
    'best feedback',
    'This is the best nude ever',
    '4',
    '2025-07-03 14:40:32',
    '2025-07-03 14:40:32'
  );

/*!40000 ALTER TABLE `feedbacks` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `code_verifications`
--
DROP TABLE IF EXISTS `code_verifications`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `code_verifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `type` varchar(100) NOT NULL,
  `pending_change` varchar(255) DEFAULT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_verifications_code_unique` (`code`),
  KEY `code_verifications_user_id_users_id_fk` (`user_id`),
  CONSTRAINT `code_verifications_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `code_verifications`
--
LOCK TABLES `code_verifications` WRITE;

/*!40000 ALTER TABLE `code_verifications` DISABLE KEYS */
;

INSERT INTO
  `code_verifications`
VALUES
  (
    3,
    '42400419',
    'bcd69b0b-564f-11f0-952a-daec5656b813',
    'forgot_password',
    NULL,
    '2025-07-01 07:57:10',
    '2025-07-01 07:52:09',
    '2025-07-01 07:52:09'
  );

/*!40000 ALTER TABLE `code_verifications` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `users`
--
DROP TABLE IF EXISTS `users`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `users` (
  `id` varchar(255) NOT NULL DEFAULT (uuid()),
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(30) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `has_linked_github` tinyint(1) DEFAULT '0',
  `profile_url` varchar(255) DEFAULT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'user',
  `skill_set` json DEFAULT (_utf8mb4 '[]'),
  `description` varchar(500) DEFAULT NULL,
  `join_since` timestamp NULL DEFAULT (now()),
  `leave_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `users`
--
LOCK TABLES `users` WRITE;

/*!40000 ALTER TABLE `users` DISABLE KEYS */
;

INSERT INTO
  `users`
VALUES
  (
    '0de18ca4-34ba-11ef-a8f3-bc241176b8c5',
    'Sothea',
    'Seng',
    'sotheaseng8888@gmail.com',
    '$2b$10$Zt8gzUYQOcIdE7qA.Wnu6OGjQ9BgvchUjywneLiq1E6CmRuJW28Ri',
    NULL,
    1,
    1,
    '',
    'user',
    '[]',
    '',
    '2024-06-27 19:18:37',
    NULL,
    '2024-06-27 19:18:37',
    '2025-06-30 08:58:55'
  ),
  (
    '20dde738-571e-11f0-952a-daec5656b813',
    'Testing',
    'Account',
    'computer@gmail.com',
    '$2b$10$p6QBiCzwU.3hyXs8fkd9tungJdgpPDmmywi0r1YQkL6Nn/JRijZJq',
    NULL,
    1,
    1,
    NULL,
    'user',
    '[]',
    NULL,
    '2025-07-02 08:25:36',
    NULL,
    '2025-07-02 08:25:36',
    '2025-07-02 08:33:56'
  ),
  (
    '23771528-6448-11ef-b0a8-bc241176b8c5',
    'Yinchhay',
    'Im',
    'yinchhayim@gmail.com',
    '$2b$10$t3n.wCXojpuxwDGwwrl6g.czHPA74O6sAH1bYzCjK8CscO5CrTF..',
    NULL,
    1,
    1,
    NULL,
    'user',
    '[]',
    NULL,
    '2024-08-27 07:44:06',
    NULL,
    '2024-08-27 07:44:06',
    '2025-06-30 08:58:55'
  ),
  (
    '2f6f7379-4a70-11ef-a8f3-bc241176b8c5',
    'Phearamoneath',
    'Phan',
    'pphan@gmail.com',
    '$2b$10$1.SHO.ldjML4cgmW6yNFsedx9Nql0EYZWmlCi8LM4e6pH8Xlxlwdu',
    NULL,
    1,
    0,
    NULL,
    'user',
    '[]',
    NULL,
    '2024-07-25 10:25:16',
    NULL,
    '2024-07-25 10:25:16',
    '2025-06-30 08:58:55'
  ),
  (
    '316be07f-dac1-439e-bfc8-c6c519f33058',
    'Super',
    'Sothea',
    'lifegoalcs2@gmail.com',
    '$2b$10$WA8zN7imUV/yjJfzWmrTZ.rAMl8kY4EOrjGNHIUtSMjoj9.2tt8la',
    NULL,
    1,
    0,
    '',
    'superadmin',
    '[]',
    '',
    '2024-06-24 10:20:59',
    NULL,
    '2024-06-24 10:20:59',
    '2025-07-01 19:24:24'
  ),
  (
    '3c532c4e-654b-11ef-b0a8-bc241176b8c5',
    'Rithrolendo ',
    'Oum',
    'rouk@gmail.com',
    '$2b$10$ihPUBcJcPUIVWpGMC2.vMOyWRy5MwZqz4xNaIlJxCzvJ5ScynjDIe',
    NULL,
    1,
    1,
    NULL,
    'user',
    '[]',
    NULL,
    '2024-08-28 14:38:48',
    NULL,
    '2024-08-28 14:38:48',
    '2025-06-30 08:58:55'
  ),
  (
    '7398be41-5645-11f0-952a-daec5656b813',
    'Kolbot',
    'Pen',
    'kolbot.pen@gmail.com',
    '$2b$10$Efj5kqhF.JzmU2hAs.AKFe53pBpuWDrgZnbxvTWC0DKAixuSReOyG',
    NULL,
    1,
    0,
    NULL,
    'user',
    '[]',
    NULL,
    '2025-07-01 06:34:34',
    NULL,
    '2025-07-01 06:34:34',
    '2025-07-01 06:34:34'
  ),
  (
    'bcd69b0b-564f-11f0-952a-daec5656b813',
    'Sothea',
    'Seng',
    'sseng7@paragoniu.edu.kh',
    '$2b$10$GsFQ5DsRZoGsQGPdJs9.seJ8wrcwi7bt78.Hx39f6GzqxIROOtxnG',
    NULL,
    1,
    0,
    NULL,
    'user',
    '[]',
    NULL,
    '2025-07-01 07:48:11',
    NULL,
    '2025-07-01 07:48:11',
    '2025-07-01 07:48:11'
  ),
  (
    'da1abb7e-571d-11f0-952a-daec5656b813',
    'Test',
    'Account',
    'test@gmail.com',
    '$2b$10$Ihoc78b5WdKblqD7IVEeoeV9kYFOhlQbyW7OxKG4Z4uLxr1HnGkH2',
    NULL,
    1,
    0,
    NULL,
    'user',
    '[]',
    NULL,
    '2025-07-02 08:23:37',
    NULL,
    '2025-07-02 08:23:37',
    '2025-07-02 08:23:37'
  ),
  (
    'e8304878-5651-11f0-952a-daec5656b813',
    'test',
    'test',
    'ithinkchhayisdying@gmail.com',
    '$2b$10$DWq5rwNz39bPf//OJLYar.1Ie1TLoXMZ7WsQAzE1G42ftEI4oUf8y',
    NULL,
    1,
    0,
    NULL,
    'user',
    '[]',
    NULL,
    '2025-07-01 08:03:43',
    NULL,
    '2025-07-01 08:03:43',
    '2025-07-01 08:03:43'
  );

/*!40000 ALTER TABLE `users` ENABLE KEYS */
;

UNLOCK TABLES;

--
-- Table structure for table `categories`
--
DROP TABLE IF EXISTS `categories`;

/*!40101 SET @saved_cs_client     = @@character_set_client */
;

/*!50503 SET character_set_client = utf8mb4 */
;

CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `logo` varchar(2083) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT (now()),
  `updated_at` timestamp NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_name_unique` (`name`)
) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */
;

--
-- Dumping data for table `categories`
--
LOCK TABLES `categories` WRITE;

/*!40000 ALTER TABLE `categories` DISABLE KEYS */
;

INSERT INTO
  `categories`
VALUES
  (
    2,
    'EdTech',
    'Educational Technology uses digital tools to enhance education. This includes online learning platforms, educational apps, interactive devices, and data analytics, aiming to improve learning outcomes and make education more engaging and accessible.',
    'young-asia-businesswoman-using-laptop-talk-colleague-about-plan-video-call-meeting-while-work-from-home-living-room-b71e2285-9ab3-4d76-97ca-7336483b94b2.jpg',
    1,
    '2024-06-27 14:41:33',
    '2024-07-08 23:36:49'
  ),
  (
    3,
    'FinTech',
    'Financial Technology refers to the use of technology to deliver financial services and products, including online banking, mobile payments, and blockchain-based solutions.',
    'close-up-hand-holding-smartphone-ff740b19-8a50-4bbe-bdee-ab136d5c7dbe.jpg',
    1,
    '2024-06-27 14:41:38',
    '2024-07-08 23:36:44'
  ),
  (
    4,
    'Humanitarian Engineering',
    'The use of engineering principles to design and implement solutions that improve the well-being and quality of life in underserved or disadvantaged communities.',
    'pexels-cristian-rojas-8853502-620d0acd-b990-4904-b770-556c0f468609.jpg',
    1,
    '2024-06-28 15:13:11',
    '2024-07-08 23:51:10'
  ),
  (
    5,
    'Gamification',
    'The application of game-design elements and principles in non-game contexts to increase user engagement, motivation, and participation.',
    'pexels-pixabay-277124-02f4ce1a-01e1-418b-8630-2cc23ce538ba.jpg',
    1,
    '2024-06-28 15:13:20',
    '2024-07-08 23:51:05'
  ),
  (
    6,
    'Social Impact',
    'The effects of technology or innovation on individuals, communities, and society, including its influence on well-being, equity, cultural practices, and social relationships.',
    'international-day-eradication-poverty-flat-illustration-typography_421953-69624-88beb3f8-9eb3-4439-b35e-83adc5b62f4c.png',
    1,
    '2024-07-11 13:42:15',
    '2024-08-29 04:50:52'
  );

/*!40000 ALTER TABLE `categories` ENABLE KEYS */
;

UNLOCK TABLES;

SET
  @ @SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */
;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */
;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */
;

/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */
;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */
;

-- Dump completed on 2025-07-05 15:18:36