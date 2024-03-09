-- Further change to the id must also update the `src/types/IAM.ts` file
INSERT INTO permissions (id, name, description) VALUES 
(1, 'Create users', 'Permission to create users'),
(2, 'Edit users', 'Permission to edit users'),
(3, 'Delete users', 'Permission to delete users'),
(4, 'Create categories', 'Permission to create categories'),
(5, 'Edit categories', 'Permission to edit categories'),
(6, 'Delete categories', 'Permission to delete categories'),
(7, 'Create roles', 'Permission to create roles'),
(8, 'Edit roles', 'Permission to edit roles'),
(9, 'Delete roles', 'Permission to delete roles'),
(10, 'Create partners', 'Permission to create partners'),
(11, 'Edit partners', 'Permission to edit partners'),
(12, 'Delete partners', 'Permission to delete partners'),
(13, 'Approve and reject application forms', 'Permission to approve and reject application forms'),
(14, 'Create own projects', 'Permission to create own projects'),
(15, 'Change project status', 'Permission to change project status'),
(16, 'Delete project', "Permission to delete other user's project without having to be the owner");
