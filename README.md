# Maragatha Mart

The online store and back office for **Maragatha Mart**, Kayathar, Tamil Nadu — home of
**Maragatha Silks**. *Tradition Woven in Elegance.*

Customers browse silk sarees (Kanchipuram, soft silk, wedding silks), textiles and everyday
essentials — home, kitchen, gifting and festive items — and order signed in or as a guest.
Staff run orders, stock, purchasing, expenses and reporting from the same app, behind roles.

Live site: <https://maragathamart.com>

## Stack

React 18 + TypeScript + Vite, Tailwind CSS, react-router-dom, zustand, and Supabase (Postgres,
auth, storage, RPC, edge functions). Firebase is used for push notifications only.

`CLAUDE.md` is the map of the codebase: layout, domain rules and conventions.

## Main routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/shop` | Full catalogue |
| `/silks` | Maragatha Silks collection |
| `/quick-order` | Whole catalogue in one table, for fast ordering |
| `/track-order` | Order tracking by order number + phone |
| `/blog` | Silk saree guides |

## Local setup

Requires Node.js 18+.

```sh
npm install
npm run dev        # http://localhost:5173
```

Create a `.env` in the project root (it is git-ignored):

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_FIREBASE_VAPID_KEY=

VITE_GOOGLE_ANALYTICS_ID=
VITE_PUBLIC_SITE_URL=http://localhost:5173
```

Business details printed on invoices and shown on the site (address, phone, email, GSTIN) are
not in the code: set them in **Admin Settings**.

## Scripts

```sh
npm run dev      # development server
npm run build    # production build (also pre-renders /blog pages and updates the sitemap)
npm run preview  # preview the production build
npm run lint     # ESLint
```

## Folders

- `src/` — application source
- `public/` — static assets, `robots.txt`, `sitemap.xml`, web manifest
- `scripts/` — build-time helpers (blog pre-rendering)
- `supabase/` — database migrations and edge functions

## License

Private and proprietary to Maragatha Mart.
