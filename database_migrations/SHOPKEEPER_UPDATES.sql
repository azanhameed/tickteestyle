-- =====================================================
-- UPDATE DATABASE FOR SHOPKEEPER ROLE
-- This makes it clear that admin = shop manager/owner
-- =====================================================

-- Update role column description
COMMENT ON COLUMN profiles.role IS 'User role: customer (buyer) or admin (shop manager/owner who manages website and Instagram @tick.teestyle)';

-- Update products table description  
COMMENT ON TABLE products IS 'Watch inventory for TickTee Style website and Instagram shop (@tick.teestyle)';

-- Update orders table description
COMMENT ON TABLE orders IS 'Customer orders from website. Shop manager verifies payments and updates status.';

-- Add helpful comments for shop manager
COMMENT ON COLUMN orders.payment_method IS 'COD, JazzCash, or EasyPaisa - shop manager verifies online payments';
COMMENT ON COLUMN orders.payment_verified IS 'Shop manager approval status for JazzCash/EasyPaisa payments';
COMMENT ON COLUMN orders.status IS 'Order status managed by shop owner: pending, awaiting_payment, payment_verified, processing, shipped, delivered, cancelled, refunded';

-- Add instagram_posted column to products (optional - track if posted on Instagram)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS instagram_posted BOOLEAN DEFAULT false;

COMMENT ON COLUMN products.instagram_posted IS 'Track if this watch has been posted on Instagram @tick.teestyle';

-- Add notes column for shop manager
ALTER TABLE products
ADD COLUMN IF NOT EXISTS manager_notes TEXT;

COMMENT ON COLUMN products.manager_notes IS 'Private notes for shop manager (not visible to customers)';

-- Add sold_count column to track popular products
ALTER TABLE products
ADD COLUMN IF NOT EXISTS sold_count INTEGER DEFAULT 0;

COMMENT ON COLUMN products.sold_count IS 'Number of times this watch has been sold - useful for shop manager analytics';

-- Create view for shop manager to see best selling products
CREATE OR REPLACE VIEW manager_best_sellers AS
SELECT 
  p.id,
  p.name,
  p.brand,
  p.category,
  p.price,
  p.stock,
  p.sold_count,
  p.instagram_posted,
  (p.sold_count * p.price) as total_revenue
FROM products p
WHERE p.sold_count > 0
ORDER BY p.sold_count DESC, total_revenue DESC;

COMMENT ON VIEW manager_best_sellers IS 'Best selling watches - helps shop manager identify popular inventory for Instagram promotions';

-- Create view for low stock alerts
CREATE OR REPLACE VIEW manager_low_stock_alerts AS
SELECT 
  id,
  name,
  brand,
  category,
  stock,
  sold_count,
  instagram_posted
FROM products
WHERE stock > 0 AND stock < 10
ORDER BY stock ASC, sold_count DESC;

COMMENT ON VIEW manager_low_stock_alerts IS 'Products running low on stock - shop manager should restock soon';

-- Create view for pending orders that need attention
CREATE OR REPLACE VIEW manager_pending_orders AS
SELECT 
  o.id,
  o.created_at,
  o.total_amount,
  o.status,
  o.payment_method,
  o.payment_verified,
  o.transaction_id,
  p.email as customer_email,
  p.full_name as customer_name,
  p.phone as customer_phone
FROM orders o
LEFT JOIN profiles p ON o.user_id = p.id
WHERE o.status IN ('pending', 'awaiting_payment', 'payment_verified', 'processing')
ORDER BY 
  CASE o.status
    WHEN 'awaiting_payment' THEN 1
    WHEN 'payment_verified' THEN 2
    WHEN 'processing' THEN 3
    WHEN 'pending' THEN 4
  END,
  o.created_at ASC;

COMMENT ON VIEW manager_pending_orders IS 'Orders requiring shop manager action - payment verification, processing, shipping';

-- Grant access to views for authenticated users (shop managers)
GRANT SELECT ON manager_best_sellers TO authenticated;
GRANT SELECT ON manager_low_stock_alerts TO authenticated;
GRANT SELECT ON manager_pending_orders TO authenticated;

-- Create function to update sold count automatically when order is delivered
CREATE OR REPLACE FUNCTION update_product_sold_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update when status changes to 'delivered'
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    -- Update sold_count for all products in this order
    UPDATE products p
    SET sold_count = sold_count + oi.quantity
    FROM order_items oi
    WHERE oi.order_id = NEW.id
    AND oi.product_id = p.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic sold count updates
DROP TRIGGER IF EXISTS trigger_update_sold_count ON orders;
CREATE TRIGGER trigger_update_sold_count
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_product_sold_count();

COMMENT ON FUNCTION update_product_sold_count IS 'Automatically updates product sold_count when order status changes to delivered';

-- =====================================================
-- SHOP MANAGER HELPER QUERIES
-- Copy these to use in your admin dashboard
-- =====================================================

-- Query 1: Today's orders
-- SELECT * FROM orders WHERE DATE(created_at) = CURRENT_DATE ORDER BY created_at DESC;

-- Query 2: This month's revenue
-- SELECT SUM(total_amount) as monthly_revenue FROM orders WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE) AND status NOT IN ('cancelled', 'refunded');

-- Query 3: Best selling watches this month
-- SELECT p.name, p.brand, COUNT(oi.id) as times_sold, SUM(oi.quantity * oi.price) as revenue FROM order_items oi JOIN products p ON oi.product_id = p.id JOIN orders o ON oi.order_id = o.id WHERE DATE_TRUNC('month', o.created_at) = DATE_TRUNC('month', CURRENT_DATE) AND o.status = 'delivered' GROUP BY p.id, p.name, p.brand ORDER BY times_sold DESC LIMIT 10;

-- Query 4: Products never sold (consider removing or promoting on Instagram)
-- SELECT id, name, brand, category, price, stock, created_at FROM products WHERE sold_count = 0 ORDER BY created_at DESC;

-- Query 5: Total inventory value
-- SELECT SUM(price * stock) as total_inventory_value FROM products WHERE stock > 0;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
-- Database updated for shop manager role!
-- Shop manager can now:
-- 1. Track Instagram posts per product
-- 2. Add private notes for inventory management
-- 3. See best sellers automatically
-- 4. Get low stock alerts
-- 5. View pending orders needing attention
-- 6. Automatic sold count tracking
-- =====================================================
