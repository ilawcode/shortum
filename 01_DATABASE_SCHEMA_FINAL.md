# Database Schema & Relations (UUID Based)

## 1. Tables
### Profiles
- id: uuid (PK, references auth.users)
- email: text (unique)
- credits: int (default: 10)
- is_verified: boolean (default: false)
- created_at: timestamptz

### Shortcuts
- id: uuid (PK, default: gen_random_uuid())
- share_slug: text (unique, nanoid)
- title: text (max 100 chars)
- description: text (max 500 chars)
- content_json: jsonb (The Apple Actions Sequence)
- is_public: boolean (default: false)
- creator_id: uuid (FK -> Profiles.id)
- download_count: int (default: 0)
- vote_count: int (default: 0)
- version: int (default: 1)

### ForkRequests
- id: uuid (PK)
- source_shortcut_id: uuid (FK)
- requester_id: uuid (FK)
- owner_id: uuid (FK)
- status: enum ('PENDING', 'APPROVED', 'REJECTED')
- created_at: timestamptz

### Notifications
- id: uuid (PK)
- user_id: uuid (FK)
- type: text (e.g., 'FORK_REQUEST', 'FORK_APPROVED', 'SYSTEM')
- message: text
- is_read: boolean (default: false)
- link: text (Optional redirect path)

## 2. Row Level Security (RLS)
- Profiles: User can only read/update their own profile.
- Shortcuts: Everyone can read 'is_public=true'. Only owner can UPDATE/DELETE.