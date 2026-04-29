# React Frontend Setup Guide

## Prerequisites
- Node.js 18+ and npm/yarn
- The backend API running on `http://localhost:5000`

## Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
Create a `.env.local` file (optional - defaults to localhost):
```env
VITE_API_URL=http://localhost:5000
```

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` and login with your credentials.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## Project Structure

```
frontend/
├── src/
│   ├── api/                    # API client layer
│   │   ├── client.ts           # Axios instance with interceptors
│   │   ├── auth.ts             # Authentication endpoints
│   │   ├── dashboard.ts        # Dashboard data endpoints
│   │   ├── listings.ts         # Listings CRUD operations
│   │   ├── quotes.ts           # Quotes management
│   │   └── vehicles.ts         # Fleet management
│   │
│   ├── components/             # Reusable React components
│   │   ├── common/             # Shared UI components (Modal, Spinner, etc.)
│   │   └── layout/             # Layout wrappers (AppLayout, AuthLayout, Sidebar)
│   │
│   ├── pages/                  # Page components (one per route)
│   │   ├── auth/               # Login, Register
│   │   ├── dashboard/          # Dashboard with metrics
│   │   ├── fleet/              # Vehicle management
│   │   ├── drivers/            # Driver management
│   │   ├── trips/              # Trip tracking
│   │   ├── bookings/           # Booking management
│   │   ├── reports/            # Analytics & reports
│   │   └── notifications/      # Inbox/notifications
│   │
│   ├── store/                  # Zustand state management
│   │   └── authStore.ts        # User auth state (HttpOnly cookie-safe)
│   │
│   ├── types/                  # TypeScript interfaces
│   │   └── index.ts            # All DTOs matching backend
│   │
│   ├── utils/                  # Utility functions
│   │   └── index.ts            # Formatters, helpers, etc.
│   │
│   ├── App.tsx                 # Main router & route guards
│   ├── main.tsx                # React DOM entry
│   └── index.css               # Global Tailwind styles
│
├── public/                     # Static assets
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind theme
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

---

## Key Features

### 🔐 Authentication
- **HttpOnly Cookie-based**: JWT tokens stored securely, not in localStorage
- **Automatic Refresh**: Failed requests trigger token refresh automatically
- **Silent Hydration**: On page load, user state syncs from localStorage + validates cookie

### 🎨 UI/UX
- Built with **React 18** + **Vite** for fast development
- Styled with **Tailwind CSS** (no CSS files needed)
- Icons from **Lucide React** (lightweight, tree-shakeable)
- Toast notifications with **React Hot Toast**
- Responsive design (mobile-first)

### 📊 State Management
- **Zustand** for lightweight auth state
- No complex Redux/Context for simple needs
- Easy to extend for global UI state (modals, sidebar, etc.)

### 🚀 API Integration
- Centralized **Axios** client with interceptors
- Automatic JWT refresh on 401
- Typed responses using TypeScript DTOs
- Retry logic for network failures (can be added)

---

## Authentication Flow

### Login
1. User enters email, password, tenant slug
2. POST `/api/auth/login` 
3. Backend sets HttpOnly cookies (access + refresh tokens)
4. Frontend stores user profile in localStorage
5. Next page load: hydrate from localStorage + validate cookie

### Logout
1. Click "Sign out"
2. POST `/api/auth/logout` → clears cookies server-side
3. Frontend clears localStorage
4. Redirect to `/login`

### Token Refresh (Automatic)
1. API request fails with 401
2. Request interceptor catches it
3. POST `/api/auth/refresh` using refresh token cookie
4. Get new access token
5. Retry original request
6. If refresh also fails → logout, redirect to login

---

## Common Tasks

### Add a New API Endpoint

1. **Create in backend** (e.g., `/api/trips/create`)
2. **Add DTO** to `frontend/src/types/index.ts`
3. **Create API module** `frontend/src/api/trips.ts`:

```typescript
import { apiClient } from './client';
import type { TripDto } from '../types';

export const tripsApi = {
  create: async (dto: CreateTripDto) => {
    const { data } = await apiClient.post<TripDto>('/api/trips', dto);
    return data;
  },
  // ... more methods
};
```

4. **Use in component**:

```typescript
import { tripsApi } from '../../api/trips';
import { useState } from 'react';

export default function CreateTrip() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (form) => {
    setLoading(true);
    try {
      const trip = await tripsApi.create(form);
      // ... success
    } finally {
      setLoading(false);
    }
  };
}
```

### Add a New Page

1. **Create page component**: `frontend/src/pages/myfeature/MyFeature.tsx`
2. **Add route** in `frontend/src/App.tsx`:

```typescript
import MyFeature from './pages/myfeature/MyFeature';

// Inside AppLayout routes:
<Route path="/myfeature" element={<MyFeature />} />
```

3. **Add navigation** in `frontend/src/components/layout/Sidebar.tsx`:

```typescript
const NAV = [
  // ... existing items
  { to: '/myfeature', label: 'My Feature', icon: IconComponent },
];
```

### Add Loading States

Use the `Spinner` component:

```typescript
import { Spinner, FullPageSpinner } from '../../components/common';

// Full page spinner
if (loading) return <FullPageSpinner />;

// Inline spinner in button
<button disabled={loading}>
  {loading && <Spinner size="sm" />}
  Save
</button>
```

---

## Environment Variables

Create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:5000              # Backend API URL
VITE_APP_NAME=TransHub                          # App name in title
```

---

## Troubleshooting

### CORS Errors
- Ensure backend has correct `AllowedOrigins` in `appsettings.Development.json`
- Should include `http://localhost:3000`

### Cookies Not Being Sent
- Check `withCredentials: true` in `frontend/src/api/client.ts`
- Verify backend sets `AllowCredentials()` in CORS policy

### 401 Errors on Login
- Check network tab for cookies being set
- Verify backend JWT settings in `appsettings.json`

### Build Errors
- Run `npm install` to ensure all deps are installed
- Clear `node_modules` and reinstall: `rm -r node_modules && npm install`

---

## Performance Tips

1. **Code Splitting**: Routes are automatically code-split by Vite
2. **Image Optimization**: Use WebP with fallbacks
3. **API Caching**: Consider adding SWR or React Query for better caching
4. **Bundle Size**: Check with `npm run build` — should be < 150KB gzipped

---

## Deployment

### Vercel (Recommended)
```bash
vercel link
vercel env add VITE_API_URL https://api.yourdomain.com
vercel deploy
```

### GitHub Pages
```bash
npm run build
# Push `dist/` folder to GitHub Pages
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## Need Help?

- Check console for errors: `F12` → Console tab
- Network tab: `F12` → Network tab, look at API requests/cookies
- Ask in team Slack or create an issue on GitHub

