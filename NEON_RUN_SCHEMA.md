# Run the database schema in Neon

1. Open **[Neon Console](https://console.neon.tech)** and sign in.
2. Select your project (the one where you got the connection string).
3. In the left sidebar, click **SQL Editor**.
4. Click **New query**.
5. Open the file **`backend/schema.sql`** in your project, copy **all** its contents, and paste into the Neon SQL Editor.
6. Click **Run** (or press Ctrl+Enter).
7. You should see success messages. Tables **admins**, **products**, **orders** and the **order_id_seq** sequence are now created.

Keep your **connection string** only in **`backend/.env`** (and in Render env vars). Never commit it to Git.
