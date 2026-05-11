# Database Migrations

## Quick Fix - Run Drizzle Push

The easiest way to sync your database with the schema is to use Drizzle's push command:

```bash
npx drizzle-kit push
```

This will automatically update your database to match your schema definitions.

## Alternative - Manual SQL Migration

If you prefer to run migrations manually, execute these SQL files in order:

1. **001_add_user_fields.sql** - Adds email, name, photo to user table
2. **002_create_category_table.sql** - Creates category table
3. **003_create_outlet_table.sql** - Creates outlet table

### Using psql:
```bash
psql $DATABASE_URL -f src/lib/app/database/migrations/001_add_user_fields.sql
psql $DATABASE_URL -f src/lib/app/database/migrations/002_create_category_table.sql
psql $DATABASE_URL -f src/lib/app/database/migrations/003_create_outlet_table.sql
```

### Or copy-paste the SQL directly into your database client

## After Migration

Once the migration is complete, restart your dev server:
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

The application should now work correctly with all the new fields and tables.
