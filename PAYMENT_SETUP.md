# Payment Integration Setup Guide

## Overview

This guide explains how to set up the payment system for Pakistan, including Cash on Delivery (COD), Bank Transfer, JazzCash, and EasyPaisa.

## Database Setup

### 1. Run SQL Migration

Execute the SQL in `database_migrations/payment_fields.sql` in your Supabase SQL Editor:

```sql
-- Add payment-related columns
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS payment_proof_url text,
ADD COLUMN IF NOT EXISTS transaction_id text,
ADD COLUMN IF NOT EXISTS payment_verified boolean DEFAULT false;
```

### 2. Create Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `payment-proofs`
3. Set it to **PRIVATE** (not public)
4. Add the storage policies from the migration file

## Configuration

### Update Bank Details

Edit `components/checkout/BankTransferForm.tsx`:

```typescript
const BANK_DETAILS = {
  bankName: 'Your Bank Name',
  accountTitle: 'Your Account Title',
  accountNumber: 'Your Account Number',
  iban: 'Your IBAN',
  branch: 'Your Branch',
};
```

### Update Mobile Wallet Numbers

Edit `components/checkout/MobileWalletForm.tsx`:

```typescript
const WALLET_DETAILS = {
  jazzcash: {
    number: 'Your JazzCash Number',
    name: 'JazzCash',
  },
  easypaisa: {
    number: 'Your EasyPaisa Number',
    name: 'EasyPaisa',
  },
};
```

## Payment Methods

### 1. Cash on Delivery (COD)
- **Status**: Confirmed immediately (`pending`)
- **Fee**: Rs. 200 added to order total
- **No verification needed**

### 2. Bank Transfer
- **Status**: `awaiting_payment` until verified
- **Required**: Payment proof upload + Order reference number
- **Verification**: Manual by admin
- **Timeline**: Usually 24 hours

### 3. JazzCash / EasyPaisa
- **Status**: `awaiting_payment` until verified
- **Required**: Transaction ID
- **Optional**: Payment screenshot
- **Verification**: Manual by admin
- **Timeline**: Usually 24 hours

## Admin Workflow

1. **View Pending Payments**: Go to Admin Dashboard → Payment Verification tab
2. **Review Payment**: Click "Review" on an order
3. **Verify Payment**: 
   - Check payment proof (if uploaded)
   - Verify transaction ID matches
   - Click "Verify Payment"
4. **Reject Payment**: 
   - If payment doesn't match
   - Provide rejection reason
   - Customer will be notified

## Email Notifications

Currently, emails are logged to console. To enable actual email sending:

1. Choose an email service (SendGrid, AWS SES, Mailgun)
2. Update `lib/email.ts` with your email service integration
3. Set up environment variables for API keys

## Testing

### Test COD Order
1. Add items to cart
2. Go to checkout
3. Select "Cash on Delivery"
4. Place order
5. Verify order status is "pending"

### Test Bank Transfer
1. Add items to cart
2. Go to checkout
3. Select "Bank Transfer"
4. Upload payment proof
5. Enter order reference
6. Place order
7. Verify order status is "awaiting_payment"
8. Admin: Verify payment in admin dashboard

### Test Mobile Wallet
1. Add items to cart
2. Go to checkout
3. Select "JazzCash" or "EasyPaisa"
4. Enter transaction ID
5. Optionally upload screenshot
6. Place order
7. Verify order status is "awaiting_payment"
8. Admin: Verify payment in admin dashboard

## Security Notes

- Payment proofs are stored in private bucket
- Only authenticated users can upload proofs
- Users can only view their own payment proofs
- Admins can view all payment proofs
- All payment data is validated server-side

## Future Enhancements

- Integrate Safepay payment gateway
- Integrate Payfast payment gateway
- Integrate Fonepay
- Automated payment verification (if possible)
- SMS notifications for payment status
- Payment reminder emails

## Support

For payment-related issues:
- Email: support@tickteestyle.com
- Phone: +1-234-567-8900




