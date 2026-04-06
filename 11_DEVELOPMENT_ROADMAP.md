# 🗺️ ShortcutHub Geliştirme Yol Haritası & Git Flow Protokolü

Bu doküman, projenin modüler gelişimi için Agent'ların uyması gereken Git stratejisini ve görev sıralamasını belirler.

## 🛠️ GIT ÇALIŞMA PROTOKOLÜ (HER GÖREV İÇİN ZORUNLU)
Her Agent, bir FAZ veya GÖREV'e başlamadan önce şu adımları izlemelidir:
1.  **Fetch & Pull:** `git checkout main` -> `git pull origin main` (En güncel kodu al).
2.  **Branch Out:** `git checkout -b feature/[gorev-adi]` (Yeni bir dal oluştur).
3.  **Develop:** Sadece ilgili `.md` dosyasındaki görevi yap.
4.  **Push:** `git add .` -> `git commit -m "feat: [gorev detayı]"` -> `git push origin feature/[gorev-adi]`.
5.  **Merge:** (Simüle et veya gerçekleştir) Feature branch'i `main`e birleştirildikten sonra bir sonraki göreve geç.

---

## 🟢 FAZ 1: Altyapı, Güvenlik & Auth
**Branch:** `feature/infrastructure-and-auth`
- **Dosyalar:** `01_DATABASE_SCHEMA_FINAL.md`, `07_PROJECT_STRUCTURE_AND_BOILERPLATE.md`, `09_SECURITY_AND_OWASP_RESOURCES.md`.
- **Görev:** Next.js projesini kur, Supabase UUID şemasını bas, Temp-mail engelleyiciyi ve Auth sistemini (10 kredi mantığıyla) tamamla.
- **Bitiş:** Kodu pushla ve `main`e birleştir.

---

## 🟡 FAZ 2: UI Shell & Design System
**Branch:** `feature/ui-glassmorphism-shell`
- **Dosyalar:** `04_UI_UX_GUIDELINES.md`, `06_UI_THEME_TOKENS.md`.
- **Görev:** Tailwind & Glassmorphism kurulumu. Navbar, Sidebar ve Dashboard iskeletini (TR/EN desteğiyle) oluştur.
- **Bitiş:** Kodu pushla ve `main`den tekrar `pull` yaparak bir sonraki aşamaya hazırlan.

---

## 🔴 FAZ 3: Drag & Drop Editor Engine
**Branch:** `feature/editor-core-engine`
- **Dosyalar:** `03_EDITOR_COMPONENT_ENGINE.md`, `08_CORE_LOGIC_FUNCTIONS.md`.
- **Görev:** `dnd-kit` entegrasyonu. Whitelist aksiyonlarını içeren canvas yapısı. Real-time validasyon motoru (Hatalı/Eksik giriş kontrolü).
- **Kredi Entegrasyonu:** Editör açılışında kredi düşme ve onay modalı.
- **Bitiş:** Kodu pushla ve `main`e birleştir.

---

## 🔵 FAZ 4: Real-Time Bildirimler & Fork Sistemi
**Branch:** `feature/notifications-and-forking`
- **Dosyalar:** `04_REALTIME_NOTIFICATION_WIDGET.md`, `02_API_ROUTES_AND_LOGIC.md`.
- **Görev:** Supabase Realtime ile uygulama içi bildirimler. Fork talebi oluşturma, onaylama ve otomatik klonlama mantığı. Resend e-posta tetikleyicileri.
- **Bitiş:** Kodu pushla.

---

## 🟣 FAZ 5: Master Shortcut Bridge & iOS Engine
**Branch:** `feature/ios-bridge-api`
- **Dosyalar:** `05_MASTER_SHORTCUT_IOS.md`, `10_MASTER_SHORTCUT_ENGINE_SPEC.md`.
- **Görev:** UUID üzerinden JSON döndüren `/api/s/[id]` public endpoint'i. Master Shortcut'ın veri çekme ve parse etme mantığının web tarafındaki simülasyonu.
- **Bitiş:** Kodu pushla.

---

## 🏁 FAZ 6: QA, OWASP Check & Deployment
**Branch:** `feature/final-optimization`
- **Görev:** Tüm inputlarda Whitelist kontrolü (OWASP). Gereksiz console.log temizliği. Vercel deployment konfigürasyonu.
- **Bitiş:** Tüm feature branchlerini kapat ve `main` üzerinden yayına al.