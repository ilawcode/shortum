# Editor & Drag-and-Drop Logic

## 1. Drag & Drop Mechanics
- **Library:** `@dnd-kit/core`.
- **Flow:** Users drag "Action Cards" into a "Sequence Canvas".

## 2. Real-Time Validation Engine
- **Empty Field Check:** Highlight cards with missing parameters in red.
- **Logic Sequence:** Ensure "Result" actions have a preceding "Input" action.
- **Variable Whitelist:** Users can only select variables that were defined in previous steps.

## 3. Credit Consumption
- Credits are deducted **at the start** of a new project session.
- User must confirm a "Credit Usage Modal" before the editor initializes.