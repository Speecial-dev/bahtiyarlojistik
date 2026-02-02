const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3000;

// Railway reverse proxy arkasında doğru protokol algılaması için
app.set('trust proxy', 1);

// Güvenlik header'ları
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// Gzip sıkıştırma (performans)
app.use(compression());

// Statik dosyalar için 'public' dizinini ayarlayın (cache header'ları ile)
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d'
}));

// Anasayfayı döndür
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 - Bilinmeyen path'ler için
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Hata yakalama
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
