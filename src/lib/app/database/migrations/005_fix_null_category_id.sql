-- Migration: Fix NULL category_id values before adding NOT NULL constraint

-- Option 1: Delete products with NULL category_id
DELETE FROM "product" WHERE "category_id" IS NULL;

-- Option 2 (Alternative): Assign a default category to products with NULL category_id
-- First, create a default "Uncategorized" category if it doesn't exist
-- INSERT INTO "category" (id, name, created_at, updated_at)
-- VALUES ('default-category-id', 'Uncategorized', NOW(), NOW())
-- ON CONFLICT (id) DO NOTHING;

-- Then update NULL category_id to the default category
-- UPDATE "product" 
-- SET "category_id" = 'default-category-id'
-- WHERE "category_id" IS NULL;

-- Finally, add NOT NULL constraint
ALTER TABLE "product" ALTER COLUMN "category_id" SET NOT NULL;
