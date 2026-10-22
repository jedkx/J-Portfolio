# Senior denetim — 22 Ekim 2026

> Bu rapor denetim anındaki durumu değerlendirir; sonraki arayüz değişikliklerinin yeniden puanlaması değildir. Güncel davranış: [interactions.md](interactions.md).

**Karar: Hazır — incelenen yerel işlevsel kapsamda. 10/10 değil.**

Puanlar kişisel mühendislik/tasarım değerlendirmesidir; Awwwards, Lighthouse veya kullanıcı testi sonucu değildir.

| Alan                       | Başlangıç | Düzeltme sonrası |
| -------------------------- | --------- | ---------------- |
| Kod mimarisi               | 6,5/10    | 8/10             |
| Dosya yapısı / bakım       | 6,5/10    | 8/10             |
| Arayüz / kullanılabilirlik | 7,5/10    | 8/10             |

**Güçlü taraflar:** Özgün terminal/uzay kimliği, tema bütünlüğü, erişilebilir gerçek repo bağlantıları, API/cache fallback'leri, reduced-motion alternatifi ve isteğe bağlı keşif oyunu.

## Açık bulgular

- [YÜKSEK — geliştirme zinciri] Tailwind 3'ün `braces` bağımlılığında DoS advisory'si kalıyor; bu statik üretim JS'ine taşınan bir açık değildir — `package.json` (`tailwindcss`), `package-lock.json`.
- [ORTA — geliştirme zinciri] Aynı zincirde `postcss-selector-parser` uyarısı kalıyor; zorunlu major override uygulanmadı — `package-lock.json`.
- [ORTA] Eski tasarım katmanları ve yinelenen seçiciler bakım/regresyon riskini artırıyor; mobil taşmaya neden olan iki kural düzeltildi, tüm CSS henüz konsolide değil — `src/styles/experience.css`, `editorial.css`, `quiet.css`.
- [ORTA] Otomatik gerçek tarayıcı regresyonu, gerçek iOS/Android doğrulaması ve alan performans ölçümü eksik; puanı bunlar olmadan 10 olarak sunmak doğru olmaz — `tests/`.

## Giderilen bulgular / uygulanan değişiklikler

- Animasyon yaşam döngüsü görünümden ayrıldı; geometri ve bölüm eşikleri test edilebilir tek modüle taşındı — `src/features/portfolio/`.
- Aktif repo görseli eski bölüm bileşeninden ayrıldı; App legacy barrel üzerinden yüklemiyor — `RepositoryVisual.tsx`, `src/App.tsx`.
- Cache şeması, tarihleri, topic alanları ve HTTPS önizlemeleri doğrulanıyor; employer filtresi ve deduplikasyon korunuyor — `src/lib/projectCache.ts`.
- Profil/katkı isteklerine timeout, iptal ve veri doğrulaması eklendi; README kuyruğu dört istekle sınırlı — `src/lib/request.ts`, `contributions.ts`, `src/hooks/useProjects.ts`.
- Mobil menü 320×568'de beş bağlantıyı sığdırıyor; kapalı menü inert, açık menü dialog olarak tanımlı. Ana isim artık yatay taşmıyor — `Navigation.tsx`, `navigation.css`, `experience.css`.
- Scroll state güncellemeleri frame başına sınırlandı; keşif hedefleri atandıktan sonra gereksiz MutationObserver'lar kapanıyor — `useUtils.ts`, `SecretGame.tsx`.
- Vite 7.3.7, PostCSS ve TypeScript ESLint yamalı zincire güncellendi; Node 22 CI/Docker ile eşitlendi. Kırıcı `audit fix --force` çalıştırılmadı.
- 15 regresyon testi deploy ve PR kalite kapılarına eklendi; PR workflow'u yayınlamıyor — `.github/workflows/`.

## Doğrulama ve sınırlar

- ESLint, TypeScript ve 15 birim/regresyon testi geçti. Üretim build'i yerelde doğrulandı.
- npm registry advisory kontrolü: üretim bağımlılıklarında eşleşme yok; geliştirme ağacında yukarıdaki iki advisory kaynağı açık. Bu, tüm güvenlik risklerinin yokluğu anlamına gelmez.
- Tarayıcı: 320×568 menü/taşma, desktop terminal ve ileri proje scroll'u doğrulandı; console error görülmedi. Önceki kontroller 390×844, 412×915 ve kısa ekran statik akışını da kapsıyor.
- GitHub'da CI çalıştırılmadı, Docker build'i ve gerçek cihazlar doğrulanmadı. Commit/push/deploy yapılmadı.

## 10/10'a yaklaşmak için kalan kabul kriterleri

1. Tailwind 4 geçişini izole yapıp görsel karşılaştırmalarla iki geliştirme advisory'sini kapatmak.
2. Eski CSS katmanlarını feature sahipliğine göre konsolide etmek; ters scroll, preview ve dialog durumlarını korumak.
3. Otomatik tarayıcı/klavye/reduced-motion/hata senaryoları ile gerçek Safari/Android ve kullanıcı testlerini tamamlamak.
4. Ölçülmüş performans bütçeleri ve erişilebilirlik denetimiyle mobil okunabilirlik, kontrast, LCP/INP/CLS'yi doğrulamak.

Detaylı sahiplik ve değişmezler: [architecture.md](architecture.md).
