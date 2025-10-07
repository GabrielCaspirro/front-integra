import { buscarPerfil } from '../js/api/index.js';
import { BASE_URL } from '../js/api/config.js';

document.addEventListener("DOMContentLoaded", async () => {
  const selectedDateEl = document.getElementById("selected-date");
  const eventsContainer = document.getElementById("events-container");

  let eventos = [];
  let perfil = null;

  // ------------------ CARREGAR PERFIL ------------------
  async function carregarPerfil() {
    try {
      perfil = await buscarPerfil();
      const userProfileP = document.querySelector("#user-profile-btn p");
      if (userProfileP) userProfileP.textContent = perfil.nome;
    } catch (err) {
      console.error("Erro ao buscar perfil:", err);
    }
  }

  // ------------------ CARREGAR EVENTOS CONFIRMADOS ------------------
  async function carregarEventos() {
    if (!perfil || !perfil.id) return;
    try {
      const res = await fetch(`${BASE_URL}/eventos-confirmados-coordenador/${perfil.id}`);
      if (!res.ok) throw new Error("Erro ao buscar eventos");
      eventos = await res.json();

      eventos = eventos.map(e => ({
        ...e,
        tipo: e.tipo,
        data_formatada: e.data.slice(0, 10),
      }));

      montarCalendario();
    } catch (err) {
      console.error("Erro ao carregar eventos:", err);
    }
  }

  // ------------------ MONTAR CALENDÁRIO ------------------
  function montarCalendario() {
    const calendarEl = document.getElementById("calendar");
    calendarEl.innerHTML = "";

    const datas = [...new Set(eventos.map(e => e.data_formatada))].sort();

    datas.forEach(data => {
      const dateObj = new Date(data);
      const dia = String(dateObj.getDate()).padStart(2, "0");
      const mes = String(dateObj.getMonth() + 1).padStart(2, "0");
      const ano = dateObj.getFullYear();
      const displayStr = `${dia}/${mes}/${ano}`;

      const btn = document.createElement("button");
      btn.textContent = displayStr;
      btn.classList.add("coord-calendar-day");

      btn.addEventListener("click", () => {
        selectedDateEl.textContent = displayStr;
        mostrarEventosDoDia(data);
      });

      calendarEl.appendChild(btn);
    });
  }

  // ------------------ MOSTRAR EVENTOS DE UMA DATA ------------------
  function mostrarEventosDoDia(dataSelecionada) {
    eventsContainer.innerHTML = "";
    const eventosDia = eventos.filter(e => e.data_formatada === dataSelecionada);

    if (eventosDia.length === 0) {
      eventsContainer.innerHTML = `<p class="coord-no-events">Nenhum evento nesta data.</p>`;
      return;
    }

    eventosDia.forEach(e => {
      const eventItem = document.createElement("div");
      eventItem.classList.add("coord-event-card");

      eventItem.innerHTML = `
        <div class="coord-event-header">
          <h3 class="coord-event-title">${e.nome}</h3>
          <span class="coord-event-type">${e.tipo}</span>
        </div>

        <div class="coord-event-info">
          <span class="coord-label">Horário:</span>
          <span>${e.horario_escolhido || ""}</span>
        </div>

        <div class="coord-event-info">
          <span class="coord-label">Valor:</span>
          <span>${e.valor === "0.00" ? "Gratuito" : `R$ ${e.valor}`}</span>
        </div>

        <div class="coord-event-info">
          <span class="coord-label">Turmas:</span>
          <span>${e.turmas || ""}</span>
        </div>

        <div class="coord-event-description">
          ${e.descricao || ""}
        </div>
      `;

      eventsContainer.appendChild(eventItem);
    });
  }

  // ---------- INICIAR ----------  
  await carregarPerfil();
  if (perfil) await carregarEventos();
});
