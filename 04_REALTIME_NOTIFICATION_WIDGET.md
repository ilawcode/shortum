# Real-Time & Communication Specs

## 1. Supabase Realtime Listener
- Client-side listener: `supabase.channel('notifications').on('postgres_changes', ...)`
- Action: On new notification, trigger `sonner` toast with Glassmorphism style.

## 2. Resend Email Templates
- `Fork_Request_Email`: "User X wants to fork your shortcut [Name]".
- `Verification_Email`: OTP code with Apple-style minimalist template.

## 3. Notification Widget
- Navbar'da yer alan, son 5 bildirimi gösteren blurred-dropdown menü.