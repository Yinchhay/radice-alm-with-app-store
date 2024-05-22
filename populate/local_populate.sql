-- Do not use this in production. this file is intended for local development only.
START TRANSACTION;
-- permissions
INSERT INTO permissions (id, name, description) VALUES 
(1, 'Create users', 'Permission to create users'),
-- (2, 'Edit users', 'Permission to edit users'),
(3, 'Delete users', 'Permission to delete users'),
(4, 'Create categories', 'Permission to create categories'),
(5, 'Edit categories', 'Permission to edit categories'),
(6, 'Delete categories', 'Permission to delete categories'),
(7, 'Create roles', 'Permission to create roles'),
(8, 'Edit roles', 'Permission to edit roles'),
(9, 'Delete roles', 'Permission to delete roles'),
(10, 'Create partners', 'Permission to create partners'),
-- (11, 'Edit partners', 'Permission to edit partners'),
(12, 'Delete partners', 'Permission to delete partners'),
(13, 'Approve and reject application forms', 'Permission to approve and reject application forms'),
(14, 'Create own projects', 'Permission to create own projects');
(15, 'Change project status', 'Permission to change project status'),
(16, 'Delete project', "Permission to delete other user's project without having to be the owner");

-- roles
INSERT INTO roles (name, description) VALUES ('admin', 'Admin role');

SET @role_id = LAST_INSERT_ID();

-- rolePermissions
INSERT INTO role_permissions (role_Id, permission_id) VALUES (@role_id, 1);
INSERT INTO role_permissions (role_Id, permission_id) VALUES (@role_id, 2);
INSERT INTO role_permissions (role_Id, permission_id) VALUES (@role_id, 3);

-- user
INSERT INTO users (id, first_name, last_name, email, password, type) VALUES 
('12345Local', 'Admin', 'Admin', 'admin@gmail.com', '$2b$10$z4s1nbgqLeS4afPZXeLTyeoyPEs3jJhQMcRAijj7nB2BTlBIS6tMC', 'user');

-- userRoles
INSERT INTO user_roles (user_id, role_Id) VALUES ('12345Local', @role_id);

COMMIT;