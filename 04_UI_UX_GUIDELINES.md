# UI/UX Specification: Glassmorphism Minimalist

## 1. Aesthetic
- **Blur:** `backdrop-blur-lg`.
- **Opacity:** Backgrounds at `bg-white/10` (Dark) and `bg-slate-200/40` (Light).
- **Borders:** `1px solid rgba(255, 255, 255, 0.1)`.

## 2. Layouts
- **Navigation:** Left-fixed blurred sidebar.
- **Editor:** Full-screen canvas with "Floaty" action cards.
- **Dashboard:** Masonry grid for shortcut cards.

## 3. Feedback Loop
- Use `Framer Motion` for smooth entry/exit of cards.
- Use `Sonner` for glass-styled toast notifications.