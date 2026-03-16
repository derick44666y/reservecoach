# Backend setup: Neon + Render + Cloudinary + Admin auth

Step-by-step for adding a real backend with **Neon** (database), **Render** (API hosting), **Cloudinary** (images), and **JWT admin auth**.

---

## 1. Neon (database)

1. Go to [neon.tech](https://neon.tech) and sign up / log in.
2. Create a **new project** (e.g. `reserve-coach`). Pick a region near your users.
3. In the dashboard, open **Connection details** and copy your **connection string**. It looks like:
   ```txt
   postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
4. For serverless (Render), use the **pooled** connection string if shown (often same URL with `-pooler` in the host). Save it as `DATABASE_URL` for the backend.

**Create tables:** In Neon’s SQL Editor (or any Postgres client), run the script from `backend/schema.sql` (see below). That creates `admins`, `products`, and `orders`.

---

## 2. Render (backend hosting)

1. Go to [render.com](https://render.com) and sign up / log in.
2. **New → Web Service**.
3. Connect your repo (e.g. GitHub). Choose the repo that contains `reserve-luxe-main`.
4. Settings:
   - **Root directory:** `backend` (so Render runs the backend folder).
   - **Build command:** `npm install`
   - **Start command:** `node server.js` or `npm start`
   - **Environment:** Add env vars (see “Env vars” section below).
5. Deploy. Note the service URL, e.g. `https://reserve-coach-api.onrender.com`. This is your **API URL** for the frontend.

---

## 3. Cloudinary (image storage)

1. Go to [cloudinary.com](https://cloudinary.com) and create an account / log in.
2. In the **Dashboard**, note:
   - **Cloud name**
   - **API Key**
   - **API Secret** (keep secret; use only on backend)
3. **Upload preset (for backend uploads):**
   - Settings → Upload → **Upload presets**.
   - Add preset, name e.g. `reserve_product_images`. Signing mode can be **Signed** (backend will use API secret). Save.
4. Add these to your **backend** env on Render:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

**Backend upload:** The API has `POST /api/upload` (admin only). Send `{ "image": "data:image/jpeg;base64,..." }` and you get back `{ "url": "https://res.cloudinary.com/..." }`. Use that URL in product images. Alternatively you can upload from the frontend with Cloudinary’s unsigned preset and only store the returned URL in the backend.

---

## 4. Admin auth (JWT)

The backend uses **email + password** for admins:

1. **First admin:** Run a one-time script or use the Neon SQL Editor to insert an admin (password hashed with bcrypt). Example (replace email and hash):
   ```sql
   INSERT INTO admins (id, email, password_hash, created_at)
   VALUES (gen_random_uuid(), 'admin@yourdomain.com', '$2a$10$...', NOW());
   ```
   To generate the hash locally: `node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('YourSecurePassword', 10));"` (run from `backend` after `npm install`).
2. **Login:** Frontend calls `POST /api/auth/login` with `{ "email": "...", "password": "..." }`. Backend returns a **JWT**.
3. **Protected routes:** Frontend sends `Authorization: Bearer <token>` on admin requests (products CRUD, orders list/patch). Backend middleware verifies the JWT.

You’ll set **JWT_SECRET** in the backend env (long random string). Never commit it.

---

## 5. Env vars to set

### Backend (Render)

| Variable | Where to get it | Example |
|----------|------------------|---------|
| `DATABASE_URL` | Neon → Connection string (pooled) | `postgresql://...?sslmode=require` |
| `JWT_SECRET` | Generate a long random string | e.g. `openssl rand -base64 32` |
| `PORT` | Render sets this; your code can use `process.env.PORT \|\| 3000` | `10000` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary dashboard | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary dashboard | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary dashboard | `your_api_secret` |
| `NODE_ENV` | Set to `production` on Render | `production` |

### Frontend (Vite, local and production host)

| Variable | Meaning | Example |
|----------|---------|---------|
| `VITE_API_URL` | Backend API base URL | `https://reserve-coach-api.onrender.com` |
| `VITE_ADMIN_PASSWORD` | (Optional) Only if you keep fallback; remove once JWT auth is used | — |

Set these in:
- **Local:** `.env` and `.env.local` (never commit `.env`).
- **Production (Vercel/Netlify/etc.):** Project settings → Environment variables. Use the same names so `import.meta.env.VITE_API_URL` works after build.

---

## 6. Summary checklist

- [ ] Neon: project created, connection string copied, `schema.sql` run.
- [ ] Render: Web Service created, root `backend`, build/start set, env vars added, deployed.
- [ ] Cloudinary: account created, cloud name + API key + secret in backend env.
- [ ] Auth: JWT_SECRET set, first admin inserted with hashed password.
- [ ] Frontend: `VITE_API_URL` set to your Render API URL (and optional `VITE_ADMIN_PASSWORD` until you switch to JWT).

After that, point the frontend at the API (see “Connecting the frontend” in the repo) so it uses the backend instead of localStorage.
