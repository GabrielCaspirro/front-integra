import { buscarPerfil } from "./api/index.js";
import { BASE_URL } from "./api/config.js";

let eventosOriginais = []; // cache para não precisar refazer fetch toda hora
let perfilGlobal = null;

document.addEventListener("DOMContentLoaded", async () => {
  // Buscar perfil logado
  perfilGlobal = await buscarPerfil();
  if (perfilGlobal) {
    // Atualizar nome
    document.querySelector("#user-profile-btn p").textContent =
      perfilGlobal.nome_empresa || perfilGlobal.nome;

    // Atualizar avatar (se tiver imagem)
    const avatar = document.querySelector("#user-profile-btn .user-avatar");
    if (perfilGlobal.logo) {
      avatar.innerHTML = `<img src="${perfilGlobal.logo}" alt="Foto de perfil" class="avatar-img">`;
    }
  }

  // Buscar eventos dessa empresa
  if (perfilGlobal?.id) {
    await carregarEventos(perfilGlobal.id);
  }

  // Listeners para filtros
  document.getElementById("statusFilter").addEventListener("change", aplicarFiltros);
  document.getElementById("typeFilter").addEventListener("change", aplicarFiltros);
  document.getElementById("searchFilter").addEventListener("input", aplicarFiltros);
});

async function carregarEventos(id_empresa) {
  try {
    const resposta = await fetch(`${BASE_URL}/eventos?id_empresa=${id_empresa}`);
    if (!resposta.ok) throw new Error("Erro ao carregar eventos");

    eventosOriginais = await resposta.json();

    // Ordenar eventos pela data de forma crescente
    eventosOriginais.sort((a, b) => new Date(a.data) - new Date(b.data));

    // Atualizar estatísticas
    document.getElementById("totalVisits").textContent = eventosOriginais.length;
    document.getElementById("scheduledVisits").textContent =
      eventosOriginais.filter(e => e.periodo_escolhido !== null).length;

    aplicarFiltros(); // já renderiza aplicando filtros iniciais
  } catch (erro) {
    console.error("Erro ao carregar eventos:", erro);
    document.getElementById("emptyState").style.display = "block";
  }
}

function aplicarFiltros() {
  const status = document.getElementById("statusFilter").value;
  const tipo = document.getElementById("typeFilter").value;
  const busca = document.getElementById("searchFilter").value.toLowerCase();

  let filtrados = [...eventosOriginais];

  // filtro status
  if (status !== "all") {
    filtrados = filtrados.filter(e => e.status === status);
  }

  // filtro tipo
  if (tipo !== "all") {
    // no banco está "palestra" ou "visita_tecnica"
    filtrados = filtrados.filter(e => {
      if (tipo === "tecnica") return e.tipo === "visita_tecnica";
      return e.tipo === tipo;
    });
  }

  // filtro busca no nome
  if (busca) {
    filtrados = filtrados.filter(e =>
      e.nome.toLowerCase().includes(busca)
    );
  }

  renderizarEventos(filtrados);
}

function renderizarEventos(eventos) {
  const grid = document.getElementById("visitsGrid");
  const list = document.getElementById("visitsList");
  const empty = document.getElementById("emptyState");

  grid.innerHTML = "";
  list.innerHTML = "";

  if (eventos.length === 0) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  eventos.forEach(evento => {
    const dataFormatada = formatarData(evento.data);

    // Gerar os cards de horário
    let horariosDisponiveis = "";
    if (Array.isArray(evento.opcoes_horarios)) {
      horariosDisponiveis = evento.opcoes_horarios
        .map(horario => {
          return `
            <div class="horario-card">
              <span class="horario">${horario}</span>
            </div>
          `;
        })
        .join(""); // Junta os cards sem vírgulas
    } else {
      horariosDisponiveis = evento.opcoes_horarios || "Horário não definido";
    }

    const card = `
      <div class="job-card">
        <div class="job-header">
          <h3 class="job-title">${evento.nome}</h3>
          <span class="job-status ${evento.status}">${evento.status}</span>
        </div>
        <p class="job-description">${evento.descricao || ""}</p>
        <div class="job-footer">
          <span><i class="fas fa-calendar" style="color: var(--primary-color); margin-right: 5px; margin-bottom:3px;"></i> <strong>Data:</strong> ${dataFormatada}</span>
          <span><i class="fas fa-clock" style="color: var(--primary-color); margin-right: 5px;"></i> <strong>Horários Disponíveis:</strong> <br>
            ${horariosDisponiveis}
          </span>
        </div>
      </div>
    `;

    grid.innerHTML += card;
    list.innerHTML += `<div class="job-list-item">${card}</div>`;
  });
}

function formatarData(data) {
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  const dataObj = new Date(data);

  return dataObj.toLocaleDateString('pt-BR', options).replace(/^(\d{2}) de/, '$1 de');
}
