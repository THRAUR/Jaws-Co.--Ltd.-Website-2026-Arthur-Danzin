# Task Decomposition

## Phase 1: Foundation (Estimated: 8 Tokens)
- [ ] **Setup Supabase Project** (Low)
    - Create project, obtain keys.
    - Set up Tables (`products`, `categories`, `news`, `inquiries`) via SQL Editor.
    - Set up Storage Buckets (`images`, `pdfs`).
- [ ] **Integrate Supabase SDK** (Low)
    - Install `@supabase/supabase-js` `@supabase/ssr`.
    - Configure Middleware for Auth protection.
- [ ] **Data Migration** (Medium)
    - Script to import `data/products.json` into Supabase `products` table.

## Phase 2: Admin Dashboard (Estimated: 15 Tokens)
- [ ] **Admin Login Page** (Low)
    - UI and Auth Logic.
- [ ] **Dashboard Layout** (Low)
    - Sidebar navigation, Logout button.
- [ ] **Product Manager** (High)
    - List View (Table with pagination).
    - Create/Edit Form (Image upload handling + Dynamic Spec fields).
- [ ] **News Manager** (Medium)
    - Rich Text Editor for articles (simple `textarea` or `tiptap` integration).

## Phase 3: Public Facing Upgrade (Estimated: 12 Tokens)
- [ ] **Refactor Product Pages** (Medium)
    - Switch `app/products/page.js` to fetch from Supabase instead of JSON.
    - Update `app/products/[id]/page.js` for dynamic routing.
- [ ] **Implement News Section** (Medium)
    - `/news` (List) and `/news/[slug]` (Detail).
- [ ] **Fix Contact Form** (Low)
    - Connect Form to specific API endpoint → DB insert.

## Phase 4: Polish & Review (Estimated: 5 Tokens)
- [ ] **SEO Verification** (Low)
    - Ensure dynamic OpenGraph tags.
- [ ] **Automated Testing** (Medium)
    - Basic E2E test for Admin Login flow (TestSprite friendly).
