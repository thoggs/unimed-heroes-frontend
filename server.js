const express = require('express');
const path = require('path');

const app = express();

// Defina a pasta 'dist' como o diretório estático
app.use(express.static(path.join(__dirname, 'dist')));

// Defina uma rota para responder ao acesso à página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Defina a porta em que o servidor irá ouvir
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
