// app.js
const express = require('express');
const path = require('path');
const app = express();

// Importa as rotas do site
const siteRoutes = require('./routes/rotasSite');

// Configura a pasta public como estática
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para interpretar dados de formulário
app.use(express.urlencoded({ extended: true }));

// Usa as rotas separadas
app.use('/', siteRoutes);

// Rota 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '/'));
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
