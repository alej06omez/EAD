const express = require('express');
const app = express();
const PORT = 7000;
const path = require('path');


app.use('/src', express.static('src'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/casita', (req, res) => {
    const { id, destino, peso, status } = req.body;

    const respuesta = {id,destino,peso,status,timestamp: Date.now()};

    res.json(respuesta);
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