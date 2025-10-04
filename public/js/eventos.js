import { getEventos } from "../js/api/index.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const eventos = await getEventos();
    const grid = document.getElementById("listaEventos");

    if (!grid) return;

    grid.innerHTML = "";

    // ✅ Pegar os 3 últimos eventos (mais recentes primeiro)
    const ultimosEventos = [...eventos].reverse().slice(0, 3);

    ultimosEventos.forEach((evt, i) => {
      const card = document.createElement("div");
      card.classList.add("event-card", "animate-on-scroll", `stagger-${(i % 3) + 1}`);

      // Definir ícone conforme tipo do evento
      const tipoIcone =
        evt.tipo === "palestra"
          ? "fa-chalkboard-teacher"
          : evt.tipo === "visita_tecnica"
            ? "fa-building"
            : "fa-calendar";

      // Criar estrutura do card
      card.innerHTML = `
        <div class="event-type">
          <i class="fas ${tipoIcone}"></i>
          <span>${evt.tipo === "palestra" ? "Palestra" : "Visita Técnica"}</span>
        </div>
        <h3 class="event-title">${evt.nome}</h3>
        <p class="event-date">Data: ${evt.data}</p>
        <button class="button outline-button">Ver Detalhes</button>
      `;

      grid.appendChild(card);
    });
  } catch (err) {
    console.error("Erro ao carregar eventos:", err);
  }
});
