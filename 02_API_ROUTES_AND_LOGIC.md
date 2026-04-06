# API Endpoints & Business Logic

## 1. Auth & Protection
- `POST /api/auth/register`: 
    - Check email against `temp-mail-list.json`.
    - Trigger Cloudflare Turnstile verification.
    - Send OTP via Resend.
- `MIDDLEWARE`: Global rate limiter (Upstash) and Whitelist-only input filtering.

## 2. Shortcut Operations
- `POST /api/shortcuts/create`: 
    - Verify user has >0 credits.
    - Deduct 1 credit immediately.
    - Initialize an empty UUID shortcut.
- `GET /api/s/[uuid]`: (Public Bridge)
    - Returns the raw JSON for the Master Shortcut.
    - Increments `download_count`.

## 3. Social Logic
- `POST /api/fork/request`: Creates a notification for the owner.
- `POST /api/fork/approve`: 
    - Clones the `content_json` to requester's library.
    - Marks requester as "Forked from [Owner]".