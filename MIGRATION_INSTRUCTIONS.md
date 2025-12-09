# Database Migration Instructions

## Adding Multiple Product Images Support

To enable multiple product images, you need to run a database migration in your Supabase project.

### Step-by-Step Instructions:

1. **Open Supabase Dashboard**
   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Migration SQL**
   - Copy the entire contents of `database_migrations/multiple_images.sql`
   - Paste it into the SQL Editor
   - Click "Run" (or press Ctrl+Enter / Cmd+Enter)

4. **Verify the Migration**
   - The migration should complete successfully
   - You can verify by running:
     ```sql
     SELECT column_name, data_type 
     FROM information_schema.columns 
     WHERE table_name = 'products' AND column_name = 'image_urls';
     ```
   - You should see `image_urls` with type `jsonb`

### What the Migration Does:

- Adds a new `image_urls` JSONB column to the `products` table
- Migrates existing `image_url` data to the new `image_urls` array format
- Creates an index for faster queries
- Maintains backward compatibility with existing products

### After Running the Migration:

- Refresh your admin dashboard
- You should now be able to add products with multiple images
- The error message should disappear

### Troubleshooting:

If you encounter any errors:
1. Make sure you have the correct permissions in Supabase
2. Check that the `products` table exists
3. Verify you're connected to the correct database/project

