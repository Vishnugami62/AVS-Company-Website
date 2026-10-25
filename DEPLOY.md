# Deploying AVS Company to a live link (Vercel + Neon Postgres)

This gets your site onto a public URL you can share. Everything here is free.
You'll do the browser steps (they use your accounts); the code is already ready.

Your local setup keeps using SQLite — this only affects the live site, which uses
a cloud Postgres database (a web host can't use the local SQLite file).

---

## Step 1 — Create a free database (Neon, ~2 min)

1. Go to **https://neon.tech** and sign up (use "Continue with GitHub").
2. Create a project (any name, e.g. `avs`). Pick a region near Mumbai (e.g. Singapore).
3. On the project dashboard, copy the **connection string** (looks like
   `postgresql://user:pass@ep-xxxx.region.aws.neon.tech/dbname?sslmode=require`).
   Keep it handy for Step 2.

## Step 2 — Deploy on Vercel (~5 min)

1. Go to **https://vercel.com** and sign up with **GitHub**.
2. Click **Add New… → Project**, find **AVS-Company-Website**, click **Import**.
3. Before deploying, open **Environment Variables** and add these (Name → Value):

   | Name | Value |
   |---|---|
   | `DATABASE_URL` | the Neon connection string from Step 1 |
   | `SESSION_SECRET` | a long random string (40+ characters) |
   | `ADMIN_EMAIL` | the email you'll sign in to the admin with |
   | `ADMIN_PASSWORD` | a strong password for the admin |
   | `SETUP_KEY` | any random string (used once in Step 3) |
   | `EMAIL_TRANSPORT` | `log` |
   | `EMAIL_FROM` | `AVS Company <orders@yourdomain.com>` |
   | `TEAM_ALERT_EMAIL` | your email |
   | `NEXT_PUBLIC_SITE_URL` | leave blank for now (set in Step 4) |

4. Click **Deploy**. Wait for it to finish — you'll get a URL like
   `https://avs-company-website.vercel.app`.

## Step 3 — Create your admin + catalogue (once)

Open this URL once in your browser (replace both parts):

```
https://YOUR-APP.vercel.app/api/setup?key=YOUR_SETUP_KEY
```

You should see `"Setup complete."` It creates your admin login and loads the six
categories and sample products into the live database.

## Step 4 — Point the site at its own URL

1. In Vercel → your project → **Settings → Environment Variables**, set
   `NEXT_PUBLIC_SITE_URL` to your live URL (e.g. `https://avs-company-website.vercel.app`).
2. **Deployments → … → Redeploy** so emails and links use the right address.

## You're live 🎉

- **Website:** `https://YOUR-APP.vercel.app`
- **Admin:** `https://YOUR-APP.vercel.app/admin` — sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
- Share the website link with friends. Add products, prices and orders from the admin —
  they appear on the live site immediately.

---

### Later: your own domain + real emails

- **Domain:** Vercel → Settings → Domains → add the domain you buy. Then update
  `NEXT_PUBLIC_SITE_URL` to it and redeploy.
- **Real emails:** set `EMAIL_TRANSPORT=smtp` and the `SMTP_*` variables (any provider),
  then redeploy. Until then, emails are logged, not sent.

### Notes
- Pushing new code to GitHub `main` auto-deploys to Vercel.
- The live admin password lives only in Vercel's env vars, never in the code.
- If the build fails on the database step, use Neon's **direct** (non-pooled)
  connection string for `DATABASE_URL`.
