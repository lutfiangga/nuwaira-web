-- Migration: Add email, name, and photo to user table
-- Run this SQL in your PostgreSQL database

ALTER TABLE "user" 
ADD COLUMN IF NOT EXISTS "email" TEXT NOT NULL DEFAULT 'user@example.com',
ADD COLUMN IF NOT EXISTS "name" TEXT,
ADD COLUMN IF NOT EXISTS "photo" TEXT;

-- Make email unique after adding it
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE ("email");

-- Update existing users with unique emails
UPDATE "user" SET "email" = "username" || '@example.com' WHERE "email" = 'user@example.com';
