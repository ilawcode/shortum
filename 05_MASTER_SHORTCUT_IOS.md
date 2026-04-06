# iOS Master Shortcut (The Bridge) Logic

## 1. Trigger
- Web site triggers: `shortcuthub://execute?id=[UUID]`

## 2. Process
1. **Get ID:** Get input from URL.
2. **Fetch:** `URL Contents of https://shortcuthub.com/api/s/[ID]`.
3. **Loop:** For each item in `content_json`:
    - Match `action_type` to Native iOS Action.
    - Pass variables to the next step.