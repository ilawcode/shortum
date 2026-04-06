# Folder Structure & Framework Setup

/src
  /app
    /api
      /shortcuts/[id]/route.ts   # Master Shortcut Bridge (JSON Fetch)
      /shortcuts/create/route.ts  # Credit check & UUID generation
      /notifications/route.ts     # Real-time trigger endpoints
    /editor
      /page.tsx                   # Canvas & Toolbar UI
      /layout.tsx                 # Editor-specific providers
    /dashboard
      /page.tsx                   # Masonry Grid for public shortcuts
  /components
    /editor
      /ActionCard.tsx             # Draggable action element
      /ParameterInput.tsx         # Whitelisted input fields
      /ValidatorOverlay.tsx       # Real-time error tooltips
    /ui
      /GlassCard.tsx              # Reusable Glassmorphism wrapper
  /lib
    /supabase-client.ts           # Supabase Auth & DB init
    /temp-mail-checker.ts         # Domain validation logic
    /validations.ts               # Zod schemas for Shortcuts
  /store
    /useEditorStore.ts            # Zustand state for D&D logic