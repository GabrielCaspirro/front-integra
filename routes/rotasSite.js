const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/administrador', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/administrador/administrador_view.html'));
});

router.get('/coordenador', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/coordenador/coordenador_view.html'));
});

router.get('/empresa', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/empresa/empresa_view.html'));
});

router.get('/estudante', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/estudante/estudante_view.html'));
});

router.get('/instituicao', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/instituicao/instituicao_view.html'));
});

router.get('/palestrante', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/palestrante/palestrante_view.html'));
});

//Cadastro
router.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/cadastro/cadastro.html'));
});

router.get('/cadastro-instituicao', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/cadastro/cadastro-instituicao.html'));
});

router.get('/cadastro-empresa', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/cadastro/cadastro-empresa.html'));
});

router.get('/cadastro-palestrante', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/cadastro/cadastro-palestrante.html'));
});


//Login
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login/login.html'));
});

router.get('/login-coordenador', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login/login-coordenador.html'));
});

router.get('/login-empresa', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login/login-empresa.html'));
});

router.get('/login-estudante', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login/login-estudante.html'));
});

router.get('/login-instituicao', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login/login-instituicao.html'));
});

router.get('/login-palestrante', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login/login-palestrante.html'));
});

router.get('/planos', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/planos/planos.html'));
});

module.exports = router;
