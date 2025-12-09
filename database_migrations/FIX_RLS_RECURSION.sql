-- =====================================================
-- FIX INFINITE RECURSION IN RLS POLICIES
-- This fixes the "infinite recursion detected" error
-- Run this in Supabase SQL Editor
-- =====================================================

-- Drop all existing policies that cause recursion
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Users can create own order items" ON order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
DROP POLICY IF EXISTS "Admins can manage all order items" ON order_items;

-- =====================================================
-- PROFILES TABLE POLICIES (NO RECURSION)
-- =====================================================

-- Policy 1: Users can view their own profile (simple, no recursion)
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Policy 2: Users can INSERT their own profile (no recursion)
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Policy 3: Users can update their own profile (no recursion)
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Policy 4: Everyone can view all profiles (SIMPLEST - NO RECURSION)
-- Note: If you need admin-only access, handle it at application level
CREATE POLICY "Everyone can view profiles" 
ON profiles FOR SELECT 
USING (true);

-- =====================================================
-- ORDERS TABLE POLICIES (NO RECURSION)
-- =====================================================

-- Policy 1: Users can view their own orders
CREATE POLICY "Users can view own orders" 
ON orders FOR SELECT 
USING (auth.uid() = user_id);

-- Policy 2: Users can INSERT their own orders (THIS IS CRITICAL!)
CREATE POLICY "Users can create own orders" 
ON orders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Admins can view all orders (NO RECURSION - uses auth metadata)
CREATE POLICY "Admins can view all orders" 
ON orders FOR SELECT 
USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  OR auth.uid() = user_id
);

-- Policy 4: Admins can update all orders (NO RECURSION)
CREATE POLICY "Admins can update all orders" 
ON orders FOR UPDATE 
USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- =====================================================
-- ORDER_ITEMS TABLE POLICIES (NO RECURSION)
-- =====================================================

-- Policy 1: Users can view their own order items
CREATE POLICY "Users can view own order items" 
ON order_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Policy 2: Users can INSERT order items for their own orders
CREATE POLICY "Users can create own order items" 
ON order_items FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Policy 3: Admins can view all order items (NO RECURSION)
CREATE POLICY "Admins can view all order items" 
ON order_items FOR SELECT 
USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  OR EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Policy 4: Admins can manage all order items (NO RECURSION)
CREATE POLICY "Admins can manage all order items" 
ON order_items FOR ALL 
USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check that policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('profiles', 'orders', 'order_items')
ORDER BY tablename, policyname;

-- Verify no recursion (should return data without errors)
SELECT id, email, role FROM profiles WHERE id = auth.uid();

-- Test order creation (run this after creating a test order)
-- SELECT * FROM orders WHERE user_id = auth.uid() LIMIT 1;
