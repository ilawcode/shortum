# OWASP Implementation Details

## 1. Input Sanitization
- `DOMPurify` (Client-side) ve `validator.js` (Server-side) kullanılacak.
- Başlık (title) alanında `< > / \` karakterleri `regex` ile temizlenecek.

## 2. API Security
- Tüm route'larda `Next-Safe-Action` kütüphanesi kullanılacak.
- Session kontrolü için `Middleware` kullanılacak (JWT manipulation protection).

## 3. Rate Limiting (Upstash)
- `/api/shortcuts/create`: 24 saatte max 10 istek (Kredi suistimali için).
- `/api/auth/register`: IP başına saatlik max 3 deneme.