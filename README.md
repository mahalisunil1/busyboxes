# 📦 BusyBoxes — Next-Gen Freelance Gig & Career Job Portal

A modern, high-conversion full-stack marketplace built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**.

BusyBoxes combines the best of **Fiverr / Upwork Project Catalog** (fixed-price tiered freelance gigs) and **AngelList / Linear Careers** (high-growth tech & AI job board), complete with unified dual-role command dashboards.

---

## 🚀 Key Features

### 1. 🌐 Marketplace & Discovery
- **Dual-Model Marketplace**: Search and filter between freelance services and full-time career roles.
- **Unified Search Bar**: Live query matching across titles, skills, technologies, and sellers.
- **Top Specializations Grid**: Quick navigation across AI & Machine Learning, Next.js Full-Stack, UI/UX Systems, DevOps & Cloud IaC, 3D Spline, Mobile Apps, and SEO.
- **Verified Pro Badges**: Top Rated Plus, Top Rated, and Rising Star talent badges.

### 2. ⚡ Gigs Catalog (`/gigs`)
- **Multi-Dimensional Filters**: Category domain, max budget slider, delivery speed (24h to 14 days), seller level, and sorting (Price, Rating, Recommended).
- **Interactive 3-Tier Packages Modal**: Compare Starter, Standard, and Premium packages with delivery days, revision counts, and feature checklists.
- **Order Checkout**: Escrow milestone creation simulation with project requirements brief.

### 3. 💼 Jobs Board (`/jobs`)
- **Career Filters**: Remote / Hybrid / On-site, Full-Time / Contract / Part-Time, Seniority Level, and Minimum Annual Compensation slider ($80k to $250k+).
- **Job Detail Modal**: Responsibilities, requirements, and benefits breakdown.
- **1-Click Quick Apply Modal**: Pre-filled candidate application, resume upload simulation, cover note, and instant submission.

### 4. 📊 Dual-Mode Dashboard (`/dashboard`)
- **Perspective Toggle**: Switch between **Freelancer / Job Seeker Mode** and **Client / Employer Mode**.
- **Freelancer View**:
  - Live metrics (Balance, Active Orders, Applications Sent, Rating).
  - Active Orders tracker with completion progress bar.
  - Job Applications tracker with real-time status badges (`Under Review`, `Shortlisted`, `Interview Scheduled`, `Offer Extended`).
  - Earnings trajectory analytics & 1-click bank/Stripe payout modal.
- **Employer View**:
  - Live metrics (Active Openings, Total Applicants, Hired Specialists, Escrow Spend).
  - Candidate Pipeline / Applicant Manager with status transitions (`Shortlist`, `Interview`, `Decline`).
  - Interview scheduling calendar modal.
  - Active job postings and gig contracts manager.

### 5. 💬 Real-Time Messaging & Chat (`/messages` & Docked Drawer)
- Docked live chat drawer accessible from anywhere on the platform.
- Full-screen `/messages` communications center with contact threads, active typing simulations, and custom escrow offer proposals.

### 6. 🔖 Saved Bookmarks (`/saved`)
- Bookmarking engine supporting both favorited gigs and saved career opportunities with localStorage persistence.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **UI & React**: [React 19](https://react.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom glassmorphism & atmospheric glows
- **State Management**: [AppContext](file:///c:/Users/LENOVO/Desktop/my%20projects/busyboxes/context/AppContext.tsx) with browser `localStorage` synchronization

---

## 💻 Running Locally

```bash
# Start development server
npm run dev

# Or build for production
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
