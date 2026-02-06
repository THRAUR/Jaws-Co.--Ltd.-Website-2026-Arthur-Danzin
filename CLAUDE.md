# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 14 corporate website for Jaws Co., Ltd., a Taiwanese FFC/FPC and Wire-to-Board connector manufacturer. Static site with product catalog filtering, no database required.

## Development Commands

All commands run from `web-app/` directory:

```bash
npm run dev    # Development server at localhost:3000
npm run build  # Production build
npm run lint   # ESLint checks
npm start      # Start production server
```

## Architecture

**App Router Structure (Next.js 14):**
- `app/page.js` - Homepage with hero video, stats, featured series
- `app/products/page.js` - Product catalog with category filtering via `?category=` query param
- `app/about/page.js` - Company timeline (1975-2026), certifications
- `app/contact/page.js` - Contact form with client-side state

**Shared Components:**
- `components/Navbar.js` - Fixed nav with backdrop blur, active link detection
- `components/Footer.js` - Footer with dynamic year

**Data:**
- `data/products.json` - 181 products with specs, categories, image URLs (auto-generated)

## Styling Conventions

**CSS Variables (globals.css):**
- `--gold: #C5A059` - Primary accent color
- `--red: #D72638` - CTA buttons
- `--black: #111111` - Primary text
- `--off-white: #faf9f6` - Light backgrounds

**Typography:**
- Headings: Playfair Display (serif)
- Body: Manrope (sans-serif)

**Pattern:** CSS Modules for component-scoped styles (`*.module.css`)

## Key Conventions

- Path alias: `@/*` maps to project root (jsconfig.json)
- Client components use `'use client'` directive (contact form, navbar)
- Standalone output mode for deployment (next.config.js)
- Product categories: "0 5  Mm", "1 0  Mm", "1 25 Mm", "FPC / FFC", "Wire To Board Connector(NEW)"
