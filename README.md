# OLATO — Modern Local Discount Discovery Platform (MVP)

> **"Discover what's worth it around you."**

Olato is a polished 2026 consumer-tech local discount discovery platform built with Next.js (App Router), TypeScript, and Tailwind CSS. It empowers users to discover verified local discounts from nearby **Cafés**, **Restaurants**, and **Selected/Featured Places**.

---

## 🎨 Visual Identity & Brand System

- **Primary Brand Color**: `#5B5CE2` (Modern Violet-Indigo)
- **Secondary Savings & Verification Color**: `#19B87A` (Emerald Green)
- **Background**: `#F7F7FA` | **Surface**: `#FFFFFF` | **Text**: `#15151A` & `#6F7078`
- **Logo Concept (`[OlatoLogo]`)**: Custom search-inspired circular O symbol with a lower-right handle at the 4–5 o'clock position, accompanied by the full, correctly spelled **Olato** wordmark.
- **Typography**: Inter across all headings, badges, and interface elements.

---

## 🚀 Key Features

### Consumer Discovery Suite
1. **Home / Discover (`/`)**:
   - Location indicator pill ("Showing deals near Gulberg III, Lahore").
   - Hero search bar with AI natural language trigger.
   - Category selector strictly scoped to `Cafés`, `Restaurants`, and `Featured Places`.
   - Real-time Haversine distance calculations relative to active user location/hubs.
   - Curated "Featured Places" showcase.
2. **Search / Explore Results (`/search`)**:
   - Query search bar, multi-faceted filter bar (Distance, Discount %, Open Now, Valid Today, Verified Only, Student Deals).
   - Dual view switcher: **Split View** (List + Interactive Leaflet Map panel) and **Grid View**.
3. **Discount Details (`/discounts/[id]`)**:
   - Merchant hero banner and gallery.
   - Prominent percentage badge (e.g. `25% OFF`, `BOGO`).
   - Trust Verification badge (`✓ Verified X days ago` + 98% Confidence score).
   - Step-by-step redemption guide & terms accordion.
   - Interactive **Get Directions** button (Google Maps integration via latitude/longitude).
4. **Interactive Map View (`/map`)**:
   - Dedicated discovery map canvas with custom interactive markers for Cafés, Restaurants, and Featured Places.
   - Nearby list sidebar and live card preview drawer.
5. **Saved Deals (`/saved`)**:
   - Save/unsave discounts with smooth heart micro-animations.
   - Persistent saved deals state stored in `localStorage`.
   - Elegant empty state renderer.
6. **Authentication (`/auth/signin` & `/auth/signup`)**:
   - Member sign-in and sign-up with instant demo access toggles (User vs Admin Portal).
7. **User Profile (`/profile`)**:
   - Default city neighborhood hub selector (Gulberg III, DHA Phase 5, MM Alam Road, Johar Town, Mall Road).
   - Student discount eligibility focus toggle.
8. **AI Natural Language Discovery**:
   - Natural language interpreter ("Find me a quiet café with a good coffee discount near Gulberg valid today").
   - Parses input into structured categories and filters with fallback heuristic parser.

### Merchant & Admin Management (`/admin/*`)
1. **Overview Dashboard (`/admin`)**: Operational metrics (Active Discounts, Expiring Soon, Pending Verification, Total Places, Verification Rate).
2. **Places Management (`/admin/places`)**: CRUD table, add/edit modal, category assignment (`CAFE`, `RESTAURANT`, `FEATURED_PLACE`), status toggle, opening hours, coordinates.
3. **Discounts Management (`/admin/discounts`)**: CRUD table, bank/card assignment, student eligibility toggle, start/end dates, verification confidence slider.
4. **Verification Queue (`/admin/verification`)**: Workflow interface to audit pending deals and update `lastVerifiedDate` with one click.
5. **Featured Places Curator (`/admin/featured`)**: Curate top places on consumer homepage.
6. **Settings & Seed Maintenance (`/admin/settings`)**: Reset local data back to default Lahore prototype seed dataset.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 + Custom Tokens
- **Icons**: Lucide React
- **Maps**: Leaflet & React Leaflet (Custom Voyager carto tiles)
- **State & Storage**: React Context + `RepositoryService` abstraction with `localStorage` persistence

---

## 💻 Local Setup & Development

1. **Clone or Navigate to Directory**:
   ```bash
   cd scratch/olato
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build & Type Check**:
   ```bash
   npm run build
   ```

---

## 📁 Directory Architecture

```
src/
├── app/
│   ├── layout.tsx              # Root layout & providers
│   ├── page.tsx                # Page 1: Home / Discover
│   ├── search/page.tsx         # Page 2: Search & Explore (Split Map View)
│   ├── discounts/[id]/page.tsx # Page 3: Discount Details & Directions
│   ├── map/page.tsx            # Page 4: Interactive Discovery Map View
│   ├── saved/page.tsx          # Page 5: Saved Deals
│   ├── auth/
│   │   ├── signin/page.tsx     # Page 6a: Sign In
│   │   └── signup/page.tsx     # Page 6b: Sign Up
│   ├── profile/page.tsx        # Page 7: User Profile & Preferences
│   └── admin/                  # Admin Dashboard Area
│       ├── page.tsx            # Admin Overview
│       ├── places/page.tsx     # Places CRUD
│       ├── discounts/page.tsx  # Discounts CRUD
│       ├── verification/page.tsx # Verification Queue
│       ├── featured/page.tsx   # Featured Showcase Curator
│       ├── users/page.tsx      # User Accounts
│       └── settings/page.tsx   # Platform & Seed Reset
├── components/
│   ├── brand/                  # OlatoLogo & OlatoSymbol
│   ├── layout/                 # Navbar, Footer, LocationSelector, AdminSidebar
│   ├── ui/                     # Button, DiscountCard, Badges, SearchBar, CategorySelector, FilterBar
│   ├── map/                    # InteractiveMap Leaflet component
│   └── ai/                     # AIDiscoveryModal component
├── context/                    # LocationContext, SavedDealsContext, AuthContext
└── lib/                        # types, repository, distance, ai-service, seed-data
```
