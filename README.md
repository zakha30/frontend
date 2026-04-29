# TransHub Frontend

React + Vite frontend for the TransHub SaaS Transport Marketplace.

## Tech Stack
- **React 18** + **TypeScript**
- **Vite 5** (dev server + build)
- **Tailwind CSS 3** (utility-first styling)
- **Zustand** (auth state)
- **Axios** (HTTP client with JWT interceptor)
- **Recharts** (dashboard + reports charts)
- **React Router v6** (client-side routing)
- **React Hot Toast** (notifications)

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env

# 3. Start dev server (proxies /api → http://localhost:5000)
npm run dev
```

Open http://localhost:3000

## Connecting to the Backend

The Vite dev server proxies all `/api` requests to `http://localhost:5000`.
Make sure your .NET 10 API is running on port 5000.

If deploying to production, set `VITE_API_URL` in your `.env` to the full API base URL:
```
VITE_API_URL=https://api.yourdomain.com/api
```

## Pages

| Route | Page | Backend Endpoint |
|-------|------|-----------------|
| `/login` | Login | `POST /api/auth/login` |
| `/register` | Register | `POST /api/auth/register` |
| `/dashboard` | Dashboard | `GET /api/dashboard/summary` |
| `/fleet` | Fleet Management | `GET/POST/PUT /api/vehicles` |
| `/drivers` | Drivers | UI stub (backend user module) |
| `/trips` | Trips & Listings | `GET/POST /api/listings` |
| `/bookings` | Bookings & Quotes | `GET /api/dashboard/received-quotes` |
| `/reports` | Reports & Analytics | Charts + `GET /api/dashboard/summary` |
| `/notifications` | Inbox | `GET /api/notifications` |

## Auth Flow

1. User logs in with `email + password + tenantSlug`
2. JWT `accessToken` stored in `localStorage`
3. Axios interceptor attaches `Authorization: Bearer <token>` to every request
4. On 401 response → tokens cleared → redirect to `/login`

## Folder Structure

```
src/
├── api/            # Axios service modules per domain
├── components/
│   ├── common/     # Shared UI (Spinner, Modal, Badge, Pagination…)
│   └── layout/     # Sidebar, Topbar, AppLayout, AuthLayout
├── pages/
│   ├── auth/       # Login, Register
│   ├── dashboard/  # Dashboard KPIs + charts
│   ├── fleet/      # Fleet vehicle CRUD
│   ├── drivers/    # Driver roster
│   ├── trips/      # Listings management
│   ├── bookings/   # Quote accept / reject / withdraw
│   ├── reports/    # Analytics charts
│   └── notifications/
├── store/          # Zustand auth store
├── types/          # TypeScript interfaces matching backend DTOs
└── utils/          # formatDate, formatCurrency, statusColor…
```

## Build for Production

```bash
npm run build
# Output in ./dist — deploy to any static host (Nginx, Vercel, Netlify, Azure Static Web Apps)
```
