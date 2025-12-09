# 🛍️ SHOP MANAGER GUIDE - TickTee Style

## Welcome, Shop Manager!

You are the owner and manager of **TickTee Style** - a luxury watch business operating through:
- **Website:** http://localhost:3001 (or your production URL)
- **Instagram:** @tick.teestyle

This guide will help you manage your entire watch business from this admin dashboard.

---

## 🎯 Your Role as Shop Manager

As the shop manager/owner, you:
1. ✅ Manage watch inventory (add, edit, delete products)
2. ✅ Process customer orders from the website
3. ✅ Verify payments (JazzCash, EasyPaisa, COD)
4. ✅ Update order status (processing → shipped → delivered)
5. ✅ Track business statistics and revenue
6. ✅ Coordinate inventory between website and Instagram shop

---

## 🚀 GETTING STARTED

### Step 1: Get Manager Access

1. **Sign up on your website:**
   - Go to: http://localhost:3001/auth/signup
   - Use your business email
   - Create a strong password

2. **Make yourself a shop manager:**
   - Go to Supabase Dashboard: https://supabase.com/dashboard
   - Click "SQL Editor"
   - Run this (replace with your email):
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE email = 'your-business-email@example.com';
   ```

3. **Login as manager:**
   - Go to: http://localhost:3001/auth/login
   - Login with your credentials
   - Now you have full manager access!

### Step 2: Access Your Dashboard

**Manager Dashboard:** http://localhost:3001/admin

From here you can:
- View business statistics
- Add new watches
- Manage orders
- Verify payments

---

## 📦 MANAGING YOUR WATCH INVENTORY

### Adding a New Watch

1. **Go to Inventory Management:**
   - Click "Shop Management" → "Add New Watch"
   - Or go directly: http://localhost:3001/admin/products/add

2. **Fill in Watch Details:**

   **Name:** (e.g., "Rolex Submariner Date")
   - Full product name as you want customers to see it

   **Brand:** (e.g., "Rolex")
   - Watch manufacturer name

   **Price:** (e.g., 89000)
   - Price in Pakistani Rupees (PKR)
   - Don't add commas, just the number

   **Description:**
   ```
   Professional diver's watch with 300m water resistance. 
   Features automatic movement, date display, and iconic design.
   Comes with original box and warranty card.
   ```

   **Category:** Select from:
   - Men's Watches (mens)
   - Women's Watches (womens)
   - Luxury Collection (luxury)
   - Sports Watches (sports)

   **Stock:** (e.g., 8)
   - How many pieces you have available
   - Website automatically shows "Out of Stock" when stock = 0

   **Images:** (Up to 5 images)
   - Upload clear, high-quality photos
   - First image becomes the main product image
   - Show different angles: front, side, back, on wrist
   - Recommended size: 800x800px or larger

3. **Click "Add Product"**
   - Watch is immediately available on your website!
   - Appears in shop page: http://localhost:3001/shop

### Editing an Existing Watch

1. Go to: http://localhost:3001/admin/products
2. Find the watch you want to edit
3. Click "Edit" button
4. Update any details (price, stock, description, images)
5. Click "Update Product"

### Deleting a Watch

1. Go to: http://localhost:3001/admin/products
2. Find the watch
3. Click "Delete" button
4. Confirm deletion
   - ⚠️ **Warning:** This permanently removes the watch from your website

### Managing Stock

**Low Stock Alerts:**
- Dashboard shows products with stock < 10
- Restock popular items before they run out

**Out of Stock:**
- Set stock to 0 to temporarily hide from shop
- Customers can't purchase out-of-stock items

---

## 🛒 PROCESSING CUSTOMER ORDERS

### Order Workflow

```
Customer Places Order
        ↓
🔔 YOU RECEIVE NOTIFICATION
        ↓
Verify Payment (if JazzCash/EasyPaisa)
        ↓
Update Status: Processing
        ↓
Pack and Ship
        ↓
Update Status: Shipped
        ↓
Customer Receives
        ↓
Update Status: Delivered ✅
```

### Viewing Orders

**All Orders:** http://localhost:3001/admin/orders

**Order Information Includes:**
- Order ID
- Customer name and contact
- Items ordered
- Total amount
- Payment method
- Current status
- Order date

### Payment Methods You Accept

#### 1. **Cash on Delivery (COD)**
- Customer pays when receiving the product
- Rs. 200 extra COD handling fee
- **Status:** Automatically set to "Pending"
- **Your Action:** Pack and ship, update to "Processing" → "Shipped" → "Delivered"

#### 2. **JazzCash**
- Customer transfers to: **03150374729**
- Customer uploads payment screenshot
- Customer enters transaction ID
- **Status:** Automatically set to "Awaiting Payment"
- **Your Action:** 
  1. Verify payment in your JazzCash account
  2. Check transaction ID matches
  3. Click "Verify Payment" or "Reject Payment"
  4. If verified → update to "Processing"

#### 3. **EasyPaisa**
- Customer transfers to: **03150374729**
- Customer uploads payment screenshot
- Customer enters transaction ID
- **Status:** Automatically set to "Awaiting Payment"
- **Your Action:** Same as JazzCash verification

### Payment Verification Process

1. **Go to Payment Verification:**
   - Dashboard → "Verify Payments"
   - Or: http://localhost:3001/admin/payments

2. **Review Payment:**
   - Click "Review" on pending payment
   - View uploaded screenshot
   - Check transaction ID
   - Verify amount matches order total

3. **Verify or Reject:**
   - **Verify:** If payment is correct
     - Order status changes to "Payment Verified"
     - You can now process the order
   - **Reject:** If payment issue
     - Provide reason (wrong amount, fake screenshot, etc.)
     - Customer is notified

### Updating Order Status

1. Go to: http://localhost:3001/admin/orders
2. Find the order
3. Click "Update Status"
4. Select new status:
   - **Pending:** Order received, awaiting action
   - **Awaiting Payment:** Waiting for payment verification
   - **Payment Verified:** Payment confirmed, ready to process
   - **Processing:** Packing the order
   - **Shipped:** Sent to delivery
   - **Delivered:** Customer received (order complete!)
   - **Cancelled:** Order cancelled
   - **Refunded:** Money returned to customer

---

## 📊 BUSINESS ANALYTICS

### Dashboard Statistics

**Total Products:**
- Number of watches in your inventory

**Total Orders:**
- All orders received through website

**Total Revenue:**
- Total money earned (in PKR)
- Excludes cancelled and refunded orders

**Pending Verifications:**
- Number of payments waiting for your verification

### View Detailed Reports

**Recent Orders:**
- Last 10 orders on dashboard
- Quick overview of recent business

**Low Stock Products:**
- Watches running low (stock < 10)
- Time to restock!

---

## 📱 INSTAGRAM INTEGRATION

### Coordinating Website & Instagram

Your watches are sold on both website and Instagram. Keep inventory synchronized:

**When you add a new watch:**
1. Add to website (using admin dashboard)
2. Post same watch on Instagram @tick.teestyle
3. Use Instagram photos on website too for consistency

**When a watch sells:**
- **Website:** Stock automatically decreases
- **Instagram:** Manually update or delete the post
- **Both:** Mark as sold/unavailable

**When stock is low:**
- Update Instagram story/caption: "Only X pieces left!"
- Creates urgency for buyers

**Promotional Strategy:**
1. Post new arrivals on Instagram first
2. Drive Instagram followers to website
3. Offer website-exclusive deals
4. Use Instagram for brand building
5. Use website for secure transactions

---

## 💡 BEST PRACTICES

### Inventory Management

✅ **Keep accurate stock counts**
- Update stock immediately when selling on Instagram
- Website automatically updates when selling online

✅ **Use high-quality images**
- Clear, well-lit photos
- Multiple angles
- Shows watch details

✅ **Write detailed descriptions**
- Mention brand, model, features
- Include dimensions, materials
- Add what's included (box, warranty, etc.)

✅ **Price competitively**
- Research market rates
- Consider your costs
- Allow room for promotions

### Order Processing

✅ **Respond quickly**
- Verify payments within 24 hours
- Update order status regularly
- Ship within 2-3 business days

✅ **Communicate with customers**
- (Future feature: Automated emails)
- For now: Use customer email/phone from order details

✅ **Package securely**
- Protect watch during shipping
- Include invoice and business card
- Add thank you note for repeat business

✅ **Track shipments**
- Note delivery tracking number
- (Future feature: Add to order details)

### Customer Service

✅ **Handle issues professionally**
- Address payment concerns quickly
- Process refunds if needed
- Build trust for repeat customers

✅ **Build your reputation**
- Authentic products only
- Accurate descriptions
- Reliable delivery

---

## 🔐 SECURITY TIPS

✅ **Protect your manager account**
- Use strong password
- Don't share login credentials
- Logout when done

✅ **Verify payments carefully**
- Check transaction IDs
- Match amounts exactly
- Reject suspicious payments

✅ **Backup your data**
- Supabase automatically backs up database
- Save important order records

---

## 📞 PAYMENT ACCOUNT DETAILS

**Your Business JazzCash/EasyPaisa Number:**
**03150374729**

This number is shown to customers during checkout. Make sure:
- ✅ Account is active
- ✅ You check it regularly for payments
- ✅ Transaction history is maintained

**To Change This Number:**
1. Update in code: Search for "03150374729"
2. Update in database if stored
3. Re-deploy website

---

## 🎯 DAILY TASKS CHECKLIST

### Morning (Start of Business Day)
- [ ] Check dashboard for new orders
- [ ] Verify pending payments
- [ ] Update order statuses
- [ ] Check low stock alerts
- [ ] Review any customer issues

### During Day
- [ ] Process confirmed orders
- [ ] Pack items for shipping
- [ ] Update Instagram with new arrivals
- [ ] Respond to customer inquiries

### Evening (End of Business Day)
- [ ] Final check for new orders
- [ ] Update any remaining order statuses
- [ ] Review daily sales
- [ ] Plan tomorrow's tasks

---

## 🚀 GROWING YOUR BUSINESS

### Short-term (Month 1-3)
1. Build inventory to 20-30 watches
2. Maintain active Instagram presence
3. Process orders efficiently
4. Collect customer reviews
5. Offer first-time buyer discounts

### Medium-term (Month 3-6)
1. Identify best-selling watches
2. Stock more popular brands
3. Run promotional campaigns
4. Build repeat customer base
5. Improve product photography

### Long-term (6+ Months)
1. Expand to more watch categories
2. Partner with watch brands
3. Offer exclusive collections
4. Build email marketing list
5. Consider physical store

---

## ❓ TROUBLESHOOTING

### "I can't access admin dashboard"
- Make sure your profile role = 'admin' in database
- Try logging out and back in
- Clear browser cache

### "Products not showing on shop page"
- Check if stock > 0
- Verify product was saved successfully
- Refresh the shop page

### "Payment verification not working"
- Check if payment proof was uploaded
- Verify transaction ID is entered
- Ensure you have manager access

### "Can't upload product images"
- Check image file size (max 5MB)
- Use JPG or PNG format
- Ensure good internet connection
- Check Supabase storage bucket exists

---

## 📚 QUICK LINKS

**Manager Dashboard:** http://localhost:3001/admin
**Add New Watch:** http://localhost:3001/admin/products/add
**Manage Inventory:** http://localhost:3001/admin/products
**View Orders:** http://localhost:3001/admin/orders
**Verify Payments:** http://localhost:3001/admin/payments
**Your Shop Page:** http://localhost:3001/shop
**Instagram:** https://instagram.com/tick.teestyle

**Supabase Dashboard:** https://supabase.com/dashboard
**Your Project ID:** qhjxgmrscgkpzakzmfnn

---

## 🎉 SUCCESS!

You now have everything you need to run your TickTee Style watch business!

**Remember:**
- You are the shop manager/owner
- Customers buy from your website
- You verify payments and ship products
- Build your brand through Instagram
- Provide excellent customer service

**Your business, your way!** 💪

---

**Need Help?**
- Check database migrations in: `database_migrations/` folder
- Review code documentation in each file
- All features are built for YOUR business success

**Good luck with your watch business! 🎊**
