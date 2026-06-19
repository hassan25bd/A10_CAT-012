# Fable – Ebook Sharing Platform

A full-stack ebook sharing platform connecting readers with talented writers. Built with the MERN stack + Next.js.

## Live URL
[https://fable-ebooks.vercel.app](https://fable-ebooks.vercel.app) *(update after deployment)*

## Admin Credentials
- **Email:** admin@fable.com
- **Password:** Admin@123

## Key Features

### Readers
- Browse, search, filter & sort ebooks by genre, price, availability
- Purchase ebooks via Stripe Checkout
- Bookmark ebooks for later
- View purchase history and access full content after purchase
- Profile management with avatar upload (imgBB)

### Writers
- Add, edit, publish/unpublish, and delete own ebooks
- Upload cover images via imgBB API
- View sales history and revenue analytics
- Bookmark ebooks from other writers

### Admin
- Manage all users (view, change roles, delete)
- Manage all ebooks (publish/unpublish/delete)
- View all transactions with full history
- Analytics dashboard with charts (monthly sales, genre distribution)

### Platform
- JWT Authentication (7-day expiry)
- Google OAuth via BetterAuth
- Stripe payment integration
- Framer Motion animations
- Skeleton loaders and error handling
- Responsive design (mobile/tablet/desktop)
- Role-based protected routes
- Custom 404 and error pages

## Tech Stack

### Frontend (Client)
| Package | Purpose |
|---------|---------|
| `next` 14 | React framework with App Router |
| `react`, `react-dom` | UI library |
| `tailwindcss` | Utility-first CSS framework |
| `framer-motion` | Animations and transitions |
| `@tanstack/react-query` | Data fetching and caching |
| `axios` | HTTP client |
| `recharts` | Charts for admin analytics |
| `react-hot-toast` | Toast notifications |
| `react-hook-form` | Form handling |
| `lucide-react` | Icon library |

### Backend (Server)
| Package | Purpose |
|---------|---------|
| `express` | Node.js web framework |
| `mongoose` | MongoDB ODM |
| `jsonwebtoken` | JWT authentication |
| `bcryptjs` | Password hashing |
| `stripe` | Payment processing |
| `cors` | Cross-Origin Resource Sharing |
| `dotenv` | Environment variable management |

## Getting Started

### Server Setup
```bash
cd server
npm install
# Copy .env.example to .env and fill in your values
npm run dev
```

### Client Setup
```bash
cd client
npm install
# Copy .env.local.example to .env.local and fill in your values
npm run dev
```

### Seed Database
```bash
cd server
node seed.js
```

## Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLIENT_URL=http://localhost:3000
```

### Client (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| POST | /api/auth/google | Google OAuth login |
| GET | /api/ebooks | Browse ebooks (public) |
| GET | /api/ebooks/featured | Featured ebooks |
| GET | /api/ebooks/:id | Ebook details |
| POST | /api/ebooks | Create ebook (writer) |
| PUT | /api/ebooks/:id | Update ebook |
| DELETE | /api/ebooks/:id | Delete ebook |
| PATCH | /api/ebooks/:id/publish | Toggle publish status |
| GET | /api/users/purchases | User purchase history |
| POST | /api/users/bookmark/:id | Toggle bookmark |
| GET | /api/users/writer/ebooks | Writer's ebooks |
| GET | /api/users/writer/sales | Writer's sales |
| GET | /api/users | All users (admin) |
| PATCH | /api/users/:id/role | Change user role (admin) |
| GET | /api/admin/stats | Analytics (admin) |
| GET | /api/admin/transactions | All transactions (admin) |
| POST | /api/stripe/checkout | Create Stripe session |
| GET | /api/stripe/verify/:id | Verify payment |

## Deployment

### Client → Vercel
1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Server → Railway / Render
1. Push to GitHub
2. Create new service
3. Set environment variables
4. Deploy and copy URL to `CLIENT_URL`

## Commit History
- At least 20 meaningful commits on client side
- At least 12 meaningful commits on server side
