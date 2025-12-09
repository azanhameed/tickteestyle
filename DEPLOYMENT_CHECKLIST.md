# Production Deployment Checklist

## 🚀 PRE-DEPLOYMENT

### Environment Configuration
- [ ] Copy `.env.example` to `.env.local`
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your production domain
- [ ] Configure Supabase credentials
- [ ] Add Google Analytics ID (optional)
- [ ] Set contact information (phone, email, Instagram)
- [ ] Configure payment gateway numbers

### Database
- [ ] Run `FIX_RLS_POLICIES.sql` (CRITICAL for orders)
- [ ] Run `SHOPKEEPER_UPDATES.sql` (manager features)
- [ ] Run `PRODUCT_REVIEWS.sql` (review system)
- [ ] Create admin user manually in Supabase
- [ ] Verify RLS policies are active
- [ ] Backup database

### Content
- [ ] Replace `og-image.svg` with JPG (1200x630px)
- [ ] Update testimonials with real customer names/photos
- [ ] Add real product images
- [ ] Verify all product data is correct
- [ ] Test contact form

### Code Quality
- [ ] Run `npm run type-check` - No TypeScript errors
- [ ] Run `npm run lint` - No linting errors
- [ ] Run `npm test` - All tests passing
- [ ] Run `npm run build` - Build succeeds
- [ ] Check bundle size is reasonable

### Performance
- [ ] Test page load times
- [ ] Verify images are optimized
- [ ] Check mobile performance
- [ ] Test with slow 3G connection

### Security
- [ ] Verify rate limiting works
- [ ] Test error boundaries
- [ ] Check input validation
- [ ] Ensure no secrets in code
- [ ] Enable HTTPS

---

## 🔧 DEPLOYMENT PLATFORMS

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Environment Variables**: Add in Vercel Dashboard
- Settings → Environment Variables
- Add all from `.env.local`

### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### Option 3: Custom Server (VPS/Cloud)
```bash
# Build
npm run build

# Start
npm start
```

**Requirements**:
- Node.js 18+
- PM2 for process management
- Nginx for reverse proxy

---

## ⚙️ POST-DEPLOYMENT

### Verification
- [ ] Visit homepage - loads correctly
- [ ] Test shop page - products display
- [ ] Test product detail pages
- [ ] Test add to cart functionality
- [ ] Test checkout flow (all payment methods)
- [ ] Test authentication (signup, login, logout)
- [ ] Test admin dashboard
- [ ] Test contact form
- [ ] Verify FAQ page loads
- [ ] Check breadcrumbs work
- [ ] Test mobile responsiveness

### SEO & Analytics
- [ ] Submit sitemap to Google Search Console
- [ ] Verify Google Analytics tracking
- [ ] Check meta tags with [Meta Tags](https://metatags.io/)
- [ ] Test structured data with [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Verify robots.txt accessible

### Monitoring
- [ ] Set up error logging (check console)
- [ ] Monitor Supabase usage
- [ ] Check rate limiting logs
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)

### Performance
- [ ] Run Lighthouse audit (target: 90+ scores)
- [ ] Check Core Web Vitals
- [ ] Test from different locations
- [ ] Verify CDN working

---

## 🐛 COMMON ISSUES & FIXES

### Build Fails
```bash
# Clear cache
rm -rf .next
npm run build
```

### Supabase Connection Error
- Verify environment variables are set
- Check Supabase project is active
- Ensure RLS policies allow public read

### Images Not Loading
- Check image URLs are accessible
- Verify Supabase storage permissions
- Use absolute URLs for external images

### Rate Limiting Too Strict
- Adjust limits in `lib/rateLimit.ts`
- Consider using Redis for production

---

## 📊 MONITORING CHECKLIST

### Daily
- [ ] Check error logs
- [ ] Monitor site uptime
- [ ] Review critical errors

### Weekly
- [ ] Review analytics data
- [ ] Check conversion rates
- [ ] Monitor page performance
- [ ] Review user feedback

### Monthly
- [ ] Update dependencies
- [ ] Review and optimize slow queries
- [ ] Analyze traffic trends
- [ ] Plan improvements based on data

---

## 🚨 ROLLBACK PLAN

If something goes wrong:

1. **Vercel**: Instantly rollback to previous deployment in dashboard
2. **Netlify**: Use deployment history to revert
3. **Custom**: Keep backup of working code

```bash
# Git rollback
git revert HEAD
git push origin main
```

---

## 📞 SUPPORT CONTACTS

### Technical Issues
- Supabase: [support.supabase.com](https://support.supabase.com)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)
- Vercel: [vercel.com/support](https://vercel.com/support)

### Emergency
- Database down: Switch to maintenance mode
- Site down: Check hosting provider status
- Payment issues: Contact payment gateway support

---

## ✅ PRODUCTION READY CRITERIA

Your site is ready for production when:
- ✅ All environment variables configured
- ✅ Database migrations complete
- ✅ No TypeScript/lint errors
- ✅ All tests passing
- ✅ Build succeeds without warnings
- ✅ Core features tested manually
- ✅ Performance acceptable (Lighthouse 90+)
- ✅ Security measures in place
- ✅ Monitoring setup
- ✅ Backup plan ready

---

**Good luck with your launch! 🚀**

**Project**: TickTee Style  
**Instagram**: @tick.teestyle  
**Contact**: +92 315 0374729
