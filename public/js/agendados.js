import { buscarPerfil, getEventos } from './api/index.js';
import { BASE_URL } from './api/config.js';

document.addEventListener("DOMContentLoaded", async () => {
  // --- Busca perfil da empresa e atualiza navbar ---
  const profileData = await buscarPerfil();
  if (profileData) {
    // Atualizar nome
    document.querySelector("#user-profile-btn p").textContent =
      profileData.nome_empresa || profileData.nome;

    // Atualizar avatar (se tiver imagem)
    const avatar = document.querySelector("#user-profile-btn .user-avatar");
    if (profileData.logo) {
      avatar.innerHTML = `<img src="${profileData.logo}" alt="Foto de perfil" class="avatar-img">`;
    }
  }

  // --- Busca eventos confirmados ---
  let events = [];
  try {
    events = await getEventos(); // se quiser, pode passar query: ?confirmado=true
    events = events
      .filter(e => e.periodo_escolhido) // apenas confirmados
      .map(e => ({
        ...e,
        date: new Date(e.data), // converte string para Date
      }));
  } catch (err) {
    console.error("Erro ao buscar eventos:", err);
  }

  // --- Calendar variables ---
  const currentDate = new Date();
  let selectedDate = new Date();

  renderCalendar();
  updateSelectedDayEvents();
  renderUpcomingEvents();

  // --- Função para renderizar calendário ---
  function renderCalendar() {
    const calendarEl = document.getElementById("calendar");

    const calendarHeader = document.createElement("div");
    calendarHeader.className = "calendar-header";

    const monthYear = document.createElement("div");
    monthYear.className = "calendar-title";
    monthYear.textContent = formatMonthYear(currentDate);

    const navButtons = document.createElement("div");
    navButtons.className = "calendar-nav";

    const prevButton = document.createElement("button");
    prevButton.className = "calendar-nav-btn";
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });

    const nextButton = document.createElement("button");
    nextButton.className = "calendar-nav-btn";
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });

    navButtons.appendChild(prevButton);
    navButtons.appendChild(nextButton);

    calendarHeader.appendChild(monthYear);
    calendarHeader.appendChild(navButtons);

    const calendarGrid = document.createElement("div");
    calendarGrid.className = "calendar-grid";

    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    dayNames.forEach(day => {
      const dayHeader = document.createElement("div");
      dayHeader.className = "calendar-day-header";
      dayHeader.textContent = day;
      calendarGrid.appendChild(dayHeader);
    });

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const dayEl = document.createElement("div");
      dayEl.className = "calendar-day other-month";
      dayEl.textContent = prevMonthDays - i;
      calendarGrid.appendChild(dayEl);
    }

    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const dayEl = document.createElement("div");
      dayEl.className = "calendar-day";
      dayEl.textContent = i;

      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);

      if (hasEventOnDay(dayDate)) dayEl.classList.add("has-event");

      if (
        today.getDate() === i &&
        today.getMonth() === currentDate.getMonth() &&
        today.getFullYear() === currentDate.getFullYear()
      ) {
        dayEl.classList.add("today");
      }

      if (
        selectedDate.getDate() === i &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear()
      ) {
        dayEl.classList.add("selected");
      }

      dayEl.addEventListener("click", () => {
        selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        renderCalendar();
        updateSelectedDayEvents();
      });

      calendarGrid.appendChild(dayEl);
    }

    const totalDaysDisplayed = firstDayOfMonth + daysInMonth;
    const nextMonthDays = 42 - totalDaysDisplayed;

    for (let i = 1; i <= nextMonthDays; i++) {
      const dayEl = document.createElement("div");
      dayEl.className = "calendar-day other-month";
      dayEl.textContent = i;
      calendarGrid.appendChild(dayEl);
    }

    calendarEl.innerHTML = "";
    calendarEl.appendChild(calendarHeader);
    calendarEl.appendChild(calendarGrid);
  }

  // --- Funções para verificar eventos ---
  function hasEventOnDay(day) {
    return events.some(
      event =>
        day.getDate() === event.date.getDate() &&
        day.getMonth() === event.date.getMonth() &&
        day.getFullYear() === event.date.getFullYear(),
    );
  }

  function getEventsForSelectedDay() {
    return events.filter(
      event =>
        selectedDate.getDate() === event.date.getDate() &&
        selectedDate.getMonth() === event.date.getMonth() &&
        selectedDate.getFullYear() === event.date.getFullYear(),
    );
  }

  // --- Atualiza eventos do dia selecionado ---
  async function updateSelectedDayEvents() {
    const selectedDateEl = document.getElementById("selected-date");
    const eventsContainer = document.getElementById("events-container");

    selectedDateEl.textContent = formatDate(selectedDate);

    const selectedDayEvents = getEventsForSelectedDay();
    eventsContainer.innerHTML = "";

    if (selectedDayEvents.length > 0) {
      for (const event of selectedDayEvents) {
        // Buscar endereço do evento
        let enderecoText = "";
        if (event.id_endereco) {
          try {
            const res = await fetch(`${BASE_URL}/endereco`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: event.id_endereco }),
            });
            if (res.ok) {
              const dadosEndereco = await res.json();
              if (dadosEndereco.length > 0) {
                const e = dadosEndereco[0];
                enderecoText = `${e.bairro}, ${e.cidade}/${e.estado}`;
              }
            }
          } catch (err) {
            console.error("Erro ao buscar endereço:", err);
          }
        }

        const eventItem = document.createElement("div");
        eventItem.className = "event-item";

        const eventHeader = document.createElement("div");
        eventHeader.className = "event-header";

        const eventInfo = document.createElement("div");
        eventInfo.className = "event-info";

        const eventTitle = document.createElement("h4");
        eventTitle.textContent = event.nome;

        const eventLocation = document.createElement("p");
        eventLocation.textContent = `${enderecoText}`;

        eventInfo.appendChild(eventTitle);
        eventInfo.appendChild(eventLocation);

        let tipo = (event.tipo == "visita_tecnica") ? "Visita Técnica" : "Palestra";
        (tipo != "") ? tipo : "Outro";
 
        const eventBadge = document.createElement("div");
        eventBadge.className = "event-badge";
        eventBadge.textContent = tipo;

        eventHeader.appendChild(eventInfo);
        eventHeader.appendChild(eventBadge);

        const eventActions = document.createElement("div");
        eventActions.className = "event-actions";

        const rateButton = document.createElement("button");
        rateButton.className = "button outline-button";
        rateButton.textContent = "Avaliar";
        rateButton.addEventListener("click", () => openRatingModal(event));

        eventActions.appendChild(rateButton);

        eventItem.appendChild(eventHeader);
        eventItem.appendChild(eventActions);

        eventsContainer.appendChild(eventItem);
      }
    } else {
      const noEvents = document.createElement("div");
      noEvents.className = "no-events";

      const calendarIcon = document.createElement("i");
      calendarIcon.className = "fas fa-calendar";

      const noEventsText = document.createElement("p");
      noEventsText.textContent = "Nenhum evento nesta data";

      noEvents.appendChild(calendarIcon);
      noEvents.appendChild(noEventsText);
      eventsContainer.appendChild(noEvents);
    }
  }


  // --- Renderiza próximos eventos ---
  function renderUpcomingEvents() {
    const upcomingEventsEl = document.getElementById("upcoming-events");
    const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
    upcomingEventsEl.innerHTML = "";

    sortedEvents.forEach(event => {
      const eventItem = document.createElement("div");
      eventItem.className = "upcoming-event";

      const eventDate = document.createElement("p");
      eventDate.className = "upcoming-event-date";
      eventDate.textContent = formatDateShort(event.date);

      const eventTitle = document.createElement("h4");
      eventTitle.className = "upcoming-event-title";
      eventTitle.textContent = event.title;

      const eventDetails = document.createElement("p");
      eventDetails.className = "upcoming-event-details";
      eventDetails.textContent = `${event.tipo} • ${event.localizacao || ''}`;

      eventItem.appendChild(eventDate);
      eventItem.appendChild(eventTitle);
      eventItem.appendChild(eventDetails);

      upcomingEventsEl.appendChild(eventItem);
    });
  }

  // --- Modal de avaliação ---
  const modal = document.getElementById("rating-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const submitRatingBtn = document.getElementById("submit-rating");
  const starButtons = document.querySelectorAll(".star-button");
  let currentRating = 0;
  let currentEvent = null;

  function openRatingModal(event) {
    currentEvent = event;
    currentRating = 0;

    starButtons.forEach(btn => {
      btn.classList.remove("active");
      btn.innerHTML = '<i class="far fa-star"></i>';
    });

    submitRatingBtn.disabled = true;

    document.getElementById("event-title").textContent = event.nome;
    document.getElementById("event-description").textContent = event.descricao || '';

    modal.style.display = "flex";
  }

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  starButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const rating = Number.parseInt(btn.getAttribute("data-rating"));
      currentRating = rating;

      starButtons.forEach((star, index) => {
        if (index < rating) {
          star.classList.add("active");
          star.innerHTML = '<i class="fas fa-star"></i>';
        } else {
          star.classList.remove("active");
          star.innerHTML = '<i class="far fa-star"></i>';
        }
      });

      submitRatingBtn.disabled = false;
    });
  });

  submitRatingBtn.addEventListener("click", () => {
    alert(`Evento "${currentEvent.title}" avaliado com ${currentRating} estrelas!`);
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  // --- Funções auxiliares ---
  function formatMonthYear(date) {
    const months = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  function formatDate(date) {
    const days = ["Domingo","Segunda-feira","Terça-feira","Quarta-feira","Quinta-feira","Sexta-feira","Sábado"];
    const months = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  }

  function formatDateShort(date) {
    const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    return `${date.getDate()} de ${months[date.getMonth()]}`;
  }
});
