import { buscarPerfil, criarEvento } from './api/index.js';
import { BASE_URL_IMG } from './api/config.js';

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('jobCreationForm');

  // --- Pegar perfil do usuário ---
  const usuario = await buscarPerfil();
  if (!usuario || usuario.tipo !== 'empresa') {
    alert('Não foi possível identificar a empresa logada.');
    return;
  }

  const id_empresa = usuario.id;

  // --- Atualizar header com nome e logo ---
  const userInfo = document.querySelector('#user-profile-btn p');
  if (userInfo) userInfo.textContent = usuario.nome || 'Minha Empresa';

  const userAvatar = document.querySelector('#user-profile-btn .user-avatar');
  if (userAvatar && usuario.logo) {
    userAvatar.innerHTML = `<img src="${BASE_URL_IMG}${usuario.logo}" alt="Logo ${usuario.nome}" style="width:40px;height:40px;border-radius:50%;">`;
  }

  // --- Elementos do preview ---
  const previewTitle = document.getElementById('previewTitle');
  const previewDescription = document.getElementById('previewDescription');
  const previewArea = document.getElementById('previewArea');
  const previewDate = document.getElementById('previewDate');
  const previewTime = document.getElementById('previewTime');

  const elTitle = document.getElementById('visitTitle');
  const elDesc = document.getElementById('visitDescription');
  const elArea = document.getElementById('visitArea');
  const elDate = document.getElementById('data');

  elTitle?.addEventListener('input', () => previewTitle.textContent = elTitle.value || 'Título da Visita Técnica');
  elDesc?.addEventListener('input', () => previewDescription.textContent = elDesc.value || 'Descrição aparecerá aqui...');
  elArea?.addEventListener('change', () => previewArea.textContent = elArea.options[elArea.selectedIndex]?.text || 'Tipo');
  elDate?.addEventListener('change', () => previewDate.textContent = elDate.value || 'Data');

  // --- Horários ---
  const horarios = [];
  const inputHorario = document.getElementById('novo-horario');
  const listaHorarios = document.getElementById('lista-horarios');
  const btnAdicionar = document.getElementById('adicionar-horario');

  const atualizarPreviewHorarios = () => previewTime.textContent = horarios.join(', ') || 'Horário';

  btnAdicionar?.addEventListener('click', () => {
    const valor = inputHorario.value.trim();
    if (!valor) return;

    horarios.push(valor);
    const li = document.createElement('li');
    li.textContent = valor;

    const removerBtn = document.createElement('button');
    removerBtn.type = 'button';
    removerBtn.textContent = '❌';
    removerBtn.style.marginLeft = '10px';
    removerBtn.addEventListener('click', () => {
      const index = horarios.indexOf(valor);
      if (index > -1) horarios.splice(index, 1);
      li.remove();
      atualizarPreviewHorarios();
    });

    li.appendChild(removerBtn);
    listaHorarios.appendChild(li);
    inputHorario.value = '';
    atualizarPreviewHorarios();
  });

  // --- Submissão do formulário ---
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      nome: (elTitle.value || '').trim(),
      descricao: (elDesc.value || '').trim(),
      data: elDate.value,
      opcoes_horarios: horarios,
      valor: parseFloat(document.getElementById('valor').value),
      tipo: elArea.value,
      cep: (document.getElementById('cep').value || '').replace(/\D/g, ''),
      id_empresa
    };

    // validação básica
    const missing = [];
    ['nome','descricao','data','opcoes_horarios','valor','tipo','cep'].forEach(k => {
      if (!payload[k] || (Array.isArray(payload[k]) && payload[k].length === 0)) missing.push(k);
    });
    if (missing.length) {
      alert('Preencha os campos: ' + missing.join(', '));
      return;
    }

    if (payload.valor === 0) payload.valor = 0.01; // workaround backend

    try {
      const result = await criarEvento(payload);
      alert(result?.mensagem || 'Evento cadastrado com sucesso!');

      // reset form e preview
      form.reset();
      horarios.length = 0;
      listaHorarios.innerHTML = '';
      previewTitle.textContent = 'Título da Visita Técnica';
      previewDescription.textContent = 'Descrição aparecerá aqui...';
      previewArea.textContent = 'Tipo';
      previewDate.textContent = 'Data';
      previewTime.textContent = 'Horário';
    } catch (err) {
      console.error('Erro ao criar evento:', err);
      alert('Erro ao criar evento: ' + (err?.message || err));
    }
  });

  // --- Botão cancelar ---
  document.getElementById('cancelBtn')?.addEventListener('click', () => {
    form.reset();
    horarios.length = 0;
    listaHorarios.innerHTML = '';
    previewTitle.textContent = 'Título da Visita Técnica';
    previewDescription.textContent = 'Descrição aparecerá aqui...';
    previewArea.textContent = 'Tipo';
    previewDate.textContent = 'Data';
    previewTime.textContent = 'Horário';
  });
});
