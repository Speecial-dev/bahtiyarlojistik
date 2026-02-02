# Bahtiyar Lojistik - Production Seviyesi İnceleme Raporu

**Tarih:** Şubat 2025  
**Kapsam:** Güvenlik, performans, SEO, erişilebilirlik, kod kalitesi

---

## Özet

| Kategori | Durum | Kritiklik |
|----------|-------|-----------|
| Güvenlik | İyileştirme gerekli | Orta |
| Performans | İyileştirme gerekli | Orta |
| SEO | İyileştirme gerekli | Yüksek |
| İçerik tutarlılığı | Düzeltme gerekli | Yüksek |
| Kod kalitesi | İyileştirme gerekli | Orta |

---

## 1. GÜVENLİK

### 1.1 Security Headers Eksik
**Sorun:** Express uygulamasında güvenlik header'ları yok.

**Öneri:** `helmet` middleware ekleyin:
```javascript
const helmet = require('helmet');
app.use(helmet({
  contentSecurityPolicy: false, // Statik site için CSP devre dışı bırakılabilir
  crossOriginEmbedderPolicy: false
}));
```

**Fayda:** XSS, clickjacking, MIME sniffing koruması.

### 1.2 Gereksiz Dosya
**Sorun:** `public/images/images.rar` production'da gereksiz; hem güvenlik hem boyut açısından.

**Öneri:** Bu dosyayı silin veya .gitignore'a ekleyin.

---

## 2. PERFORMANS

### 2.1 Bootstrap Çift Yükleme
**Sorun:** Hem Bootstrap 4 (yerel) hem Bootstrap 5 (CDN) yükleniyor. Çakışma ve gereksiz ~300KB.

**Dosyalar:** index.html, contact.html, about.html vb.
```html
<!-- Bootstrap 4 -->
<script src="js/bootstrap.min.js"></script>
<!-- Bootstrap 5 -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
```

**Öneri:** Sadece Bootstrap 5 kullanın, Bootstrap 4 script'lerini kaldırın. (Navbar `data-bs-toggle` zaten Bootstrap 5 syntax'ı kullanıyor.)

### 2.2 Görsel Optimizasyonu
**Sorun:** Hero arka plan görselleri (bahtiyartır.png, bahtiyargiyim7.jpg) büyük boyutlu olabilir.

**Öneri:**
- WebP formatına dönüştürün
- `loading="lazy"` ekleyin (above-the-fold hariç)
- Responsive `srcset` kullanın

### 2.3 Font Preload
**Öneri:** Kritik fontlar için preload ekleyin:
```html
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Poppins..." as="style">
```

---

## 3. SEO

### 3.1 HTML lang Attribute
**Sorun:** Tüm sayfalarda `lang="en"` kullanılıyor; içerik Türkçe.

**Öneri:** `lang="tr"` olarak değiştirin.

### 3.2 Open Graph Locale
**Sorun:** `og:locale` ve `og:locale:alternate` eksik.

**Öneri:** index.html head'e ekleyin:
```html
<meta property="og:locale" content="tr_TR">
<meta property="og:site_name" content="Bahtiyar Lojistik">
```

### 3.3 Canonical URL
**Sorun:** `https://bahtiyarlojistik.com/index.html` yerine `https://bahtiyarlojistik.com/` tercih edilmeli (duplicate content önleme).

**Öneri:** Canonical'ı `https://bahtiyarlojistik.com/` yapın.

### 3.4 robots.txt
**Mevcut:** `Disallow: /index.html`  
**Not:** Root (/) zaten index.html ile aynı içeriği sunuyor. Disallow: /index.html mantıklı; ancak sitemap'te tutarlılık önemli.

### 3.5 Sitemap lastmod
**Sorun:** Tüm lastmod değerleri 2024-10-02; güncel değil.

**Öneri:** Deploy sonrası lastmod'u güncelleyin veya otomatikleştirin.

---

## 4. İÇERİK TUTARLILIĞI (KRİTİK)

### 4.1 Telefon Numarası Tutarsızlığı
**Sorun:** Farklı sayfalarda farklı numaralar görünüyor:

| Sayfa | Görünen | WhatsApp Link |
|-------|---------|---------------|
| index.html | +90 552 784 14 00 | wa.me/905523201400 (YANLIŞ - farklı numara) |
| contact.html | +90 552 330 14 00, 0 374 330 14 00, +90 552 320 14 00 | Karışık |
| product-detail | - | wa.me/905523301400 |
| Footer | +90 552 784 14 00 | - |

**Öneri:** Resmi iletişim numaralarını belirleyin ve tüm sitede tutarlı kullanın. WhatsApp link'i görünen numara ile eşleşmeli.

### 4.2 Boş href
**Sorun:** contact.html satır 113: `<a href="">0 374 330 14 00</a>` — boş href.

**Öneri:** `href="tel:03743301400"` yapın.

### 4.3 Ölü Footer Linkleri
**Sorun:** Footer'daki "Hakkımızda", "Servislerimiz", "Bize Ulaşın" linkleri `href="#"` — tıklanınca hiçbir yere gitmiyor.

**Öneri:**
```html
<li><a href="about.html">Hakkımızda</a></li>
<li><a href="services.html">Servislerimiz</a></li>
<li><a href="contact.html">Bize Ulaşın</a></li>
```

### 4.4 "Daha Fazla Öğrenin" Linkleri
**Sorun:** Birçok "Daha Fazla Öğrenin" linki `href="#"` — içerik yok.

**Öneri:** İlgili sayfalara (industries.html, about.html vb.) yönlendirin veya bu linkleri kaldırın.

---

## 5. SUNUCU (server.js)

### 5.1 404 Sayfası
**Sorun:** Wildcard route (`*`) tüm bilinmeyen path'ler için index.html döndürüyor. Gerçek 404 yok. `public/404.html` tamamen yorum satırı içinde.

**Öneri:** Gerçek 404 sayfası ekleyin:
```javascript
app.use(express.static(...));

app.get('/', ...);

// 404 - en sonda, static'ten sonra
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});
```
*Not: Bu durumda wildcard'ı kaldırıp, sadece 404 handler kullanılmalı. Statik dosya yoksa 404 dönmeli.*

### 5.2 Hata Yakalama
**Öneri:** Production'da uncaught exception handler ekleyin:
```javascript
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
```

---

## 6. ERİŞİLEBİLİRLİK (a11y)

### 6.1 Görsel alt Metinleri
**Kontrol:** Logo ve ürün görsellerinde `alt` attribute'ları mevcut. İçerik görsellerinde daha açıklayıcı alt metinler eklenebilir.

### 6.2 Carousel sr-only
**Mevcut:** `sr-only` class'ı "Previous" ve "Next" için kullanılıyor — iyi.

### 6.3 Renk Kontrastı
**Öneri:** WCAG 2.1 AA uyumluluğu için renk kontrastlarını kontrol edin (özellikle yeşil topbar üzerinde beyaz metin).

---

## 7. DİĞER

### 7.1 HTML Syntax
**index.html satır 352:** Fazladan `</p>` kapanış tag'i var:
```html
<p class="px-5">Kaliteli iş kıyafetleri...</p>
</p>  <!-- Fazladan -->
```

### 7.2 Products Link
**index.html satır 214:** `href="/products"` — tutarlılık için `href="/products/"` olabilir (trailing slash).

### 7.3 JSON-LD ContactPoint
**Mevcut:** `+90 552 784 14 00` — Doğru formatta. Tüm sitede bu numaranın kullanıldığından emin olun.

---

## 8. ÖNCELİKLİ YAPILACAKLAR LİSTESİ

### Yüksek Öncelik
1. Telefon numarası tutarlılığını sağlayın (özellikle WhatsApp linkleri)
2. Footer linklerini gerçek sayfalara bağlayın
3. `contact.html` boş `href=""` düzeltmesi
4. HTML `lang="tr"` olarak güncelleyin
5. 404 sayfasını etkinleştirin

### Orta Öncelik
6. Security headers (helmet) ekleyin
7. Bootstrap çift yüklemesini kaldırın
8. images.rar dosyasını kaldırın
9. og:locale ekleyin
10. index.html fazladan `</p>` düzeltmesi

### Düşük Öncelik
11. Görsel optimizasyonu (WebP, lazy load)
12. Font preload
13. Sitemap lastmod güncellemesi

---

## 9. MEVCUT İYİ UYGULAMALAR

- Trust proxy (Railway için)
- Gzip compression
- Cache header'ları (maxAge)
- SEO meta tags (description, keywords, OG)
- JSON-LD structured data
- Sitemap ve robots.txt
- Responsive viewport
- Google Maps embed (contact)
- Favicon ve canonical
