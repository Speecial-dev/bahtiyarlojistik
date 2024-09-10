const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Statik dosyalar için dizini ayarlayın
app.use(express.static(path.join(__dirname, '/')));

// Tüm isteklerde ana sayfayı döndür
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
