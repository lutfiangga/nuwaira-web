-- Migration: RBAC foundation + default register role setting

CREATE TABLE IF NOT EXISTS role (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_system BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permission (
    code TEXT PRIMARY KEY,
    resource TEXT NOT NULL,
    action TEXT NOT NULL,
    label TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permission (
    role_id TEXT NOT NULL REFERENCES role(id) ON DELETE CASCADE,
    permission_code TEXT NOT NULL REFERENCES permission(code) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_code)
);

CREATE TABLE IF NOT EXISTS app_setting (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO role (id, name, description, is_system)
VALUES
    ('superadmin', 'Superadmin', 'Full control over all features and RBAC policy', TRUE),
    ('admin', 'Admin', 'Operational admin with configurable access', TRUE),
    ('instructor', 'Instructor', 'Content manager for learning materials', TRUE),
    ('learner', 'Learner', 'Default role for self-registered users', TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_system = EXCLUDED.is_system,
    updated_at = NOW();

INSERT INTO permission (code, resource, action, label, description)
VALUES
    ('dashboard:read', 'dashboard', 'read', 'dashboard read', 'Read dashboard page'),

    ('users:create', 'users', 'create', 'users create', 'Create user records'),
    ('users:read', 'users', 'read', 'users read', 'Read user records'),
    ('users:update', 'users', 'update', 'users update', 'Update user records'),
    ('users:delete', 'users', 'delete', 'users delete', 'Delete user records'),

    ('students:create', 'students', 'create', 'students create', 'Create student records'),
    ('students:read', 'students', 'read', 'students read', 'Read student records'),
    ('students:update', 'students', 'update', 'students update', 'Update student records'),
    ('students:delete', 'students', 'delete', 'students delete', 'Delete student records'),

    ('classes:create', 'classes', 'create', 'classes create', 'Create class records'),
    ('classes:read', 'classes', 'read', 'classes read', 'Read class records'),
    ('classes:update', 'classes', 'update', 'classes update', 'Update class records'),
    ('classes:delete', 'classes', 'delete', 'classes delete', 'Delete class records'),

    ('materials:create', 'materials', 'create', 'materials create', 'Create material records'),
    ('materials:read', 'materials', 'read', 'materials read', 'Read material records'),
    ('materials:update', 'materials', 'update', 'materials update', 'Update material records'),
    ('materials:delete', 'materials', 'delete', 'materials delete', 'Delete material records'),

    ('enrollments:create', 'enrollments', 'create', 'enrollments create', 'Create enrollment records'),
    ('enrollments:read', 'enrollments', 'read', 'enrollments read', 'Read enrollment records'),
    ('enrollments:update', 'enrollments', 'update', 'enrollments update', 'Update enrollment records'),
    ('enrollments:delete', 'enrollments', 'delete', 'enrollments delete', 'Delete enrollment records'),

    ('menu:create', 'menu', 'create', 'menu create', 'Create menu records'),
    ('menu:read', 'menu', 'read', 'menu read', 'Read menu records'),
    ('menu:update', 'menu', 'update', 'menu update', 'Update menu records'),
    ('menu:delete', 'menu', 'delete', 'menu delete', 'Delete menu records'),

    ('moments:create', 'moments', 'create', 'moments create', 'Create moments records'),
    ('moments:read', 'moments', 'read', 'moments read', 'Read moments records'),
    ('moments:update', 'moments', 'update', 'moments update', 'Update moments records'),
    ('moments:delete', 'moments', 'delete', 'moments delete', 'Delete moments records'),

    ('categories:create', 'categories', 'create', 'categories create', 'Create category records'),
    ('categories:read', 'categories', 'read', 'categories read', 'Read category records'),
    ('categories:update', 'categories', 'update', 'categories update', 'Update category records'),
    ('categories:delete', 'categories', 'delete', 'categories delete', 'Delete category records'),

    ('products:create', 'products', 'create', 'products create', 'Create product records'),
    ('products:read', 'products', 'read', 'products read', 'Read product records'),
    ('products:update', 'products', 'update', 'products update', 'Update product records'),
    ('products:delete', 'products', 'delete', 'products delete', 'Delete product records'),

    ('outlets:create', 'outlets', 'create', 'outlets create', 'Create outlet records'),
    ('outlets:read', 'outlets', 'read', 'outlets read', 'Read outlet records'),
    ('outlets:update', 'outlets', 'update', 'outlets update', 'Update outlet records'),
    ('outlets:delete', 'outlets', 'delete', 'outlets delete', 'Delete outlet records'),

    ('outlet_map:read', 'outlet_map', 'read', 'outlet_map read', 'Read outlet map page'),

    ('news:create', 'news', 'create', 'news create', 'Create news records'),
    ('news:read', 'news', 'read', 'news read', 'Read news records'),
    ('news:update', 'news', 'update', 'news update', 'Update news records'),
    ('news:delete', 'news', 'delete', 'news delete', 'Delete news records'),

    ('settings:read', 'settings', 'read', 'settings read', 'Read settings page'),
    ('settings:update', 'settings', 'update', 'settings update', 'Update user profile settings'),

    ('rbac:read', 'rbac', 'read', 'rbac read', 'Read RBAC settings page'),
    ('rbac:update', 'rbac', 'update', 'rbac update', 'Update RBAC policies')
ON CONFLICT (code) DO UPDATE SET
    resource = EXCLUDED.resource,
    action = EXCLUDED.action,
    label = EXCLUDED.label,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Superadmin gets everything
INSERT INTO role_permission (role_id, permission_code)
SELECT 'superadmin', code FROM permission
ON CONFLICT DO NOTHING;

-- Admin gets all operational permissions except RBAC
INSERT INTO role_permission (role_id, permission_code)
SELECT 'admin', code
FROM permission
WHERE code NOT IN ('rbac:read', 'rbac:update')
ON CONFLICT DO NOTHING;

-- Instructor gets content CRUD + dashboard/settings
INSERT INTO role_permission (role_id, permission_code)
SELECT 'instructor', p.code
FROM permission p
WHERE p.code IN (
    'dashboard:read',
    'students:create', 'students:read', 'students:update', 'students:delete',
    'classes:create', 'classes:read', 'classes:update', 'classes:delete',
    'materials:create', 'materials:read', 'materials:update', 'materials:delete',
    'enrollments:create', 'enrollments:read', 'enrollments:update', 'enrollments:delete',
    'menu:create', 'menu:read', 'menu:update', 'menu:delete',
    'moments:create', 'moments:read', 'moments:update', 'moments:delete',
    'categories:create', 'categories:read', 'categories:update', 'categories:delete',
    'products:create', 'products:read', 'products:update', 'products:delete',
    'news:create', 'news:read', 'news:update', 'news:delete',
    'outlets:read', 'outlet_map:read',
    'settings:read', 'settings:update'
)
ON CONFLICT DO NOTHING;

-- Learner only dashboard/settings
INSERT INTO role_permission (role_id, permission_code)
SELECT 'learner', p.code
FROM permission p
WHERE p.code IN ('dashboard:read', 'settings:read', 'settings:update')
ON CONFLICT DO NOTHING;

ALTER TABLE "user" ADD COLUMN IF NOT EXISTS role_id TEXT;

UPDATE "user"
SET role_id = CASE
    WHEN username = 'admin' THEN 'superadmin'
    ELSE 'learner'
END
WHERE role_id IS NULL;

ALTER TABLE "user" ALTER COLUMN role_id SET DEFAULT 'learner';
ALTER TABLE "user" ALTER COLUMN role_id SET NOT NULL;

ALTER TABLE "user" DROP CONSTRAINT IF EXISTS user_role_id_role_id_fk;
ALTER TABLE "user" ADD CONSTRAINT user_role_id_role_id_fk
    FOREIGN KEY (role_id) REFERENCES role(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;

INSERT INTO app_setting (key, value)
VALUES ('default_register_role', 'learner')
ON CONFLICT (key) DO NOTHING;
