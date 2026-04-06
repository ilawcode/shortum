# 🗺️ ShortcutHub Geliştirme Yol Haritası (Development Roadmap)

Bu doküman, projenin 0'dan yayına alınma sürecindeki kritik durakları ve Agent iş akışlarını belirler.

## 🟢 FAZ 1: Altyapı ve Güvenlik (Hafta 1)
**Hedef:** Veritabanı mimarisi, Auth sistemi ve Anti-Cheat koruması.

1. **Setup:** `07_PROJECT_STRUCTURE_AND_BOILERPLATE.md` dosyasını temel alarak Next.js 15 projesini başlat.
2. **Database:** `01_DATABASE_SCHEMA_FINAL.md` ile Supabase tablolarını (UUID ile) oluştur.
3. **Security:** `09_SECURITY_AND_OWASP_RESOURCES.md` uyarınca Temp-mail engelleyici middleware ve Cloudflare Turnstile entegrasyonunu yap.
4. **Kredi Mantığı:** Kayıt olan her kullanıcıya `is_verified` sonrası 10 kredi tanımlanmasını sağlayan Server Action'ı yaz.

**✅ Başarı Kriteri:** Bir kullanıcı kayıt olup, e-postasını doğrulayıp dashboard'a girdiğinde 10 kredisini görebilmeli.

---

## 🟡 FAZ 2: Görsel Kimlik ve Vitrin (Hafta 1.5)
**Hedef:** Glassmorphism arayüz ve Keşfet sayfası.

1. **Design:** `04_UI_UX_GUIDELINES.md` ve `06_UI_THEME_TOKENS.md` dosyalarına göre Tailwind konfigürasyonunu yap.
2. **Layout:** Navbar (Bildirim widget'lı) ve Sidebar bileşenlerini oluştur.
3. **Public Dashboard:** `02_API_ROUTES_AND_LOGIC.md` dosyasındaki `GET` rotalarını kullanarak halka açık kestirmeleri listeleyen Masonry Grid yapısını kur.

**✅ Başarı Kriteri:** Mobil uyumlu, Dark/Light mode destekli, estetik bir ana sayfanın hazır olması.

---

## 🔴 FAZ 3: Editör ve Validasyon (Hafta 2)
**Hedef:** Sürükle-bırak editör ve Kredi tüketimi.

1. **Editor Canvas:** `03_EDITOR_COMPONENT_ENGINE.md` dosyasındaki Whitelist aksiyonlarını kullanarak sürükle-bırak (dnd-kit) yapısını kur.
2. **Logic Check:** `08_CORE_LOGIC_FUNCTIONS.md` dosyasındaki validasyon motorunu entegre et (Boş alan, tanımsız değişken hatası).
3. **Save & Deduct:** Kullanıcı "Kaydet" dediğinde krediyi düşüren ve veriyi `jsonb` olarak kaydeden işlemi tamamla.

**✅ Başarı Kriteri:** Kullanıcının aksiyonları dizip, hata almadan kaydedebilmesi ve kredisinin 1 azaldığını görmesi.

---

## 🔵 FAZ 4: Real-Time ve iOS Köprüsü (Hafta 2.5)
**Hedef:** Bildirimler ve iPhone entegrasyonu.

1. **Notifications:** `04_REALTIME_NOTIFICATION_WIDGET.md` uyarınca Supabase Realtime ve Resend e-posta akışlarını bağla (Özellikle Fork talepleri için).
2. **Master Shortcut API:** `05_MASTER_SHORTCUT_IOS.md` ve `10_MASTER_SHORTCUT_ENGINE.md` dosyalarındaki mantıkla, UUID üzerinden JSON döndüren API ucunu güvenli hale getir.
3. **Fork System:** Kullanıcılar arası fork talep/onay sistemini aktif et.

**✅ Başarı Kriteri:** iPhone'daki "Master Shortcut"ın web'deki bir kestirmeyi başarıyla çekip çalıştırması.

---

## 🏁 FAZ 5: Final & Test
1. **OWASP Check:** Tüm inputların Whitelist kontrolünden geçtiğinden emin ol.
2. **Multi-lang:** TR ve EN dil dosyalarını (next-intl) tüm arayüze yay.
3. **Vercel Deploy:** Projeyi Vercel üzerinde production'a al.