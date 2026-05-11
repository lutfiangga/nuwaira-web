-- Migration: Add images column to product table
-- This migration converts the single 'image' column to 'images' JSON array

-- Step 1: Add new images column as JSONB
ALTER TABLE product ADD COLUMN images JSONB;

-- Step 2: Migrate existing data from image to images
-- Convert single image string to JSON array
UPDATE product 
SET images = CASE 
    WHEN image IS NOT NULL THEN jsonb_build_array(image)
    ELSE NULL
END;

-- Step 3: Drop old image column
ALTER TABLE product DROP COLUMN image;
