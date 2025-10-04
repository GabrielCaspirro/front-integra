document.addEventListener("DOMContentLoaded", () => {

    // ---------- ELEMENTOS DOM ----------
    const eventsContainer = document.getElementById("agendar-events-container");
    const modal = document.getElementById("agendar-modal");
    const closeModal = modal.querySelector(".close-modal");
    const stepDays = document.getElementById("step-days");
    const stepHours = document.getElementById("step-hours");
    const stepRooms = document.getElementById("step-rooms");
    const availableDaysContainer = document.getElementById("available-days");
    const availableHoursContainer = document.getElementById("available-hours");
    const availableRoomsContainer = document.getElementById("available-rooms");
    const modalTitle = document.getElementById("modal-event-title");
    const confirmarTurmasBtn = document.getElementById("confirmar-turmas");

    const resumoModal = document.getElementById("resumo-modal");
    const closeResumo = resumoModal.querySelector(".close-resumo");

    // ---------- DADOS (EVENTOS) ----------
    const events = [
        {
            title: "Programação em Python",
            description: "Aprenda fundamentos de Python aplicados a projetos reais.",
            empresa: "TechCorp",
            type: "Workshop",
            street: "Rua da Tecnologia",
            bairro: "Centro",
            numero: "123",
            cidade: "São Paulo",
            cep: "01234-000",
            price: 70,
            vacancies: 20,
            availableDays: ["2025-10-10", "2025-10-11", "2025-10-12"],
            availableHoursPerDay: {
                "2025-10-10": ["08:00 - 10:00", "10:00 - 12:00"],
                "2025-10-11": ["08:00 - 10:00", "10:00 - 12:00", "14:00 - 16:00"],
                "2025-10-12": ["08:00 - 10:00", "10:00 - 12:00"]
            },
            availableRooms: ["1°A", "2°A", "2°B", "3°B", "1°C", "2°C", "3°C", "1°F", "2°F", "1°I", "3°I"]
        },
        {
            title: "Workshop de Inteligência Artificial",
            description: "Introdução prática à IA e Machine Learning.",
            empresa: "FinanceHub",
            type: "Palestra",
            street: "Av. Inovação",
            bairro: "Copacabana",
            numero: "456",
            cidade: "São Paulo",
            cep: "22000-000",
            price: 100,
            vacancies: 15,
            availableDays: ["2025-09-21", "2025-09-22"],
            availableHoursPerDay: {
                "2025-09-21": ["14:00", "16:00"],
                "2025-09-22": ["14:00"]
            },
            availableRooms: ["1°A", "2°A", "2°B", "3°B", "1°C", "2°C", "3°C", "1°F", "2°F", "1°I", "3°I"]
        }
    ];

    // ---------- LOCAL STORAGE ----------
    const STORAGE_KEY = "agendamentos";
    const agendamentos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // ---------- VARIÁVEIS MODAL ----------
    let selectedEvent = null;
    let selectedDay = null;
    let selectedHour = null;
    let selectedRooms = [];

    // ---------- FUNÇÕES ----------

    // Resetar modal para a primeira etapa
    function resetModal() {
        selectedDay = null;
        selectedHour = null;
        selectedRooms = [];
        stepDays.style.display = "block";
        stepHours.style.display = "none";
        stepRooms.style.display = "none";
        availableDaysContainer.innerHTML = "";
        availableHoursContainer.innerHTML = "";
        availableRoomsContainer.innerHTML = "";
        confirmarTurmasBtn.style.display = "none";
    }

    // Popular cards de eventos
    function populateEvents() {
        const templateCard = document.querySelector(".agendar-event-card");
        events.forEach(event => {
            const card = templateCard.cloneNode(true);
            card.style.display = "block";

            card.querySelector(".agendar-event-title").textContent = event.title;
            card.querySelector(".agendar-event-description").textContent = event.description;

            const details = card.querySelectorAll(".agendar-event-details");
            details[0].querySelector(".value").textContent = event.empresa;
            details[1].querySelector(".value").textContent = event.type;
            details[2].querySelector(".value").textContent = event.street;
            const bairroValues = details[3].querySelectorAll(".value");
            bairroValues[0].textContent = event.bairro;
            bairroValues[1].textContent = event.numero;
            const cidadeValues = details[4].querySelectorAll(".value");
            cidadeValues[0].textContent = event.cidade;
            cidadeValues[1].textContent = event.cep;
            const valorValues = details[5].querySelectorAll(".value");
            valorValues[0].textContent = event.price === 0 ? "Gratuito" : `R$ ${event.price.toFixed(2)}`;
            valorValues[1].textContent = event.vacancies;

            card.querySelector(".agendar-event-btn").addEventListener("click", () => {
                selectedEvent = event;
                modalTitle.textContent = `Agendar ${event.type}`;
                modal.style.display = "block";
                resetModal();
                showCalendar();
            });

            eventsContainer.appendChild(card);
        });
    }

    // Mostrar calendário de dias disponíveis
    function showCalendar() {
        stepDays.style.display = "block";
        availableDaysContainer.innerHTML = "";

        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();
        const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

        const header = document.createElement("div");
        header.classList.add("calendar-header");
        header.textContent = `${monthNames[month]} ${year}`;
        availableDaysContainer.appendChild(header);

        const weekHeader = document.createElement("div");
        weekHeader.classList.add("calendar-weekdays");
        daysOfWeek.forEach(d => {
            const wd = document.createElement("div");
            wd.textContent = d;
            weekHeader.appendChild(wd);
        });
        availableDaysContainer.appendChild(weekHeader);

        const body = document.createElement("div");
        body.classList.add("calendar-body");

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement("div");
            empty.classList.add("calendar-day-empty");
            body.appendChild(empty);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement("div");
            const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dayDiv.textContent = day;

            if (selectedEvent.availableDays.includes(dayStr)) {
                dayDiv.classList.add("calendar-day-available");
                dayDiv.addEventListener("click", () => {
                    selectedDay = dayStr;
                    stepDays.style.display = "none";
                    stepHours.style.display = "block";
                    showHours();
                });
            } else {
                dayDiv.classList.add("calendar-day-unavailable");
            }

            body.appendChild(dayDiv);
        }

        availableDaysContainer.appendChild(body);
    }

    // Mostrar horários disponíveis
    function showHours() {
        availableHoursContainer.innerHTML = "";
        const hours = selectedEvent.availableHoursPerDay[selectedDay] || [];
        hours.forEach(hour => {
            const btn = document.createElement("button");
            btn.textContent = hour;
            btn.addEventListener("click", () => {
                selectedHour = hour;
                stepHours.style.display = "none";
                stepRooms.style.display = "block";
                showRooms();
            });
            availableHoursContainer.appendChild(btn);
        });
    }

    // Mostrar turmas disponíveis
    function showRooms() {
        availableRoomsContainer.innerHTML = "";
        const selectedRoomsSet = new Set();

        selectedEvent.availableRooms.forEach(room => {
            const btn = document.createElement("button");
            btn.textContent = room;
            btn.classList.add("room-btn");
            btn.addEventListener("click", () => {
                if (selectedRoomsSet.has(room)) {
                    selectedRoomsSet.delete(room);
                    btn.classList.remove("selected");
                } else {
                    selectedRoomsSet.add(room);
                    btn.classList.add("selected");
                }
                confirmarTurmasBtn.style.display = selectedRoomsSet.size > 0 ? "block" : "none";
            });
            availableRoomsContainer.appendChild(btn);
        });

        // Botão Confirmar Turmas
        confirmarTurmasBtn.onclick = () => {
            if (selectedRoomsSet.size === 0) {
                alert("Selecione pelo menos uma turma!");
                return;
            }

            selectedRooms = Array.from(selectedRoomsSet);

            agendamentos.push({
                title: selectedEvent.title,
                day: selectedDay,
                hour: selectedHour,
                rooms: selectedRooms
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(agendamentos));

            modal.style.display = "none";
            openResumoModal();
            resetModal();
        };
    }

    // Abrir modal resumo
    function openResumoModal() {
        if (!selectedEvent || !selectedDay || !selectedHour || selectedRooms.length === 0) return;

        const [ano, mes, dia] = selectedDay.split("-");
        document.getElementById("resumo-titulo").textContent = selectedEvent.title;
        document.getElementById("resumo-data").textContent = `${dia}/${mes}/${ano}`;
        document.getElementById("resumo-hora").textContent = selectedHour;
        document.getElementById("resumo-turmas").textContent = selectedRooms.join(", ");
        resumoModal.style.display = "block";
    }

    // ---------- EVENTOS DE FECHAMENTO ----------
    closeModal.addEventListener("click", () => { modal.style.display = "none"; resetModal(); });
    closeResumo.addEventListener("click", () => { resumoModal.style.display = "none"; });
    window.addEventListener("click", e => {
        if (e.target === modal) { modal.style.display = "none"; resetModal(); }
        if (e.target === resumoModal) { resumoModal.style.display = "none"; }
    });

    // ---------- INICIAR ----------
    populateEvents();

});
