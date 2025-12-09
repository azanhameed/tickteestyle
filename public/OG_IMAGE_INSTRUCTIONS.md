# OG Image Setup Instructions

## Current Status
- ❌ Real OG image missing (causes 404 error)
- ✅ SVG placeholder created (`og-image.svg`)

## What is OG Image?
Open Graph image is the preview image shown when you share your website link on:
- Facebook
- Twitter
- WhatsApp
- LinkedIn
- Instagram Stories

## Required Specifications

### Image Requirements:
- **Format**: JPG or PNG
- **Dimensions**: 1200 x 630 pixels (recommended)
- **File Size**: Under 1MB
- **File Name**: `og-image.jpg`
- **Location**: `/public/og-image.jpg`

### Content Suggestions:
1. **Brand Logo**: TickTee Style logo prominently displayed
2. **Tagline**: "Where Time Meets Trend" or "Luxury Watches Online"
3. **Visuals**: 
   - 2-3 luxury watch images
   - Instagram handle: @tick.teestyle
   - Website URL (optional)
4. **Colors**: Use your brand colors (Blue #1e3a8a, Gold #d4af37)

## How to Create OG Image

### Option 1: Use Canva (FREE - Recommended)
1. Go to canva.com
2. Search for "Facebook Post" template (1200x630)
3. Design with:
   - Your logo
   - Watch images
   - Text: "TickTee Style - Luxury Watches"
   - Instagram: @tick.teestyle
4. Download as JPG
5. Rename to `og-image.jpg`
6. Place in `/public/` folder

### Option 2: Use Figma (FREE)
1. Create 1200x630 artboard
2. Add brand elements and watch images
3. Export as JPG
4. Save as `og-image.jpg`

### Option 3: Use Online OG Image Generator
- https://og-image.vercel.app/
- https://www.opengraph.xyz/
- Customize and download

### Option 4: Hire Designer
- Fiverr: $5-20
- Upwork: $10-50
- Request: "1200x630 OG image for watch e-commerce site"

## Current Placeholder
A temporary SVG file (`og-image.svg`) is in place. It shows:
- TickTee Style logo concept
- Brand colors
- Basic watch icon
- Text elements

This SVG works but a professional JPG image will:
- Load faster
- Look better on social media
- Increase click-through rates
- Build brand credibility

## What to Send Me
If you want me to use a specific image:
1. Provide image URL (if online)
2. Or tell me: "I have an image, how do I add it?"
3. Then just place your `og-image.jpg` in the `/public/` folder

## Testing OG Image
After adding the image:
1. Share your website link on WhatsApp/Facebook
2. Check the preview
3. If old image shows, wait 24 hours or use:
   - Facebook: https://developers.facebook.com/tools/debug/
   - LinkedIn: https://www.linkedin.com/post-inspector/

## Priority: MEDIUM
- Doesn't affect website functionality
- Important for marketing/social sharing
- Can be added anytime before launch

## File Location
```
TickTee/
  public/
    og-image.jpg  ← Add your image here (1200x630px)
    og-image.svg  ← Current placeholder
    robots.txt
```

---

**Note**: The website works perfectly without a real OG image. This only affects social media sharing previews.
