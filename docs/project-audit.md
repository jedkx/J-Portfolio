# Denetim — 22 Ekim 2026

> Tarihsel denetim kaydıdır. Aşağıdaki birleşik sahne/67 frekansı/test sayısı sonraki değişikliklerle eskimiştir. Güncel akış: [interactions.md](interactions.md), mimari: [architecture.md](architecture.md).

Karar: İncelenen işlevsel kapsamda hazır. Tasarım ve mevcut içerik korundu.

Kapsam: Uygulama akışı, gezinme/scroll, terminal, GitHub veri ve önizleme hattı,
gizli oyun, animasyon yaşam döngüleri, responsive stiller ve build/CI yapılandırması.

## Giderilen bulgular

- [ORTA] Sahne yüksekliği intro mesafesiyle uyuşmadığından son projede boş scroll oluşuyordu — `src/styles/experience.css:5`.
- [ORTA] About menü hedefi terminalin çıkış animasyonuna denk gelebiliyordu; sabit menü ofseti ve bölüm hedefleri eşitlendi — `src/components/layout/Navigation.tsx`.
- [ORTA] Bölümün inert/ARIA durumu scrub animasyonundan önce değişiyordu; artık oynatılan zamanla eşleşiyor — `src/components/sections/PortfolioExperience.tsx`.
- [ORTA] ScrollTrigger refresh/resize sırasında geçici geri sarma yanlış bölüm durumu bırakabiliyordu; refresh senkronizasyonu eklendi — `src/components/sections/PortfolioExperience.tsx`.
- [ORTA] İlk yüklemede hash bağlantıları Home’da kalabiliyordu; boot sonrasında hedef uygulanıyor — `src/App.tsx`.
- [ORTA] Klavye veya gezinme ile kesilen programatik proje scroll’u eski hedefte kalabiliyordu; kullanıcı girişinde iptal ediliyor — `src/components/sections/PortfolioExperience.tsx`.
- [ORTA] Mobil menü scroll kilidi hedefe hareketten önce eşzamanlı kaldırılıyor — `src/components/layout/Navigation.tsx`.
- [ORTA] Uç bakış yönleri göz çeperini kesebiliyordu; gözbebeği hareketi güvenli sınırda tutuluyor — `src/assets/residentBlockFrames.ts`.
- [ORTA] Gereksiz ASCII kaçışı CI lint adımını durduruyordu; görünümü değiştirmeden düzeltildi — `src/components/ui/AsciiWord.tsx:7`.

## Regresyon / test

- ESLint, TypeScript, üretim build’i ve 7 otomatik test başarılı; göz testinde 441 bakış yönü kontrol edildi.
- Tarayıcıda desktop, 390×844, 412×915 ve 844×390 düzenleri kontrol edildi.
- About/Work menüleri, proje düğmeleri, ters scroll, son projeden çıkış, resize, doğrudan `#projects` açılışı ve receiver klavye kontrolü doğrulandı.
- Slider Who’s there içine taşındı; 67 değerinde sinyal bağlantısı doğrulandı.

Bakılamadı: Gerçek iOS/Android/Safari cihazları, kapsamlı bağımlılık güvenlik taraması ve canlı deploy. Build’de eski Browserslist veri uyarısı var; derlemeyi engellemiyor.
