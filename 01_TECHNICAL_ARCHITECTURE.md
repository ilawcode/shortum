# Technical Architecture & Security (SDD)

## 1. Database & Security
- **Engine:** PostgreSQL (Supabase).
- **ID Strategy:** UUID v4 for all primary keys. NanoID for public share slugs.
- **Auth:** NextAuth + Supabase Auth. 
- **Validation:** Server-side Zod schemas for all inputs.

## 2. The Master Shortcut Bridge
- Instead of downloading files, the web app provides a UUID.
- The "Master Shortcut" on iOS fetches the JSON from `api/s/[uuid]`.
- This bypasses URL length limits and ensures only authorized downloads.

## 3. Anti-Cheat & Bot Protection
- **Middleware:** Checks `temp-mail-list.json` during registration.
- **Turnstile:** Cloudflare Turnstile integration for bot-free credit claiming.
- **Rate Limiting:** Upstash Redis (10 requests per minute for sensitive routes).