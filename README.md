# 🎬 AniStream — Free Anime Streaming Platform

> **Created by Aqsobb** — Full-featured anime streaming website with Firebase integration, comment system, admin panel, and demo mode.

## ✨ Features

### 🌐 Streaming
- **Browse Anime** — Homepage with sections (Latest, Trending, Ongoing)
- **Search** — Full-text search across all anime
- **Genre Browsing** — Filter by genre
- **Anime Details** — Synopsis, metadata, episodes list
- **Video Player** — ReactPlayer with external link fallback
- **Episode Navigation** — Back to anime page

### 💬 Comment System (like Wibuku)
- **3 Levels**: Latest (newest), Top (most liked), Global (all)
- **User Comments** — Login to post comments
- **Like & Delete** — Like comments, delete your own
- **Admin Moderation** — Admins can delete any comment

### 👑 Admin Panel
- **Dashboard** — Overview stats (users, codes, ads)
- **User Management** — List users, change roles, delete users
- **Redeem Codes** — Generate codes for admin/VIP roles
- **Ads Management** — Add/edit/delete/toggle ad placements
- **Website Settings** — Site name, description, colors, registration toggle

### 🔐 Auth System
- **Email/Password** — Login & Register with Firebase Auth
- **Role System** — `user`, `vip`, `moderator`, `admin`
- **Redeem Codes** — One-time use codes to upgrade roles
- **Protected Routes** — Admin panel guarded by auth

### 📢 Ad System
- **Placements**: Top, Bottom, Side, In-content
- **Types**: Banner, Sidebar, Native
- **Admin Control**: Toggle on/off, add/edit/delete

### 🔧 Demo Mode
- **Zero Config** — Works without Firebase (in-memory data)
- **Demo Accounts**: `admin@anistream.demo` / `user@anistream.demo` (any password)
- **Demo Banner** — Shows when Firebase is not configured

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Aqsobb/anistream.git
cd anistream
npm install
```

### 2. Run in Demo Mode (No Firebase needed)

```bash
npm run dev
```

The app runs at `http://localhost:5173` with demo data.

### 3. Configure Firebase (Optional)

Copy `.env.example` to `.env` and fill in your Firebase config:

```bash
cp .env.example .env
```

Get Firebase config from: **Firebase Console** → Project Settings → General → Your apps → Web app

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4. Setup Firestore (Required for Firebase mode)

Create these collections in Firebase Console → Firestore Database:

```
users/
  ├── {uid}/
  │   ├── uid: string
  │   ├── email: string
  │   ├── displayName: string
  │   ├── role: "user" | "admin" | "vip" | "moderator"
  │   ├── photoURL: string
  │   ├── createdAt: number
  │   └── redeemCodesUsed: string[]

comments/
  ├── {docId}/
  │   ├── animeSlug: string
  │   ├── episodeSlug: string
  │   ├── userId: string
  │   ├── userName: string
  │   ├── userPhoto: string
  │   ├── text: string
  │   ├── level: "top" | "global" | "local"
  │   ├── likes: number
  │   ├── createdAt: number
  │   └── parentId: string | null

redeemCodes/
  ├── {docId}/
  │   ├── code: string
  │   ├── role: string
  │   ├── maxUses: number
  │   ├── usedBy: string[]
  │   ├── createdBy: string
  │   └── createdAt: number

ads/
  ├── {docId}/
  │   ├── title: string
  │   ├── type: "banner" | "sidebar" | "native"
  │   ├── position: "top" | "bottom" | "side-left" | "side-right" | "in-content"
  │   ├── imageUrl: string
  │   ├── linkUrl: string
  │   ├── active: boolean
  │   └── createdAt: number

settings/
  ├── main/
  │   ├── siteName: string
  │   ├── description: string
  │   ├── logoUrl: string
  │   ├── primaryColor: string
  │   ├── allowRegistration: boolean
  │   └── defaultRole: string
```

### 5. Create Admin User

After Firebase setup, create your admin account:

1. Register a user through the app's login page
2. In Firebase Console → Firestore → `users` collection
3. Find your user document and change `role` field to `"admin"`
4. Refresh the app — you'll now have Admin Panel access

---

## 🌐 Deploy to Vercel

### Automatic (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Click the button above
2. Import your GitHub repo
3. Add environment variables (optional):
   - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID`, etc.
4. Deploy!

### Manual

```bash
npm run build
vercel --prod
```

Or connect GitHub repo to Vercel:
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variables → Deploy

### Without Firebase (Demo mode on Vercel)

If you deploy without Firebase env vars, the app runs in **Demo Mode** — all features work but data is in-memory (resets on each deploy).

---

## 📁 Project Structure

```
src/
├── api/           # Anime API client (anichin-api)
├── types/         # TypeScript type definitions
├── lib/
│   ├── firebase.ts    # Firebase + Demo data layer
│   └── config.ts      # Config & demo detection
├── contexts/
│   └── AuthContext.tsx # Auth state management
├── components/
│   ├── Navbar.tsx      # Navigation with auth
│   ├── AnimeCard.tsx   # Anime card component
│   ├── EpisodeCard.tsx # Episode list item
│   ├── VideoPlayer.tsx # ReactPlayer wrapper
│   ├── HeroSection.tsx # Homepage hero
│   ├── AdBanner.tsx    # Ad placement component
│   ├── Footer.tsx      # Site footer
│   └── comments/
│       └── CommentSection.tsx # Wibuku-like comments
├── pages/
│   ├── HomePage.tsx         # Landing page
│   ├── AnimeDetailPage.tsx  # Anime info + episodes + comments
│   ├── EpisodePage.tsx      # Video player + comments
│   ├── SearchPage.tsx       # Search results
│   ├── GenreBrowsePage.tsx  # Genres list & genre filtering
│   └── LoginPage.tsx        # Auth + redeem code
├── admin/
│   ├── AdminLayout.tsx      # Admin sidebar layout
│   ├── AdminDashboard.tsx   # Stats overview
│   ├── AdminUsers.tsx       # User CRUD
│   ├── AdminRedeemCodes.tsx # Code generation
│   ├── AdminAds.tsx         # Ad management
│   └── AdminSettings.tsx    # Site settings
└── App.tsx         # Root with all routes
```

---

## 🔧 Redeem Code System

**How it works:**
1. Admin generates codes in Admin Panel → Redeem Codes
2. Each code has a role (admin/vip/moderator) and max uses
3. Users enter the code on the Login page
4. Code is one-time use per account (tracks usedBy)
5. On redemption, user's role is upgraded instantly

**Demo codes (in demo mode):**
- `ADMIN2024` — Grants admin role
- `VIP2024` — Grants VIP role

---

## 📢 Ad System

**Placement positions:**
| Position | Location |
|----------|----------|
| `top` | Top banner |
| `bottom` | Bottom banner |
| `side-left` | Left sidebar |
| `side-right` | Right sidebar |
| `in-content` | Between content sections |

**Managing ads:**
- Go to Admin Panel → Ads
- Click "Add Ad" to create new ad
- Fill title, type, position, image URL, link URL
- Toggle active/inactive with the eye button
- Delete ads with the trash button

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript 6, Vite 8
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Routing**: React Router v7
- **Video**: ReactPlayer v3
- **Backend**: Firebase (Auth + Firestore)
- **API**: anichin-api (scrapes anichin.club)
- **Deploy**: Vercel

---

## 📝 License

This project is for **educational purposes only**. All anime content belongs to their respective owners.

---

## 🙏 Credits

- **Aqsobb** — Project creator & developer
- **asmindev** — Anichin API (https://github.com/asmindev/anichin-api)
- Lucide React — Beautiful icons
- Tailwind CSS — Utility-first CSS
