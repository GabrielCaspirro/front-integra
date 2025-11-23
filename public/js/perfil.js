// perfil.js
import { buscarPerfil } from './api/index.js';
import { BASE_URL, BASE_URL_IMG } from './api/config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const fotoEl = document.getElementById('perfil-foto');
  const nomeEl = document.getElementById('perfil-nome');
  const emailEl = document.getElementById('perfil-email');
  const foto2El = document.getElementById('user-profile-btn')
  const cnpjEl = document.getElementById('info-cnpj');
  const telefoneEl = document.getElementById('info-telefone');
  const areaEl = document.getElementById('info-area');
  const siteEl = document.getElementById('info-site');
  const enderecoEl = document.getElementById('info-endereco');
  const descricaoEl = document.getElementById('info-descricao');
  const empresaNomeHeader = document.getElementById('empresaNome');

  // util — formata endereço vindo do banco
  function formatEndereco(e) {
    if (!e) return '—';
    return [
      e.rua ? `${e.rua}${e.numero ? ', ' + e.numero : ''}` : '',
      e.bairro || '',
      e.cidade || '',
      e.estado || '',
      e.cep || ''
    ].filter(Boolean).join(' • ');
  }

  try {
    // 1 — pegar perfil básico (que contém id)
    const perfil = await buscarPerfil();
    if (!perfil || !perfil.id) {
      nomeEl.textContent = 'Usuário não encontrado';
      return;
    }

    if (empresaNomeHeader) empresaNomeHeader.textContent = perfil.nome || '';

    const token = localStorage.getItem('token');

    // 2 — buscar empresa completa pelo id
    const empresaRes = await fetch(`${BASE_URL}/empresaById/${perfil.id}`, {
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    });

    if (!empresaRes.ok) {
      nomeEl.textContent = perfil.nome || 'Empresa';
      emailEl.textContent = perfil.email || '';
      console.error('Erro ao buscar empresa por ID.');
      return;
    }

    const empresaArr = await empresaRes.json();
    const empresa = Array.isArray(empresaArr) ? empresaArr[0] : empresaArr;

    // preencher dados básicos
    nomeEl.textContent = empresa.nome || '—';
    emailEl.textContent = empresa.email || '—';
    cnpjEl.textContent = empresa.cnpj || '—';
    telefoneEl.textContent = empresa.telefone || '—';
    areaEl.textContent = empresa.setor || '—';     // vem como "setor" na sua tabela

    // foto / logo
    if (empresa.logo) {
      fotoEl.innerHTML = `<img src="${BASE_URL_IMG}${empresa.logo}" style="width:100%;height:100%;object-fit:cover;">`;
      foto2El.innerHTML = `<img src="${BASE_URL_IMG}${empresa.logo}" style="width:40px;height:40px;border-radius:50%;">`;
    }

    // 3 — buscar endereço pelo id_endereco
    if (empresa.id_endereco) {
      const enderecoRes = await fetch(`${BASE_URL}/endereco`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ id: empresa.id_endereco })
      });

      if (enderecoRes.ok) {
        const enderecoData = await enderecoRes.json();
        const endereco = enderecoData[0];
        enderecoEl.textContent = formatEndereco(endereco);
      } else {
        enderecoEl.textContent = '—';
      }
    } else {
      enderecoEl.textContent = '—';
    }

    // botão editar perfil
    document.getElementById('editar-perfil-btn')?.addEventListener('click', () => {
      window.location.href = `/editar-perfil?id=${empresa.id_empresa}`;
    });

    // botão excluir conta
    document.getElementById('excluir-conta-btn')?.addEventListener('click', async () => {
      if (!confirm('Deseja realmente excluir sua conta?')) return;

      try {
        const delRes = await fetch(`${BASE_URL}/empresa/${empresa.id_empresa}`, {
          method: 'DELETE',
          headers: { 'Authorization': token ? `Bearer ${token}` : '' }
        });

        if (!delRes.ok) throw new Error('Erro ao excluir');

        alert('Conta excluída!');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir conta');
      }
    });

  } catch (err) {
    console.error(err);
    nomeEl.textContent = 'Erro ao carregar perfil';
  }
});
