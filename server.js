const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Listen on `port` and 0.0.0.0
app.listen(port, "0.0.0.0", function () {
    // ...
});
// Statik dosyalar için dizini ayarlayın
app.use(express.static(path.join(__dirname, '/')));

// Tüm isteklerde ana sayfayı döndür
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
