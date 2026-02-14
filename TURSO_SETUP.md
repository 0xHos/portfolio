# Turso Database Setup Guide

## What Changed

Your project has been migrated from `better-sqlite3` (local SQLite) to **Turso** (serverless SQLite), which is compatible with Vercel deployments.

### Changes Made:
1. **Removed** `better-sqlite3` dependency
2. **Installed** `@libsql/client` package
3. **Updated** `lib/db.ts` to use Turso client
4. **Converted** all database calls from synchronous to async/await
5. **Updated** all API routes to use Turso's async API

## Setup Instructions

### 1. Create a Turso Database

1. Go to [Turso Cloud](https://cloud.turso.io/)
2. Sign up or log in
3. Create a new database (e.g., "database-red-park")
4. Copy your credentials:
   - **TURSO_DATABASE_URL** - The database connection URL
   - **TURSO_AUTH_TOKEN** - Your authentication token

### 2. Configure Environment Variables

#### For Local Development:

Create a `.env.local` file in your project root:
```bash
TURSO_DATABASE_URL="your_database_url_here"
TURSO_AUTH_TOKEN="your_auth_token_here"
```

#### For Vercel Deployment:

1. Go to your Vercel project settings
2. Navigate to **Settings → Environment Variables**
3. Add both variables:
   - `TURSO_DATABASE_URL` 
   - `TURSO_AUTH_TOKEN`
4. Make sure they're available in all environments (Production, Preview, Development)

### 3. Test Locally

```bash
npm run dev
```

The database will automatically initialize on first run with:
- Default admin user (username: `admin`, password: `admin`)
- Default technologies and button settings

## Key Differences from better-sqlite3

### Before (better-sqlite3):
```typescript
const db = getDb();
const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
```

### After (Turso):
```typescript
const db = getDb();
const result = await db.execute({
  sql: 'SELECT * FROM users WHERE id = ?',
  args: [id],
});
const user = result.rows[0];
```

All database operations are now **async** and must be `await`ed.

## Deployment to Vercel

1. Push your code to GitHub
2. In Vercel, your environment variables will be used automatically
3. The database will initialize on first deployment
4. No local database files needed!

## Troubleshooting

### "TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is not set"
- Verify environment variables are set in `.env.local` (dev) or Vercel settings (production)
- Restart `npm run dev` after adding env vars

### Database connection errors
- Check that credentials are copied correctly from Turso Cloud
- Ensure no extra spaces or quotes in environment variables

### Data not persisting
- Turso is persistent! Data will remain even after deployments
- Check Vercel logs if data disappears: `vercel logs`

## Documentation Links

- [Turso Quickstart](https://docs.turso.io/quickstart)
- [libSQL JavaScript SDK](https://github.com/libsql/libsql-client-ts)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
