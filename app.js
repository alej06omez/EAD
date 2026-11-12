const express = require('express');
const app = express();
const PORT = 7000;
const path = require('path');



app.use('/src', express.static('src'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.text({ limit: '10mb' }));


app.post('/casita', (req, res) => {
    const texto = req.body;

    res.json(texto);
});

app.get('/casita', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'casita.html'));
});

app.get('/', (req, res) => {
    res.redirect('/casita');
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});