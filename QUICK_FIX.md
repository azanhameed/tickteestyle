# 🚨 QUICK FIX GUIDE - Order Placement Error

## THE PROBLEM
❌ Error: "new row violates row-level security policy for table 'orders'"

## THE SOLUTION (3 Simple Steps)

### STEP 1: Open Supabase SQL Editor
1. Go to: https://supabase.com/dashboard
2. Select your project: `qhjxgmrscgkpzakzmfnn`
3. Click **"SQL Editor"** in left sidebar
4. Click **"New Query"**

### STEP 2: Run the Fix Script
1. Open file: `database_migrations/FIX_RLS_POLICIES.sql`
2. Copy ALL the content (Ctrl+A, Ctrl+C)
3. Paste into SQL Editor (Ctrl+V)
4. Click **"Run"** button or press Ctrl+Enter
5. Wait for completion (should see policy tables in output)

### STEP 3: Test Your Website
1. Go to: http://localhost:3000/shop
2. Add any product to cart
3. Go to checkout
4. Fill shipping information:
   - Name, phone, address, city, postal code
5. Select payment method (COD or JazzCash/EasyPaisa)
6. Click "Place Order"
7. ✅ Should work without error!

---

## WHAT THE FIX DOES

✅ Adds missing INSERT policy for orders table  
✅ Adds missing INSERT policy for order_items table  
✅ Creates auto-profile creation on signup  
✅ Sets up admin role system  
✅ Fixes all security policies  

---

## OPTIONAL: Make Yourself Admin

Run this in SQL Editor (after signing up):
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

Then access: http://localhost:3000/admin

---

## TESTING CHECKLIST

After running the fix:

- [ ] Sign up works (creates profile automatically)
- [ ] Login works
- [ ] Add to cart works
- [ ] Checkout form accepts all fields
- [ ] **COD order completes successfully** ✅
- [ ] **JazzCash/EasyPaisa order completes** ✅
- [ ] Order appears in order history
- [ ] (If admin) Dashboard shows statistics

---

## NEED HELP?

Check these files:
1. `COMPLETE_SETUP_GUIDE.md` - Detailed setup instructions
2. `CODE_ANALYSIS_SUMMARY.md` - Complete code analysis
3. `PROBLEM_AND_SOLUTION.md` - For your project report

---

## PAYMENT NUMBERS

**JazzCash/EasyPaisa:** 03150374729

(Update in code if needed - search for this number in files)

---

**That's it! Your website will work perfectly after running the SQL script.**
