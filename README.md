# AVS Company — Website + Order Tracking & Admin

A complete website for AVS Company (corporate supplies, Mumbai) with a public marketing
site, an online quote system, customer-facing order tracking, and a secure staff admin
panel where you manage products **and** order status — both reflect live on the website.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS + Prisma**. Runs locally on
SQLite with zero setup, and is ready to deploy (switch to Postgres) when you buy a domain.

---

## 1. Running it on this computer

Node.js is already installed. From the project folder (`D:\Website CRM`):

```bash
npm run dev
```

Then open **http://localhost:3000**.

If you ever set it up fresh (new machine):

```bash
npm install
npm run db:push     # creates the local database from the schema
npm run db:seed     # loads the 6 categories, sample products and demo orders
npm run dev
```

---

## 2. Staff admin panel

Open **http://localhost:3000/admin**

- **Email:** `admin@avscompany.in`
- **Password:** `AvsAdmin@2026`  ← change this after first login (see Settings / below)

From the admin you can:

| Section | What you do |
|---|---|
| **Dashboard** | See open orders, what's being packed, out for delivery, and requests waiting |
| **Orders** | Search any order, open it, and **update its status** — the public Track page updates instantly, and the customer can be emailed automatically |
| **New offline order** | Log a phone / WhatsApp / email order — it creates an AVS number and emails the customer a tracking link |
| **Delivery requests** | Approve, suggest a new slot, or decline customer requests (each emails the customer) |
| **Products** | **Add / edit / delete products** and all their details — they appear live in the catalogue |
| **Categories** | Manage the six supply categories |
| **Customers** | See every company that has ordered |
| **Settings** | Replace all placeholder details (phone, email, address, GSTIN, etc.) — updates the whole site |

---

## 3. What to replace before launch (placeholders)

Everything in the design is real except these, which are yours to fill in:

- **Settings page** (admin): phone, WhatsApp, emails, address, GSTIN, working hours, min order / free-delivery values.
- **Founders** (`src/app/(public)/about/page.tsx`): add photos + bios for Vishnu Gami & Aryan Thakkar.
- **Product prices**: products are "price on request" by default. Add real prices per product.
- **Product & brand photos**: tasteful placeholders are in place; swap in real images.
- **Logo**: the "AVS" mark is a placeholder; drop in your real logo.

---

## 4. Security (built in)

- Staff admin is behind password login (bcrypt-hashed) with signed, http-only session cookies; `/admin` is gated by middleware **and** server-side checks.
- Customer tracking is **read-only** by order/PO number and shows only status + dates — never names, items or prices.
- Delivery-change requests require a **6-digit code emailed to the order's registered address** before they're accepted.
- Protections included: security headers + Content-Security-Policy, input validation on every form (Zod), rate limiting, same-origin checks on actions, and no secrets in the code.
- **Before going live:** set a long random `SESSION_SECRET` in `.env`, and change the admin password.

---

## 5. Going live later (when you buy a domain)

1. **Database:** change `provider` in `prisma/schema.prisma` from `sqlite` to `postgresql`, and set `DATABASE_URL` to a managed Postgres (e.g. Neon, Supabase, Railway).
2. **Environment:** copy `.env.example` → set a strong `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL` (your domain), and email settings.
3. **Email:** set `EMAIL_TRANSPORT=smtp` and fill `SMTP_*` (any provider). Until then, emails are logged, not sent.
4. **Deploy:** push to GitHub and deploy on **Vercel** (recommended for Next.js) — or any Node host. Run `npm run build` then `npm start`.
5. Run `npx prisma migrate deploy` (or `db push`) against the production database, then create your real admin user.

---

## 6. Handy commands

```bash
npm run dev         # start the local site
npm run build       # production build
npm run db:studio   # visual database browser (Prisma Studio)
npm run db:seed     # reload sample data (clears existing demo data)
```

> Note: stop the dev server before running `npm run build` on Windows (the running server
> locks Prisma's engine file).
