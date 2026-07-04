# INSKYLXSTR — E-Commerce (Laravel 13 + Inertia + React + MySQL)

Streetwear store: Laravel 13 backend, Inertia + React 19 frontend, MySQL,
admin panel, WhatsApp checkout, and OTP password reset.

- **Local development:** Docker Compose (below).
- **Production deploy (VPS):** see **[DEPLOYMENT.md](DEPLOYMENT.md)**.

## Stack
- **Laravel 13** (PHP 8.4) + **Inertia 2** (server-side routing, no separate REST API)
- **React 19 + TypeScript**, **Tailwind CSS 4**, `motion`, `lucide-react`, built with **Vite 8**
- **MySQL 8** + **Mailpit**, all in Docker Compose

## Run it

```bash
# 1. Build + start containers (app, mysql, mailpit)
docker compose up -d --build

# 2. Migrate + seed the database (6 products, admin user, settings, content)
docker exec inskylxstr-app php artisan migrate --seed --force

# 3. Link storage so uploaded images are publicly served
docker exec inskylxstr-app php artisan storage:link

# 4. Build the frontend assets (already built into public/build; rebuild if you edit TSX)
npm install
npm run build
```

Then open:
- **App:** http://localhost:8080
- **Mailpit:** http://localhost:8025
- **MySQL:** localhost:3307 (user `sail` / pass `password`, db `inskylxstr`)

### Frontend dev mode (hot reload)
`npm run dev` runs the Vite dev server. The app container serves Laravel; Vite serves assets.

## Seeded credentials

| Role     | Email                       | Password   |
|----------|-----------------------------|------------|
| Admin    | `admin@inskylxstr.test`     | `password` |
| Customer | `customer@inskylxstr.test`  | `password` |

> Change these before any real deployment.

## Features
- **Storefront:** home (hero + featured), catalog (server-side filter by category / availability /
  price range, search, sort, pagination), product detail + quick-view with size/color variants.
- **Cart:** client-side, persisted to `localStorage`, keyed per variant.
- **Checkout → WhatsApp:** requires login; validates stock/price against DB, snapshots an order,
  and opens a pre-filled `wa.me` message to the store's WhatsApp number.
- **Admin panel** (`/admin`, role-protected): dashboard stats, product CRUD (variants + multi-image
  upload), orders (status changes decrement stock on confirmation), customers, and site settings
  (hero / about / WhatsApp number / community & gallery images).

## Notes
- Prices are stored as **integer rupiah** and formatted `Rp 549.000` in the UI (`format_rupiah`).
- Stock lives only on **variants**; a product is sold out when all active variants are at 0.
- Order status stock rule: stock is **validated** at checkout, **decremented** when an admin moves
  the order to `processing`.
- Images support both **uploaded files** (public disk) and **external URLs** (seed data uses Unsplash).
- WhatsApp number is normalised to `62…` format; set it in **Admin → Settings**.
