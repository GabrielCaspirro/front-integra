import { getEventos } from "../js/api/index.js";

document.addEventListener("DOMContentLoaded", async () => {
  const eventos = await getEventos();
  const grid = document.getElementById("listaEventos");

  if (grid) {
    grid.innerHTML = "";
    eventos.forEach((evt, i) => {
      const card = document.createElement("div");
      card.classList.add("event-card", "animate-on-scroll", `stagger-${(i % 3) + 1}`);

      card.innerHTML = `
        <div class="event-type">
          <i class="fas ${evt.tipo === 'palestra' ? 'fa-chalkboard-teacher' : evt.tipo === 'visita_tecnica' ? 'fa-building' : 'fa-calendar'}"></i>
          <span>${evt.tipo == 'palestra' ? 'Palestra' : 'Visita Técnica'}</span>
        </div>
        <h3 class="event-title">${evt.nome}</h3>
        <p class="event-date">Data: ${evt.data}</p>
        <button class="button outline-button">Ver Detalhes</button>
      `;
      grid.appendChild(card);
    });
  }
});