const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Statik dosyalar için 'public' dizinini ayarlayın
app.use(express.static(path.join(__dirname, 'public')));

// Anasayfayı döndür
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Diğer tüm isteklerde de anasayfayı döndür (SPA kullanıyorsanız)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Sunucuyu başlat ve dinlemeye başla
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
