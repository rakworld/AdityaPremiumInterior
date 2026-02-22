# Aditya Premium Interiors — Website Setup Guide

## Project Structure
```
aditya-premium-interiors/
├── index.html                  # Homepage
├── pages/
│   ├── about.html              # About Page
│   ├── services.html           # Services Page
│   ├── portfolio.html          # Portfolio Page
│   └── contact.html            # Contact Page
├── css/
│   └── style.css               # Main Stylesheet
├── js/
│   └── main.js                 # Main JavaScript
├── images/
│   └── logo-white.png          # Company Logo white
│   ├── logo-black.png          # Company Logo black
├── .htaccess                   # Apache security + performance config
├── sitemap.xml                 # SEO Sitemap
├── robots.txt                  # Search engine rules
└── README.md                   # This file
```

---

## Tech Stack
- **Frontend**: Static HTML5 + CSS3 + Vanilla JavaScript
- **Security**: .htaccess rules, reCAPTCHA, CSRF, honeypot, rate limiting
- **SEO**: Schema.org LocalBusiness, Open Graph, sitemap.xml
- **Hosting**: Any Apache/Nginx server with PHP support (Hostinger, GoDaddy, SiteGround, etc.)

---

## Deployment Steps

### 1. Upload Files
Upload all files to your web hosting's `public_html` folder via FTP or cPanel File Manager.

### 2. Set Up Google reCAPTCHA

#### Step 1: Get Keys
1. Go to https://www.google.com/recaptcha/admin
2. Register your domain (e.g., `adityapremiuminteriors.com`)
3. Choose **reCAPTCHA v2 (Checkbox)**
4. Copy the **Site Key** and **Secret Key**

#### Step 2: Add to Frontend
In `pages/contact.html`, find this comment and uncomment it:
```html
<!-- <div class="g-recaptcha" data-sitekey="YOUR_RECAPTCHA_SITE_KEY"></div> -->
```
Replace `YOUR_RECAPTCHA_SITE_KEY` with your Site Key.

Also uncomment the reCAPTCHA script tag at the bottom:
```html
<!-- <script src="https://www.google.com/recaptcha/api.js" async defer></script> -->
```

#### Step 3: Add to Backend
In `backend/contact.php`, replace `YOUR_RECAPTCHA_SECRET_KEY`:
```php
define('RECAPTCHA_SECRET', 'your_actual_secret_key_here');
```
Then uncomment the reCAPTCHA verification block (lines ~75-84).

### 3. Configure Email (SMTP)
For reliable email delivery, configure SMTP on your hosting:
- Use **PHPMailer** library for better deliverability
- Or configure cPanel SMTP settings
- Set sender email to a domain email: `noreply@adityapremiuminteriors.com`

### 4. File Permissions
```bash
chmod 644 .htaccess
chmod 755 backend/
chmod 644 backend/contact.php
chmod 750 logs/
```

### 5. HTTPS (SSL Certificate)
- Enable free Let's Encrypt SSL via cPanel → SSL/TLS
- The `.htaccess` already forces HTTPS redirect

### 6. Update Domain References
Replace all instances of `adityapremiuminteriors.com` in:
- `index.html` (canonical URL, og:url, schema markup)
- `pages/about.html`
- `pages/services.html`
- `pages/portfolio.html`
- `pages/contact.html`
- `sitemap.xml`
- `robots.txt`

### 7. Update Google Maps Embed
In `pages/contact.html`, update the Google Maps iframe src with your actual business location embed URL:
1. Go to Google Maps and search your business
2. Click Share → Embed a map
3. Copy the iframe src URL
4. Replace the placeholder in contact.html

---

## Security Checklist

- [x] HTTPS enforced via .htaccess
- [x] Security headers (CSP, X-Frame-Options, HSTS, etc.)
- [x] Email address obfuscated via base64 + JavaScript
- [x] Honeypot anti-spam field
- [x] Input sanitization (XSS prevention)
- [x] Server-side validation
- [x] Rate limiting (5 submissions per 10 min per IP)
- [ ] reCAPTCHA (add your keys)
- [ ] CSRF token (implement with PHP sessions)
- [ ] SMTP email (replace PHP mail() with PHPMailer)

---

## SEO Checklist

- [x] Meta title and description on all pages
- [x] Open Graph tags
- [x] Schema.org LocalBusiness markup
- [x] Canonical URLs
- [x] sitemap.xml
- [x] robots.txt
- [x] Alt text on all images
- [x] Semantic HTML (headings, nav, main, footer)
- [x] Mobile responsive design
- [x] Image lazy loading
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Set up Google My Business listing
- [ ] Add actual project photos (replace Unsplash placeholders)

---

## Performance Tips

1. **Replace placeholder images** with actual project photos in WebP format
2. **Enable Cloudflare** free CDN for faster global delivery
3. **Enable caching** via .htaccess (already configured)
4. **Minify CSS/JS** before going live (use tools like cssnano, terser)

---

## WhatsApp Integration

WhatsApp button is pre-configured. If you need to change the number:
- Search for `wa.me/916304035669` in all HTML files
- Replace with `wa.me/91XXXXXXXXXX` (your number with 91 country code)

Prefilled message can be updated in the `text=` parameter (URL-encoded).

---

## Contact / Support

For technical issues with this website:
- Email: adityapremiuminteriors@gmail.com
- WhatsApp: +91 63040 35669

---

© 2024 Aditya Premium Interiors. All Rights Reserved.
