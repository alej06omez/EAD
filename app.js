const express = require('express');
const app = express();
const PORT = 7000;
const path = require('path');



app.use('/src', express.static('src'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.text({ limit: '10mb' }));


// Devuelve el caso recibido en JSON. Serializa O(L) bytes para un texto de longitud L.
app.post('/casita', (req, res) => {
    const texto = req.body;

    res.json(texto);
});

// Sirve el formulario de registro.
app.get('/casita', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'casita.html'));
});

// Redirige la ruta raíz al formulario.
app.get('/', (req, res) => {
    res.redirect('/casita');
});

// Inicia el servidor y muestra su dirección.
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
