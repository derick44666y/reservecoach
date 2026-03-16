# Before production — Reserve Coach

What’s done, what’s missing, and what to add before going live.

---

## What’s already implemented

**Storefront**
- Home page with product grid, **search** (name, description, tag)
- Product detail with gallery, quantity (capped by stock), out-of-stock handling
- Order form with full validation (Zod), stock check, placeholder image fallback
- Order success with **“Track your order”** link to `/order-status/{id}`
- Order status page reads from store (real orders, status updates)
- 404 page, header, footer
- **localStorage** persistence + cross-tab sync for products and orders

**Admin**
- Login with password from **env** (`VITE_ADMIN_PASSWORD`), sessionStorage
- Dashboard, Products, Orders
- **Products:** Add / Edit / Delete with form; **image upload from device** (computer or phone)
- **Orders:** List from store, search/filter, **View** drawer with **status dropdown** (updates store + order status page)
- Delete product fixed (ref so confirm actually runs)

**Other**
- Single toast system (Sonner), no dead code
- `index.html` meta/OG tags set to Reserve Coach (no duplicate/placeholder titles)

---

## Must have before production

### 1. Backend and database (Phase 3)
- **Right now:** All data lives in the browser (localStorage). Clearing data or using another device = no products/orders.
- **Need:** A backend (e.g. Node + Express, Next API, Supabase, Firebase) that:
  - Stores **products** and **orders** in a database
  - Exposes APIs: products CRUD, orders list, order by ID, update order status
- Frontend should call these APIs (and can keep localStorage as cache or drop it).

### 2. Real admin auth
- **Right now:** One shared password in env; anyone with the password is “admin”; session is only in sessionStorage (lost on close).
- **Need:** Proper auth, e.g.:
  - Email + password or magic link, with sessions/tokens
  - Or at least hashed password in DB and HTTPS-only cookies

### 3. Image storage (if you keep uploads)
- **Right now:** Uploaded images are stored as base64 in localStorage (size limit, slow with many/big images).
- **Need:** Upload to cloud storage (S3, Cloudinary, etc.) and save **URLs** in the product; backend or signed uploads for admin.

### 4. Environment and secrets
- **Need:** `VITE_API_URL` (or similar) for the frontend; backend env for DB URL and secrets. No passwords or API keys in the repo.

### 5. Error handling
- **Need:** At least one **error boundary** so a crash doesn’t show a blank screen.
- **Nice:** Loading and error states when fetching products/order (e.g. “Loading…”, “Something went wrong, try again”).

### 6. HTTPS and security
- **Need:** Site and admin over **HTTPS** in production.
- **Need:** Admin routes protected (redirect to login if not authed).
- **Nice:** Rate limiting or basic bot protection on the order form.

### 7. Deploy and env
- **Need:** Deploy frontend (and backend) to a host (Vercel, Netlify, etc.).
- **Need:** Set production env vars (API URL, admin password or auth config).

---

## Features worth adding (optional)

### Storefront
- **Filter/sort:** By price (low–high, high–low) or by tag (Best Seller, Limited Stock, New Arrival).
- **Copy order number:** Button on order success to copy “RC-xxxxx” to clipboard.
- **Contact / FAQ:** Link in footer (e.g. “Questions? DM us” or a simple contact page).

### Admin
- **Live dashboard:** Stats from real data (e.g. “Pending orders: X”, “Products: Y”, “Revenue (from orders)”) instead of hardcoded numbers.
- **Recent activity:** From actual orders (e.g. last 5 orders with status changes).
- **Export orders:** CSV export for orders (for bookkeeping or marketing).

### SEO and sharing
- **Dynamic meta per page:** Different `<title>` and meta description for home vs product page (e.g. product name in title). Can use React Helmet or similar.
- **Sitemap / robots:** When you have a real domain, add sitemap and robots.txt for crawlers.

### Quality and trust
- **Privacy / terms:** Short pages or links (e.g. “Privacy”, “Terms”) in footer if you collect personal data.
- **Analytics:** Optional page-view or conversion tracking (e.g. Plausible, Vercel Analytics) without touching payment flow.

---

## Summary

| Area              | Status        | Before production                          |
|-------------------|---------------|--------------------------------------------|
| Data & backend    | localStorage  | Add backend + DB, move products/orders     |
| Admin auth        | Single password | Proper auth + sessions/tokens            |
| Images            | Base64 in LS  | Cloud storage + URLs                      |
| Error handling    | None          | Error boundary + loading/error states      |
| Security          | Basic         | HTTPS, protect admin, env for secrets      |
| Deploy            | Local only    | Deploy app + set env                       |
| Optional          | —             | Filters, copy order#, live dashboard, SEO  |

Once backend, auth, image storage, env, error handling, and deploy are in place, you’re in good shape for production. The optional features can follow when you have time.
