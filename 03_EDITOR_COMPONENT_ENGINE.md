# Editor Engine & Drag-and-Drop Specs

## 1. Action Whitelist (Standard Apple Actions)
Editor sadece şu tipteki aksiyonları kabul eder (Whitelist):
- `com.apple.shortcuts.scripting.text`
- `com.apple.shortcuts.weather.get`
- `com.apple.shortcuts.audio.speak`
- `com.apple.shortcuts.mail.send`
- (And 20+ more native types...)

## 2. State Management (Zustand)
- `actions`: Array of selected cards.
- `errors`: Map of validation errors (e.g., { cardId: "Field missing" }).
- `undoStack/redoStack`: History management.

## 3. Real-Time Validator
- **Variable Tracker:** Her aksiyon bir 'Output' üretir. Bir sonraki aksiyonun 'Input' kısmında sadece daha önce üretilmiş output'lar listelenebilir.
- **Empty Check:** `save` butonu, tüm input alanları dolana kadar `disabled` kalır.