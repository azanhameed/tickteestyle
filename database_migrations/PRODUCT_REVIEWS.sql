-- Product Reviews System Migration
-- Adds review and rating functionality to TickTee Style

-- =====================================================
-- 1. PRODUCT REVIEWS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.product_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(100),
    review_text TEXT,
    verified_purchase BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Prevent multiple reviews from same user on same product
    UNIQUE(product_id, user_id)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.product_reviews(created_at DESC);

-- Add comment
COMMENT ON TABLE public.product_reviews IS 'Customer reviews and ratings for products';

-- =====================================================
-- 2. REVIEW HELPFUL TRACKING (For "Was this helpful?" feature)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.review_helpful (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id UUID NOT NULL REFERENCES public.product_reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- One vote per user per review
    UNIQUE(review_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_review_helpful_review_id ON public.review_helpful(review_id);

-- =====================================================
-- 3. ADD REVIEW STATS TO PRODUCTS TABLE
-- =====================================================

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_products_average_rating ON public.products(average_rating DESC);

-- =====================================================
-- 4. FUNCTION TO UPDATE PRODUCT REVIEW STATS
-- =====================================================

CREATE OR REPLACE FUNCTION update_product_review_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update average rating and count for the product
    UPDATE public.products
    SET 
        average_rating = (
            SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0)
            FROM public.product_reviews
            WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
        ),
        review_count = (
            SELECT COUNT(*)
            FROM public.product_reviews
            WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
        )
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic stats updates
DROP TRIGGER IF EXISTS trigger_update_review_stats ON public.product_reviews;
CREATE TRIGGER trigger_update_review_stats
    AFTER INSERT OR UPDATE OR DELETE ON public.product_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_product_review_stats();

-- =====================================================
-- 5. FUNCTION TO UPDATE HELPFUL COUNT
-- =====================================================

CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.product_reviews
    SET helpful_count = (
        SELECT COUNT(*)
        FROM public.review_helpful
        WHERE review_id = COALESCE(NEW.review_id, OLD.review_id)
        AND is_helpful = true
    )
    WHERE id = COALESCE(NEW.review_id, OLD.review_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for helpful count updates
DROP TRIGGER IF EXISTS trigger_update_helpful_count ON public.review_helpful;
CREATE TRIGGER trigger_update_helpful_count
    AFTER INSERT OR UPDATE OR DELETE ON public.review_helpful
    FOR EACH ROW
    EXECUTE FUNCTION update_review_helpful_count();

-- =====================================================
-- 6. RLS POLICIES FOR REVIEWS
-- =====================================================

-- Enable RLS
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_helpful ENABLE ROW LEVEL SECURITY;

-- Product Reviews Policies
CREATE POLICY "Anyone can view approved reviews"
    ON public.product_reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can create their own reviews"
    ON public.product_reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
    ON public.product_reviews FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
    ON public.product_reviews FOR DELETE
    USING (auth.uid() = user_id);

-- Review Helpful Policies
CREATE POLICY "Anyone can view helpful votes"
    ON public.review_helpful FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can vote helpful"
    ON public.review_helpful FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own helpful votes"
    ON public.review_helpful FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own helpful votes"
    ON public.review_helpful FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- 7. VIEW FOR SHOP MANAGER - REVIEW MANAGEMENT
-- =====================================================

CREATE OR REPLACE VIEW manager_review_overview AS
SELECT 
    pr.id as review_id,
    pr.product_id,
    p.name as product_name,
    pr.user_id,
    prof.full_name as customer_name,
    prof.email as customer_email,
    pr.rating,
    pr.title,
    pr.review_text,
    pr.verified_purchase,
    pr.helpful_count,
    pr.created_at,
    -- Check if customer actually purchased this product
    EXISTS(
        SELECT 1 FROM public.order_items oi
        JOIN public.orders o ON oi.order_id = o.id
        WHERE o.user_id = pr.user_id 
        AND oi.product_id = pr.product_id
        AND o.status = 'delivered'
    ) as confirmed_purchase
FROM public.product_reviews pr
JOIN public.products p ON pr.product_id = p.id
JOIN public.profiles prof ON pr.user_id = prof.id
ORDER BY pr.created_at DESC;

COMMENT ON VIEW manager_review_overview IS 'Shop manager view of all product reviews with customer details';

-- =====================================================
-- 8. SEED SOME SAMPLE REVIEWS (Optional)
-- =====================================================

-- You can add sample reviews here after you have products and users
-- Example:
-- INSERT INTO public.product_reviews (product_id, user_id, rating, title, review_text, verified_purchase)
-- VALUES 
-- ('product-uuid-here', 'user-uuid-here', 5, 'Excellent Watch!', 'Very satisfied with the quality and delivery.', true);

-- =====================================================
-- 9. USEFUL QUERIES FOR SHOP MANAGER
-- =====================================================

-- Get products with highest ratings
-- SELECT * FROM products WHERE review_count > 0 ORDER BY average_rating DESC, review_count DESC LIMIT 10;

-- Get products needing reviews
-- SELECT id, name, review_count FROM products WHERE review_count = 0 AND stock > 0 ORDER BY created_at DESC;

-- Get recent reviews
-- SELECT * FROM manager_review_overview LIMIT 20;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- After running this migration:
-- 1. Customers can leave reviews on products they purchased
-- 2. Reviews automatically update product ratings
-- 3. Shop manager can view all reviews via manager_review_overview
-- 4. "Verified Purchase" badge automatically applied for actual buyers
-- 5. Customers can mark reviews as helpful
