-- Migration: Update product table to use category foreign key
-- First, add the new column
ALTER TABLE "product" ADD COLUMN IF NOT EXISTS "category_id" TEXT;

-- Add foreign key constraint
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fk" 
FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL;

-- Optional: If you want to migrate existing data, you can create categories from existing text values
-- INSERT INTO "category" (id, name, created_at, updated_at)
-- SELECT DISTINCT gen_random_uuid()::text, category, NOW(), NOW()
-- FROM "product" WHERE category IS NOT NULL
-- ON CONFLICT (name) DO NOTHING;

-- Optional: Update product.category_id based on category.name
-- UPDATE "product" p
-- SET category_id = c.id
-- FROM "category" c
-- WHERE p.category = c.name;

-- After migration is complete and data is verified, you can drop the old column:
-- ALTER TABLE "product" DROP COLUMN "category";
