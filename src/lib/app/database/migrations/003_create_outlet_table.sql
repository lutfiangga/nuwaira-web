-- Migration: Create outlet table
CREATE TABLE IF NOT EXISTS "outlet" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "province" TEXT,
    "city" TEXT,
    "district" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
