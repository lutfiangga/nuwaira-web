-- Migration: Dynamic RBAC foundation for LMS
-- Scope:
-- - role/permission/role_permission/app_setting
-- - panel_module registry (dynamic sidebar menu)
-- - route_permission registry (dynamic route guard mapping)

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
    role_id TEXT NOT NULL REFERENCES role(id) ON DELETE CASCADE ON UPDATE CASCADE,
    permission_code TEXT NOT NULL REFERENCES permission(code) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (role_id, permission_code)
);

CREATE TABLE IF NOT EXISTS app_setting (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS panel_module (
    id TEXT PRIMARY KEY,
    module_key TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'LayoutDashboard',
    menu_permission_code TEXT REFERENCES permission(code) ON DELETE SET NULL ON UPDATE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS route_permission (
    id TEXT PRIMARY KEY,
    route_key TEXT NOT NULL,
    operation_key TEXT NOT NULL,
    route_path TEXT,
    method TEXT,
    description TEXT,
    permission_code TEXT NOT NULL REFERENCES permission(code) ON DELETE CASCADE ON UPDATE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT route_permission_route_operation_unique UNIQUE (route_key, operation_key)
);

INSERT INTO role (id, name, description, is_system)
VALUES
    ('superadmin', 'Superadmin', 'Bootstrap governance owner for dynamic RBAC', TRUE)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_system = EXCLUDED.is_system,
    updated_at = NOW();

INSERT INTO permission (code, resource, action, label, description)
VALUES
    ('dashboard:read', 'dashboard', 'read', 'dashboard read', 'Read dashboard page'),

    ('users:create', 'users', 'create', 'users create', 'Create users'),
    ('users:read', 'users', 'read', 'users read', 'Read users'),
    ('users:update', 'users', 'update', 'users update', 'Update users'),
    ('users:delete', 'users', 'delete', 'users delete', 'Delete users'),

    ('students:create', 'students', 'create', 'students create', 'Create students'),
    ('students:read', 'students', 'read', 'students read', 'Read students'),
    ('students:update', 'students', 'update', 'students update', 'Update students'),
    ('students:delete', 'students', 'delete', 'students delete', 'Delete students'),

    ('classes:create', 'classes', 'create', 'classes create', 'Create classes'),
    ('classes:read', 'classes', 'read', 'classes read', 'Read classes'),
    ('classes:update', 'classes', 'update', 'classes update', 'Update classes'),
    ('classes:delete', 'classes', 'delete', 'classes delete', 'Delete classes'),

    ('materials:create', 'materials', 'create', 'materials create', 'Create materials'),
    ('materials:read', 'materials', 'read', 'materials read', 'Read materials'),
    ('materials:update', 'materials', 'update', 'materials update', 'Update materials'),
    ('materials:delete', 'materials', 'delete', 'materials delete', 'Delete materials'),

    ('enrollments:create', 'enrollments', 'create', 'enrollments create', 'Create enrollments'),
    ('enrollments:read', 'enrollments', 'read', 'enrollments read', 'Read enrollments'),
    ('enrollments:update', 'enrollments', 'update', 'enrollments update', 'Update enrollments'),
    ('enrollments:delete', 'enrollments', 'delete', 'enrollments delete', 'Delete enrollments'),

    ('settings:read', 'settings', 'read', 'settings read', 'Read settings'),
    ('settings:update', 'settings', 'update', 'settings update', 'Update settings'),

    ('rbac:create', 'rbac', 'create', 'rbac create', 'Create RBAC registry data'),
    ('rbac:read', 'rbac', 'read', 'rbac read', 'Read RBAC settings'),
    ('rbac:update', 'rbac', 'update', 'rbac update', 'Update RBAC settings'),
    ('rbac:delete', 'rbac', 'delete', 'rbac delete', 'Delete RBAC registry data')
ON CONFLICT (code) DO UPDATE SET
    resource = EXCLUDED.resource,
    action = EXCLUDED.action,
    label = EXCLUDED.label,
    description = EXCLUDED.description,
    updated_at = NOW();

INSERT INTO role_permission (role_id, permission_code)
SELECT 'superadmin', code
FROM permission
ON CONFLICT DO NOTHING;

INSERT INTO app_setting (key, value, updated_at)
VALUES ('default_register_role', 'superadmin', NOW())
ON CONFLICT (key) DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = NOW();

INSERT INTO panel_module (
    id,
    module_key,
    title,
    url,
    icon,
    menu_permission_code,
    sort_order,
    description,
    is_visible,
    is_active
)
VALUES
    ('module-dashboard', 'dashboard', 'Dashboard', '/dashboard', 'LayoutDashboard', 'dashboard:read', 10, 'Panel landing page', TRUE, TRUE),
    ('module-users', 'users', 'Users', '/users', 'Users', 'users:read', 20, 'Manage users', TRUE, TRUE),
    ('module-students', 'students', 'Students', '/students', 'Users', 'students:read', 30, 'Manage students', TRUE, TRUE),
    ('module-classes', 'classes', 'Classes', '/classes', 'Package', 'classes:read', 40, 'Manage classes', TRUE, TRUE),
    ('module-materials', 'materials', 'Materials', '/materials', 'FolderOpen', 'materials:read', 50, 'Manage class materials', TRUE, TRUE),
    ('module-enrollments', 'enrollments', 'Enrollments', '/enrollments', 'ChartColumnStacked', 'enrollments:read', 60, 'Manage enrollments', TRUE, TRUE),
    ('module-settings', 'settings', 'Settings', '/settings', 'SettingsIcon', 'settings:read', 70, 'User profile settings', TRUE, TRUE),
    ('module-rbac', 'rbac', 'RBAC', '/rbac', 'ShieldCheck', 'rbac:read', 80, 'Dynamic governance settings', TRUE, TRUE)
ON CONFLICT (module_key) DO UPDATE SET
    title = EXCLUDED.title,
    url = EXCLUDED.url,
    icon = EXCLUDED.icon,
    menu_permission_code = EXCLUDED.menu_permission_code,
    sort_order = EXCLUDED.sort_order,
    description = EXCLUDED.description,
    is_visible = EXCLUDED.is_visible,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

INSERT INTO route_permission (
    id,
    route_key,
    operation_key,
    route_path,
    method,
    description,
    permission_code,
    is_active
)
VALUES
    ('route-dashboard-read', 'dashboard', 'read', '/dashboard', 'GET', 'Read dashboard page', 'dashboard:read', TRUE),

    ('route-users-read', 'users', 'read', '/users', 'GET', 'Read users page', 'users:read', TRUE),
    ('route-users-create', 'users', 'create', '/users', 'POST', 'Create users', 'users:create', TRUE),
    ('route-users-update', 'users', 'update', '/users', 'POST', 'Update users', 'users:update', TRUE),
    ('route-users-delete', 'users', 'delete', '/users', 'POST', 'Delete users', 'users:delete', TRUE),

    ('route-students-read', 'students', 'read', '/students', 'GET', 'Read students page', 'students:read', TRUE),
    ('route-students-create', 'students', 'create', '/students', 'POST', 'Create students', 'students:create', TRUE),
    ('route-students-update', 'students', 'update', '/students', 'POST', 'Update students', 'students:update', TRUE),
    ('route-students-delete', 'students', 'delete', '/students', 'POST', 'Delete students', 'students:delete', TRUE),

    ('route-classes-read', 'classes', 'read', '/classes', 'GET', 'Read classes page', 'classes:read', TRUE),
    ('route-classes-create', 'classes', 'create', '/classes', 'POST', 'Create classes', 'classes:create', TRUE),
    ('route-classes-update', 'classes', 'update', '/classes', 'POST', 'Update classes', 'classes:update', TRUE),
    ('route-classes-delete', 'classes', 'delete', '/classes', 'POST', 'Delete classes', 'classes:delete', TRUE),

    ('route-materials-read', 'materials', 'read', '/materials', 'GET', 'Read materials page', 'materials:read', TRUE),
    ('route-materials-create', 'materials', 'create', '/materials', 'POST', 'Create materials', 'materials:create', TRUE),
    ('route-materials-update', 'materials', 'update', '/materials', 'POST', 'Update materials', 'materials:update', TRUE),
    ('route-materials-delete', 'materials', 'delete', '/materials', 'POST', 'Delete materials', 'materials:delete', TRUE),

    ('route-enrollments-read', 'enrollments', 'read', '/enrollments', 'GET', 'Read enrollments page', 'enrollments:read', TRUE),
    ('route-enrollments-create', 'enrollments', 'create', '/enrollments', 'POST', 'Create enrollments', 'enrollments:create', TRUE),
    ('route-enrollments-update', 'enrollments', 'update', '/enrollments', 'POST', 'Update enrollments', 'enrollments:update', TRUE),
    ('route-enrollments-delete', 'enrollments', 'delete', '/enrollments', 'POST', 'Delete enrollments', 'enrollments:delete', TRUE),

    ('route-settings-read', 'settings', 'read', '/settings', 'GET', 'Read settings page', 'settings:read', TRUE),
    ('route-settings-update', 'settings', 'update', '/settings', 'POST', 'Update settings', 'settings:update', TRUE),

    ('route-rbac-read', 'rbac', 'read', '/rbac', 'GET', 'Read RBAC page', 'rbac:read', TRUE),
    ('route-rbac-create', 'rbac', 'create', '/rbac', 'POST', 'Create RBAC data', 'rbac:create', TRUE),
    ('route-rbac-update', 'rbac', 'update', '/rbac', 'POST', 'Update RBAC data', 'rbac:update', TRUE),
    ('route-rbac-delete', 'rbac', 'delete', '/rbac', 'POST', 'Delete RBAC data', 'rbac:delete', TRUE)
ON CONFLICT (route_key, operation_key) DO UPDATE SET
    route_path = EXCLUDED.route_path,
    method = EXCLUDED.method,
    description = EXCLUDED.description,
    permission_code = EXCLUDED.permission_code,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

ALTER TABLE "user" ADD COLUMN IF NOT EXISTS role_id TEXT;

UPDATE "user"
SET role_id = 'superadmin'
WHERE role_id IS NULL;

ALTER TABLE "user" ALTER COLUMN role_id SET DEFAULT 'superadmin';
ALTER TABLE "user" ALTER COLUMN role_id SET NOT NULL;

ALTER TABLE "user" DROP CONSTRAINT IF EXISTS user_role_id_role_id_fk;
ALTER TABLE "user" ADD CONSTRAINT user_role_id_role_id_fk
    FOREIGN KEY (role_id) REFERENCES role(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT;
