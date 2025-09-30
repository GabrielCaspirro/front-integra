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

  console.log('perfil do usuário:', usuario);

  // resolve possíveis nomes de campo que o buscarPerfil retorne
  const id_empresa = usuario?.id ?? usuario?.id_empresa ?? usuario?.empresaId;
  console.log('id_empresa resolvido:', id_empresa);

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
  
    // --- montar payload com coerência de tipos ---
    const rawValor = document.getElementById('valor')?.value;
    const valorNum = rawValor === '' ? 0 : Number(rawValor);
    if (Number.isNaN(valorNum)) {
      alert('Valor inválido. Verifique o campo Valor.');
      return;
    }
  
    const cepRaw = (document.getElementById('cep')?.value || '').replace(/\D/g, '');
    const payload = {
      nome: (elTitle.value || '').trim(),
      descricao: (elDesc.value || '').trim(),
      data: elDate.value,
      opcoes_horarios: horarios, // array por padrão
      valor: valorNum,
      tipo: elArea.value,
      cep: cepRaw,
      id_empresa: Number(id_empresa) || id_empresa
    };
  
    // --- validação básica antes de enviar ---
    const missing = [];
    ['nome','descricao','data','opcoes_horarios','valor','tipo','cep'].forEach(k => {
      const v = payload[k];
      if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) missing.push(k);
    });
    if (missing.length) {
      alert('Preencha os campos: ' + missing.join(', '));
      console.log('Payload incompleto (não enviado):', payload);
      return;
    }
  
    // força valor mínimo por limitação do backend
    if (payload.valor === 0) payload.valor = 0.01;
  
    // --- debug: mostrar payload no console para inspeção no Network/DevTools ---
    console.log('Tentando criar evento — payload inicial:', payload);
  
    try {
      const result = await criarEvento(payload);
      console.log('Resposta da API (primeira tentativa):', result);
  
      // Se a API retornar algo que indique campos faltando, tentamos fallback:
      const mensagem = (result && (result.mensagem || result.message || JSON.stringify(result))) || '';
      if (/campo|obrigat|falt/i.test(mensagem) && horarios.length > 0) {
        // fallback: muitos backends esperam horários como string JSON
        const payloadAlt = { ...payload, opcoes_horarios: JSON.stringify(horarios) };
        console.warn('API indicou campos faltando — tentando fallback com opcoes_horarios stringificada:', payloadAlt);
        try {
          const resultAlt = await criarEvento(payloadAlt);
          console.log('Resposta da API (fallback):', resultAlt);
          alert(resultAlt?.mensagem || 'Evento cadastrado com sucesso (fallback)!');
        } catch (errAlt) {
          console.error('Erro no fallback:', errAlt);
          alert('Erro ao criar evento (fallback): ' + (errAlt?.message || JSON.stringify(errAlt)));
        }
      } else {
        alert(result?.mensagem || 'Evento cadastrado com sucesso!');
      }

      let tipoPreview;
      if(payload.tipo === "visita_tecnica"){
        tipoPreview = "Visita Técnica";
      }else if(payload.tipo === "palestra"){
        tipoPreview = "Palestra";
      }else{
        tipoPreview = "Outro";
      }

      const previewContainer = document.getElementById('visitPreview');
      if (previewContainer) {
        previewContainer.innerHTML = `
          <div class="job-header">
            <div>
              <h3 class="job-title">${payload.nome}</h3>
              <div class="job-meta">
                <span class="job-area">${tipoPreview}</span>
              </div>
            </div>
          </div>
          <div class="job-details">
            <div class="job-description">
              <h4>Descrição</h4>
              <p>${payload.descricao}</p>
            </div>
            <div class="job-meta-row">
              <div class="job-meta-item"><i class="fas fa-calendar"></i><span>${payload.data}</span></div>
              <div class="job-meta-item"><i class="fas fa-clock"></i><span>${payload.opcoes_horarios.join(', ')}</span></div>
              <div class="job-meta-item"><i class="fas fa-dollar-sign"></i><span>R$ ${payload.valor.toFixed(2)}</span></div>
            </div>
          </div>
        `;
      }
    
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
      // exibir resposta bruta quando possível
      console.error('Erro ao criar evento (catch):', err);
      // se err for um objeto com resposta JSON try parse (depende de como sua criarEvento lança)
      alert('Erro ao criar evento: ' + (err?.message || JSON.stringify(err)));
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
