# Full plan for Reserve Coach (reserve-luxe)

This is the full plan for the project: what it is, what’s done, what’s missing, and how to get it to a production-ready state.

---

## 1. What this project is

- **Product:** Reserve Coach — a small luxury bag store.
- **Flow:** Customer browses bags → product page → order form (name, address, etc.) → “order placed.” You then contact them for payment (Zelle, Cash App, Venmo) and update status manually.
- **Admin:** A “vault” to see dashboard stats, products, and orders (no real backend yet; everything is mock or in-memory).
- **Stack:** React 18, Vite, TypeScript, Tailwind, shadcn/ui, React Router, React Query, Framer Motion, Zod, Sonner. No server or database yet.

---

## 2. What’s already built and working

- **Storefront**
  - Home page with product grid (from `src/data/products.ts`).
  - Product detail page with gallery, quantity (1–5), and “Order this bag” CTA.
  - Order form with full validation (Zod): name, email, phone, US address, notes.
  - Order success page (shows order number and “what happens next”).
  - Order status page by ID (mock: always shows generic “pending” unless you add data to `mockOrderData`).
  - 404 page and basic layout (header, footer).
- **Admin**
  - Login with a single password (stored in sessionStorage; password is hardcoded in code).
  - Layout with sidebar (Dashboard, Products, Orders) and logout.
  - Dashboard with static stats and “Recent activity.”
  - Products table: list of all bags (read-only; Add/Edit/Delete do nothing).
  - Orders table: mock list with search and status filter; copy phone; “View” (Eye) does nothing.
- **UI**
  - Dark theme by default, responsive layout, sticky mobile CTA on product page.
  - Toasts (Sonner) for success/error.

---

## 3. What’s missing or incomplete

- **Data and backend**
  - No API or database. Products live in a static file; orders are only in memory (and lost on refresh). Admin auth is a flag in sessionStorage and a hardcoded password.
- **Admin actions**
  - “Add New Bag,” Edit (pencil), Delete (trash), and “View” order are not implemented.
  - No way to change an order’s status from the admin (e.g. mark as “contacted” or “shipped”).
- **Customer experience**
  - No link from order success to the order status URL (e.g. `/order-status/RC-xxxxx`).
  - Quantity is capped at 5 but not limited by product stock; no out-of-stock handling.
  - Order status page always shows mock data; real orders are never saved or displayed.
- **Robustness and security**
  - Admin password in source code; no env-based config or proper auth.
  - No loading or error states for “future” API calls; no error boundary.
  - `public/placeholder.svg` exists but is never used (e.g. for missing product images).
- **Code quality**
  - Duplicate toast setup (Sonner + unused Toaster); unused `NavLink` component.
  - Only one trivial test; no tests for forms, routing, or admin.

---

## 4. Full roadmap (phased plan)

### Phase 1 — Quick fixes and polish (no backend)

- Use **one** toast system (e.g. keep Sonner, remove unused Toaster) and remove dead code (e.g. unused `NavLink` if you don’t need it).
- **Order success page:** Add a link/button to “Track your order” that goes to `/order-status/{orderId}` (orderId from the success URL).
- **Product detail / order form:** Enforce stock: quantity selector max = `min(5, product.stock)`; show “Out of stock” and disable order when stock is 0.
- **Product gallery:** If `images` is empty, show `placeholder.svg` (or a similar fallback) so the layout doesn’t break.
- **Admin:** Move the password to an env variable (e.g. `VITE_ADMIN_PASSWORD`) and document it in README; still no real auth, but not in source.

### Phase 2 — Admin can “do something” (still no real backend)

- **Products:**  
  - “Add New Bag” opens a form (name, slug, price, description, features, images URLs, stock, tag).  
  - Save adds to an in-memory list (e.g. React state or a simple store) so new products appear until refresh.  
  - Edit pre-fills the same form and updates that in-memory list.  
  - Delete removes from the list (with confirm dialog).
- **Orders:**  
  - “View” (Eye) opens a detail view or drawer: customer info, bag, total, and a **status dropdown**.  
  - Changing status updates in-memory order list (and, for demo, the order status page could read from the same in-memory store by orderId so `/order-status/RC-xxx` shows the updated status).
- **Order form:** On submit, besides showing a toast and going to success, “save” the order into the same in-memory store (with a generated ID like `RC-xxxxx`) so admin and order-status page can show it until refresh.

This gives a full demo flow: place order → see it in admin → change status → see status on order-status page, all without a database.

### Phase 3 — Backend and persistence

- Introduce a **backend** (Node/Express, Next API routes, or a BaaS like Supabase/Firebase).
- **Auth:** Replace sessionStorage + single password with real admin login (e.g. email + password, or magic link) and sessions/tokens.
- **Products:** CRUD API and DB table; admin forms call the API; storefront reads products from API (with React Query).
- **Orders:** POST order from the order form; GET order by ID for the order-status page; admin GET list and PATCH status. Persist in DB.
- **Environment:** `VITE_API_URL`, backend env for DB and secrets; no passwords in repo.

### Phase 4 — Production readiness

- **Error handling:** Error boundary for the app; loading and error states for all data (products, order, order status).
- **SEO:** Meta tags (e.g. React Helmet or similar) for home and product pages; basic Open Graph for sharing.
- **Accessibility:** Keyboard and screen reader pass; focus management in modals and forms.
- **Testing:** Unit tests for validation (Zod schemas), form behavior, and key flows; one or two E2E tests (e.g. place order, open admin and change status).
- **Deploy:** Build and deploy frontend and backend; set env vars; optional custom domain (as in README).

---

## 5. Optional improvements (when you have time)

- **Order success:** Optional “Add to Calendar” or “Save order number” (e.g. copy to clipboard).
- **Storefront:** Filter/sort by price or tag (“Best Seller,” “Limited Stock”); simple search.
- **Admin:** Bulk actions on orders (e.g. mark several as “contacted”); export orders to CSV.
- **Analytics:** Track page views or “Order” button clicks (e.g. Plausible, Vercel Analytics) without touching payment flow.
- **README:** Update with project name (Reserve Coach), what the app does, how to run it, and required env vars (e.g. `VITE_ADMIN_PASSWORD` or `VITE_API_URL` when you have a backend).

---

## 6. Summary

- **Now:** Working storefront and admin UI with mock data and no persistence.
- **Phase 1:** Fix mistakes, add order-status link, stock and placeholder image, env-based password.
- **Phase 2:** Full in-memory demo: admin CRUD for products and orders, order status updates, and order-status page reading from the same source.
- **Phase 3:** Real backend, DB, and auth so data and admin sessions persist.
- **Phase 4:** Error handling, SEO, a11y, tests, and deploy.

If you tell me which phase you’re on (e.g. “we’re still before Phase 2”), I can turn that phase into a step-by-step task list or implement specific items from it.
