# One-time: create admin user for Reserve Coach

You need **one** admin user in the database to sign in at `/vault/login`.

## Option A – Using Render’s DATABASE_URL (recommended)

1. **Get your DB URL**  
   Render → your backend service → **Environment** → copy `DATABASE_URL`.

2. **From the project root**, run **one** of these in a terminal.

   **Windows (PowerShell):**
   ```powershell
   cd backend
   $env:DATABASE_URL = "paste-your-DATABASE_URL-here"
   node scripts/seed-admin.js your@email.com YourSecurePassword
   ```

   **Windows (Cmd):**
   ```cmd
   cd backend
   set DATABASE_URL=paste-your-DATABASE_URL-here
   node scripts/seed-admin.js your@email.com YourSecurePassword
   ```

   **Mac/Linux:**
   ```bash
   cd backend
   DATABASE_URL="paste-your-DATABASE_URL-here" node scripts/seed-admin.js your@email.com YourSecurePassword
   ```

3. Replace `your@email.com` and `YourSecurePassword` with the email and password you want to use for admin login.

4. You should see: `Admin created (or already exists): your@email.com`

5. Log in at **https://reservecoach.vercel.app/vault/login** with that email and password.

---

## Option B – Using a local `.env`

1. In the `backend` folder, copy `.env.example` to `.env`.
2. Set `DATABASE_URL` to the same Neon URL you use on Render (and optionally `ADMIN_EMAIL` / `ADMIN_PASSWORD`).
3. From the `backend` folder run:
   ```bash
   npm run seed:admin
   ```
   Or with explicit email/password:
   ```bash
   node scripts/seed-admin.js your@email.com YourSecurePassword
   ```

---

After the first admin exists, you can add more by running the same command with a different email/password.
