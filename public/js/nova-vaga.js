// /js/nova-vaga.js
import { criarEvento } from './api/index.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('jobCreationForm');

  // preview elements
  const previewTitle = document.getElementById('previewTitle');
  const previewDescription = document.getElementById('previewDescription');
  const previewArea = document.getElementById('previewArea');
  const previewDate = document.getElementById('previewDate');
  const previewTime = document.getElementById('previewTime');

  // live preview handlers
  const elTitle = document.getElementById('visitTitle');
  const elDesc = document.getElementById('visitDescription');
  const elArea = document.getElementById('visitArea');
  const elDate = document.getElementById('data');
  const elStart = document.getElementById('horario_inicio');
  const elEnd = document.getElementById('horario_final');

  if (elTitle) elTitle.addEventListener('input', () => previewTitle.textContent = elTitle.value || 'Título da Visita Técnica');
  if (elDesc) elDesc.addEventListener('input', () => previewDescription.textContent = elDesc.value || 'Descrição aparecerá aqui...');
  if (elArea) elArea.addEventListener('change', () => previewArea.textContent = elArea.options[elArea.selectedIndex]?.text || 'Tipo');
  const updateDateTimePreview = () => {
    previewDate.textContent = elDate.value || 'Data';
    previewTime.textContent = (elStart.value ? elStart.value : '--') + ' - ' + (elEnd.value ? elEnd.value : '--');
  };
  if (elDate) elDate.addEventListener('change', updateDateTimePreview);
  if (elStart) elStart.addEventListener('change', updateDateTimePreview);
  if (elEnd) elEnd.addEventListener('change', updateDateTimePreview);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      nome: (elTitle.value || '').trim(),
      descricao: (elDesc.value || '').trim(),
      data: elDate.value,
      horario_inicio: elStart.value,
      horario_final: elEnd.value,
      valor: document.getElementById('valor').value,
      tipo: elArea.value,
      cep: (document.getElementById('cep').value || '').replace(/\D/g, '')
    };

    // validação cliente
    const missing = [];
    ['nome','descricao','data','horario_inicio','horario_final','valor','tipo','cep'].forEach(k => {
      if (payload[k] === '' || payload[k] == null) missing.push(k);
    });
    if (missing.length) {
      alert('Preencha os campos: ' + missing.join(', '));
      return;
    }

    // workaround: backend atual considera 0 como "não preenchido" (seu if !valor), então
    // substituímos 0 por 0.01 para não falhar. Ajuste o backend depois se quiser permitir 0.
    if (Number(payload.valor) === 0) {
      payload.valor = 0.01;
      console.warn('valor igual a 0 enviado como 0.01 por limitação do backend.');
    }

    try {
      console.log('Enviando payload:', payload);
      const result = await criarEvento(payload);
      console.log('Resposta do servidor:', result);
      alert(result?.mensagem || 'Evento cadastrado com sucesso!');
      form.reset();
      // atualiza preview
      previewTitle.textContent = 'Título da Visita Técnica';
      previewDescription.textContent = 'Descrição aparecerá aqui...';
      previewArea.textContent = 'Tipo';
      previewDate.textContent = 'Data';
      previewTime.textContent = 'Horário';
    } catch (err) {
      console.error('Erro ao criar evento:', err);
      alert('Erro ao criar evento: ' + err.message);
    }
  });

  // cancelar apenas limpa formulário
  const cancelBtn = document.getElementById('cancelBtn');
  if (cancelBtn) cancelBtn.addEventListener('click', () => form.reset());
});
