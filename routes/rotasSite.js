const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

router.get('/termos-de-uso', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/termos/termos-de-uso.html'));
});

router.get('/termos-de-privacidade', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/termos/termos-de-privacidade.html'));
});

router.get('/administrador', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/administrador/administrador_view.html'));
});

router.get('/coordenador', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/coordenador/coordenador_view.html'));
});

router.get('/home-coordenador', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/coordenador/home.html'));
});

router.get('/agendados-coordenador', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/coordenador/agendados.html'));
});

router.get('/agendamento-coordenador', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/coordenador/agendamento.html'));
});

router.get('/estudantes-coordenador', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/coordenador/estudantes.html'));
});

router.get('/criar-evento', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/coordenador/criar-evento.html'));
});

router.get('/empresa', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/empresa/empresa_view.html'));
});

router.get('/nova-vaga', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/empresa/nova-vaga.html'));
});

router.get('/agendados', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/empresa/agendados.html'));
});

router.get('/palestrantes-empresa', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/empresa/palestrante-empresa.html'));
});

router.get('/vagas', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/empresa/vagas.html'));
});

router.get('/estudante', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/estudante/estudante_view.html'));
});

router.get('/instituicao', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/instituicao/instituicao_view.html'));
});

router.get('/gerenciamento', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/instituicao/gerenciamento.html'));
});

router.get('/eventos', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/instituicao/eventos.html'));
});

router.get('/palestrante', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/palestrante/palestrante_view.html'));
});

router.get('/palestrante/palestras', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/palestrante/palestras.html'));
});

router.get('/palestrante/empresas', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/palestrante/empresas.html'));
});

router.get('/palestrante/inscricoes', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/palestrante/inscricoes.html'));
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

router.get('/recupera-senha', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/recupera_senha.html'));
});

router.get('/calendario', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/estudante/calendario.html'));
});

router.get('/avaliar', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/estudante/avaliar.html'));
});

router.get('/perfil', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/perfil.html'));
});



module.exports = router;
