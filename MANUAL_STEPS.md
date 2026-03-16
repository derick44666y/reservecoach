# What you need to do manually

These steps can’t be done in code alone. You need to set up services, accounts, and deploy yourself.

---

## 1. Backend and database

**Why:** Right now products and orders live only in the browser (localStorage). You need a server and database so data persists and is shared across devices.

**What to do:**
- Choose a backend: e.g. **Supabase** (DB + auth + storage), **Firebase**, or your own **Node/Express** (or Next.js API) + **PostgreSQL** / **MongoDB**.
- Create tables/collections for **products** and **orders** (and users if you add real auth).
- Expose APIs, e.g.:
  - `GET /api/products` — list products  
  - `GET /api/products/:slug` — one product  
  - `POST/PUT/DELETE` for admin product CRUD  
  - `POST /api/orders` — create order (from order form)  
  - `GET /api/orders` — list orders (admin)  
  - `GET /api/orders/:id` — one order (order status page)  
  - `PATCH /api/orders/:id` — update status (admin)
- In the frontend, replace the in-memory store (or add a layer) that calls these APIs instead of only using localStorage.

---

## 2. Admin authentication

**Why:** A single password in an env variable is not secure for production. You need proper login and sessions.

**What to do:**
- If you use **Supabase** or **Firebase**, use their auth (email/password or magic link) and protect admin routes so only logged-in users can access them.
- If you use your own backend, implement login (e.g. email + password), store sessions (e.g. JWT in httpOnly cookie or session ID), and check auth on every admin API request.
- Remove or stop relying on the single `VITE_ADMIN_PASSWORD` for production.

---

## 3. Image storage (for product uploads)

**Why:** Storing images as base64 in localStorage is limited and slow. You need cloud storage and store only URLs in the product.

**What to do:**
- Sign up for a storage service: **Supabase Storage**, **Cloudinary**, **AWS S3**, or similar.
- Implement upload from the admin: when the user selects images, upload them to the service (from the frontend with a signed URL, or via your backend), get back URLs, and save those URLs in the product (in your DB).
- In the app, product images stay as URLs; no base64 in the database.

---

## 4. Environment variables

**Why:** API URLs and secrets must not be in the code. They must be configured per environment.

**What to do:**
- **Frontend:** Create a `.env.production` (or set in your host’s dashboard) with e.g. `VITE_API_URL=https://your-api.com` and, if you keep it for now, `VITE_ADMIN_PASSWORD=…`. Use `import.meta.env.VITE_API_URL` in the app when calling the API.
- **Backend:** Set env vars on the server (e.g. `DATABASE_URL`, `JWT_SECRET`, storage keys). Never commit these to git.
- Add `.env` and `.env.local` to `.gitignore` (already done); use `.env.example` with placeholder values and document what each variable is for.

---

## 5. Deploy frontend and backend

**Why:** The app needs to run on a public URL with HTTPS.

**What to do:**
- **Frontend:** Build with `npm run build` and deploy the `dist` folder to **Vercel**, **Netlify**, **Cloudflare Pages**, or similar. Connect your repo for automatic deploys. Set production env vars in the host’s dashboard.
- **Backend:** Deploy your API to a host (Railway, Render, Fly.io, VPS, or use Supabase/Firebase if you chose them). Set the backend env vars there. Ensure the API is served over **HTTPS**.
- Point the frontend’s `VITE_API_URL` to your live backend URL.

---

## 6. Custom domain (optional)

**What to do:**
- In your hosting provider (Vercel, Netlify, etc.), add your domain and follow their DNS instructions.
- Update any links or meta tags that still point to a placeholder domain.

---

## 7. Privacy and terms pages (optional but recommended)

**Why:** The footer has “Privacy” and “Terms” links that currently go to `#privacy` and `#terms`. For a real store you should have real pages or documents.

**What to do:**
- Add a `/privacy` and `/terms` route (or a single “Legal” page with both), or host PDFs and link to them.
- Write short privacy and terms texts (or use a template/lawyer). Mention what data you collect (e.g. name, email, phone, address for orders) and how you use it.

---

## 8. Contact email

**Why:** The footer “Contact” link uses `mailto:hello@reservecoach.com`. That address must exist and be monitored.

**What to do:**
- Create that email (e.g. hello@reservecoach.com) with your domain, or change the link in the code to an email you actually use.

---

## Summary checklist

| Step                    | You need to                          |
|-------------------------|--------------------------------------|
| Backend + DB            | Create API and database; connect app |
| Admin auth              | Use Supabase/Firebase auth or own   |
| Image storage           | Use Supabase/Cloudinary/S3; save URLs|
| Env vars                | Set in hosting and backend           |
| Deploy                  | Deploy frontend + backend; HTTPS     |
| Domain (optional)       | Add domain in host; DNS              |
| Privacy / Terms         | Add pages or docs; update links      |
| Contact email           | Create or change mailto address      |

Once these are done, the app is in good shape for production. The codebase already has error handling, copy order number, filter/sort, live dashboard, and footer links; the rest depends on your backend and hosting setup.
