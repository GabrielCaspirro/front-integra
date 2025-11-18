import { buscarPerfil, getEventos, getEventosEmpresa } from './api/index.js';
import { BASE_URL, BASE_URL_IMG } from './api/config.js';

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
      avatar.innerHTML = `<img src="${BASE_URL_IMG}${profileData.logo}" alt="Foto de perfil" class="avatar-img" style="width:40px;height:40px;border-radius:50%;">`;
    }
  } catch (err) {
    console.error('Erro ao buscar perfil:', err);
  }

  // --- EVENTOS ---
  let events = [];
  try {
    events = await getEventos(); // se quiser, pode passar query: ?confirmado=true
    events = events
      .filter(e => e.periodo_escolhido) // apenas confirmados
      .map(e => ({
        ...e,
        date: e.data ? new Date(e.data) : (e.date ? new Date(e.date) : new Date()),
      }));
  } catch (err) {
    console.error('Erro ao buscar eventos:', err);
  }

  // --- ELEMENTOS DOM ---
  const calendarEl = document.getElementById('calendar');
  const eventsContainer = document.getElementById('events-container');
  const template = document.getElementById('event-template');
  const selectedDateEl = document.getElementById('selected-date');

  const currentDate = new Date();
  let calendarDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  let selectedDate = new Date();

  renderCalendar();
  updateSelectedDayEvents();

  // ---------- RENDER CALENDÁRIO ----------
  function renderCalendar() {
    if (!calendarEl) return;

    const header = document.createElement('div');
    header.className = 'calendar-header';

    const monthTitle = document.createElement('div');
    monthTitle.className = 'calendar-title';
    monthTitle.textContent = formatMonthYear(calendarDate);

    const nav = document.createElement('div');
    nav.className = 'calendar-nav';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'calendar-nav-btn';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.addEventListener('click', () => {
      calendarDate.setMonth(calendarDate.getMonth() - 1);
      renderCalendar();
    });

    const nextBtn = document.createElement('button');
    nextBtn.className = 'calendar-nav-btn';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.addEventListener('click', () => {
      calendarDate.setMonth(calendarDate.getMonth() + 1);
      renderCalendar();
    });

    nav.appendChild(prevBtn);
    nav.appendChild(nextBtn);
    header.appendChild(monthTitle);
    header.appendChild(nav);

    const grid = document.createElement('div');
    grid.className = 'calendar-grid';

    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    dayNames.forEach(d => {
      const dh = document.createElement('div');
      dh.className = 'calendar-day-header';
      dh.textContent = d;
      grid.appendChild(dh);
    });

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const d = document.createElement('div');
      d.className = 'calendar-day other-month';
      d.textContent = prevMonthDays - i;
      grid.appendChild(d);
    }

    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const dEl = document.createElement('div');
      dEl.className = 'calendar-day';
      dEl.textContent = day;

      const dDate = new Date(year, month, day);

      if (hasEventOnDay(dDate)) dEl.classList.add('has-event');

      if (
        today.getDate() === day &&
        today.getMonth() === month &&
        today.getFullYear() === year
      ) {
        dEl.classList.add('today');
      }

      if (
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year
      ) {
        dEl.classList.add('selected');
      }

      dEl.addEventListener('click', () => {
        selectedDate = new Date(year, month, day);
        renderCalendar();
        updateSelectedDayEvents();
      });

      grid.appendChild(dEl);
    }

    const totalDisplayed = firstDayOfMonth + daysInMonth;
    const nextFill = 42 - totalDisplayed;
    for (let i = 1; i <= nextFill; i++) {
      const d = document.createElement('div');
      d.className = 'calendar-day other-month';
      d.textContent = i;
      grid.appendChild(d);
    }

    calendarEl.innerHTML = '';
    calendarEl.appendChild(header);
    calendarEl.appendChild(grid);
  }

  // ---------- VERIFICAÇÃO DE EVENTOS ----------
  function hasEventOnDay(day) {
    return events.some(ev =>
      ev.date &&
      ev.date.getDate() === day.getDate() &&
      ev.date.getMonth() === day.getMonth() &&
      ev.date.getFullYear() === day.getFullYear()
    );
  }

  function getEventsForSelectedDay() {
    return events.filter(ev =>
      ev.date &&
      ev.date.getDate() === selectedDate.getDate() &&
      ev.date.getMonth() === selectedDate.getMonth() &&
      ev.date.getFullYear() === selectedDate.getFullYear()
    );
  }

  // ---------- ATUALIZA OS CARDS DO DIA SELECIONADO ----------
  async function updateSelectedDayEvents() {
    if (selectedDateEl) selectedDateEl.textContent = formatDate(selectedDate);
    if (!eventsContainer) return;

    eventsContainer.innerHTML = '';

    const dayEvents = getEventsForSelectedDay();
    if (!dayEvents.length) {
      const noEvents = document.createElement('div');
      noEvents.className = 'no-events';
      noEvents.innerHTML = `<i class="fas fa-calendar"></i><p>Nenhum evento nesta data</p>`;
      eventsContainer.appendChild(noEvents);
      return;
    }

    for (const ev of dayEvents) {
      let enderecoText = ev.localizacao || '';
      if (!enderecoText && ev.id_endereco) {
        try {
          const res = await fetch(`${BASE_URL}/endereco`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: ev.id_endereco }),
          });
          if (res.ok) {
            const dados = await res.json();
            if (Array.isArray(dados) && dados.length > 0) {
              const e = dados[0];
              enderecoText = `${e.bairro || ''}${e.bairro && e.cidade ? ', ' : ''}${e.cidade || ''}${e.estado ? '/' + e.estado : ''}`.trim();
            }
          }
        } catch (err) {
          console.error('Erro ao buscar endereço:', err);
        }
      }

      let card;
      if (template && template.content && template.content.firstElementChild) {
        card = template.content.firstElementChild.cloneNode(true);
      } else {
        card = document.createElement('div');
        card.className = 'event-item';
      }

      const nameEl = card.querySelector('.event-nome');
      const typeEl = card.querySelector('.tipo');
      const locEl = card.querySelector('.event-local-text');
      const dateEl = card.querySelector('.event-date-text');
      const descEl = card.querySelector('.event-description-text');

      if (nameEl) nameEl.textContent = ev.nome || ev.title || 'Evento';
      if (typeEl) {
        const tipoTexto =
          ev.tipo === 'visita_tecnica' ? 'Visita Técnica' :
            ev.tipo === 'palestra' ? 'Palestra' :
              ev.tipo === 'visita' ? 'Visita' : 'Outro';
        typeEl.textContent = tipoTexto;
      }
      if (descEl) descEl.textContent = ev.descricao || 'Sem descrição disponível.';
      if (locEl) locEl.textContent = enderecoText || 'Local não informado';
      if (dateEl) dateEl.textContent = ev.date ? formatDateShort(ev.date) : 'Data não informada';

      eventsContainer.appendChild(card);
    }
  }

  // ---------- FORMATAÇÕES ----------
  function formatMonthYear(date) {
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  function formatDate(date) {
    const days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  }

  // formato: 09 out. 2025
  function formatDateShort(date) {
    const months = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];
    const day = String(date.getDate()).padStart(2, '0');
    return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }
});
