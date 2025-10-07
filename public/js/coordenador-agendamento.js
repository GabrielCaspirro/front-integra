import { getEventosLivres, buscarPerfil } from '../js/api/index.js';
import { BASE_URL } from '../js/api/config.js';

document.addEventListener("DOMContentLoaded", async () => {
  const eventsContainer = document.getElementById("agendar-events-container");
  const templateCard = document.querySelector(".agendar-event-card");

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

  let selectedEvent = null;
  let selectedDay = null;
  let selectedHour = null;
  let selectedRooms = [];

  const STORAGE_KEY = "agendamentos";
  const agendamentos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  // ------------------ FUNÇÃO PARA CARREGAR PERFIL ------------------
  async function carregarPerfil() {
    try {
      const perfil = await buscarPerfil();
      console.log(perfil)
      if (perfil) {
        document.querySelector(".user-info p").textContent = perfil.nome;
      }
    } catch (err) {
      console.error("Erro ao buscar perfil:", err);
    }
  }

  // ------------------ FUNÇÃO PARA CARREGAR EVENTOS ------------------
  async function carregarEventos() {
    try {
      const eventos = await getEventosLivres();
      eventsContainer.innerHTML = "";

      for (const evento of eventos) {
        // Buscar endereço
        let enderecoText = "";
        if (evento.id_endereco) {
          try {
            const res = await fetch(`${BASE_URL}/endereco`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: evento.id_endereco }),
            });
            if (res.ok) {
              const dadosEndereco = await res.json();
              if (dadosEndereco.length > 0) {
                const e = dadosEndereco[0];
                enderecoText = {
                  rua: e.rua || "",
                  bairro: e.bairro || "",
                  numero: e.numero || "",
                  cidade: e.cidade || "",
                  cep: e.cep || ""
                };
              }
            }
          } catch (err) {
            console.error("Erro ao buscar endereço:", err);
          }
        }

        // Buscar nome da empresa
        let empresaNome = "Não informado";
        if (evento.id_empresa) {
          try {
            const res = await fetch(`${BASE_URL}/empresaById/${evento.id_empresa}`);
            if (res.ok) {
              const dadosEmpresa = await res.json();
              if (dadosEmpresa.length > 0) empresaNome = dadosEmpresa[0].nome;
            }
          } catch (err) {
            console.error("Erro ao buscar empresa:", err);
          }
        }

        let tipo;
        (evento.tipo == "visita_tecnica") ? tipo = "Visita Técnica" : tipo = "Palestra";

        // Clonar template e popular dados
        const card = templateCard.cloneNode(true);
        card.style.display = "block";
        card.querySelector(".agendar-event-title").textContent = evento.nome || "Evento";
        card.querySelector(".agendar-event-description").textContent = evento.descricao || "";
        card.querySelector(".empresa-value").textContent = empresaNome;
        card.querySelector(".tipo-value").textContent = tipo || "";

        if (enderecoText) {
          card.querySelector(".rua-value").textContent = enderecoText.rua;
          const bairroValues = card.querySelectorAll(".bairro-value, .numero-value");
          bairroValues[0].textContent = enderecoText.bairro;
          bairroValues[1].textContent = enderecoText.numero;
          const cidadeValues = card.querySelectorAll(".cidade-value, .cep-value");
          cidadeValues[0].textContent = enderecoText.cidade;
          cidadeValues[1].textContent = enderecoText.cep;
        }

        const valorValues = card.querySelectorAll(".valor-value");
        valorValues[0].textContent = evento.valor === 0 ? "Gratuito" : `R$ ${evento.valor}`;

        card.querySelector(".agendar-event-btn").addEventListener("click", () => {
          selectedEvent = evento;
          modalTitle.textContent = `Agendar ${evento.tipo}`;
          modal.style.display = "block";
          resetModal();
          showCalendar();
        });

        eventsContainer.appendChild(card);
      }
    } catch (err) {
      console.error("Erro ao carregar eventos:", err);
    }
  }

  // ------------------ FUNÇÕES DO MODAL ------------------
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

  function showCalendar() {
    stepDays.style.display = "block";
    availableDaysContainer.innerHTML = "";

    const header = document.createElement("div");
    header.classList.add("calendar-header");
    header.textContent = "Escolha um dia disponível";
    availableDaysContainer.appendChild(header);

    const body = document.createElement("div");
    body.classList.add("calendar-body");
    body.style.display = "flex";
    body.style.gap = "0.5rem";

    const rawDate = selectedEvent.data;
    const dateObj = new Date(rawDate);

    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();

    const dayStr = `${year}-${month}-${day}`;
    const displayStr = `${day}/${month}/${year}`;

    const dayDiv = document.createElement("div");
    dayDiv.textContent = displayStr;
    dayDiv.classList.add("calendar-day-available");

    dayDiv.addEventListener("click", () => {
      selectedDay = dayStr;
      stepDays.style.display = "none";
      stepHours.style.display = "block";
      showHours();
    });

    body.appendChild(dayDiv);
    availableDaysContainer.appendChild(body);
  }

  function showHours() {
    availableHoursContainer.innerHTML = "";

    const horarios = selectedEvent.opcoes_horarios || [];
    horarios.forEach(hour => {
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

  async function showRooms() {
    availableRoomsContainer.innerHTML = "";
    let turmas = [];

    try {
        const token = localStorage.getItem("token");
        const resPerfil = await fetch(`${BASE_URL}/perfil`, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        });
        let perfil = null;
        if (resPerfil.ok) perfil = await resPerfil.json();

        if (perfil && perfil.id) {
            const resTurmas = await fetch(`${BASE_URL}/turmasByInstituicao/${perfil.id}`, {
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            });
            if (resTurmas.ok) turmas = await resTurmas.json();
        }
    } catch (err) {
        console.error("Erro ao buscar turmas:", err);
    }

    const selectedRoomsSet = new Set(selectedRooms);

    turmas.forEach(room => {
        const btn = document.createElement("button");
        btn.textContent = room;
        btn.classList.add("room-btn");
        if (selectedRoomsSet.has(room)) btn.classList.add("selected");
        btn.addEventListener("click", () => {
            if (selectedRoomsSet.has(room)) selectedRoomsSet.delete(room);
            else selectedRoomsSet.add(room);
            btn.classList.toggle("selected");
            confirmarTurmasBtn.style.display = selectedRoomsSet.size > 0 ? "block" : "none";
            selectedRooms = Array.from(selectedRoomsSet); // mantém a lista atualizada
        });
        availableRoomsContainer.appendChild(btn);
    });

    confirmarTurmasBtn.style.display = selectedRooms.length > 0 ? "block" : "none";
  }


  function openResumoModal() {
    if (!selectedEvent || !selectedDay || !selectedHour || selectedRooms.length === 0) return;
    const [ano, mes, dia] = selectedDay.split("-");
    document.getElementById("resumo-titulo").textContent = selectedEvent.nome;
    document.getElementById("resumo-data").textContent = `${dia}/${mes}/${ano}`;
    document.getElementById("resumo-hora").textContent = selectedHour;
    document.getElementById("resumo-turmas").textContent = selectedRooms.join(", ");
    resumoModal.style.display = "block";
  }

  closeModal.addEventListener("click", () => { modal.style.display = "none"; resetModal(); });
  closeResumo.addEventListener("click", () => { resumoModal.style.display = "none"; });
  window.addEventListener("click", e => {
    if (e.target === modal) { modal.style.display = "none"; resetModal(); }
    if (e.target === resumoModal) { resumoModal.style.display = "none"; }
  });

  // ------------------ CONFIRMAR EVENTO ------------------
  async function confirmarEvento(selectedEvent) {
    try {
        const resPerfil = await fetch(`${BASE_URL}/perfil`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        if (!resPerfil.ok) throw new Error("Erro ao buscar perfil do coordenador");
        const perfil = await resPerfil.json();

        // Usar selectedRooms diretamente
        if (!selectedRooms || selectedRooms.length === 0) {
            alert("Selecione ao menos uma turma");
            return;
        }

        if (!selectedHour) {
            alert("Selecione um horário");
            return;
        }

        const observacao = document.getElementById("observacao")?.value || null;

        const body = {
            id_evento: selectedEvent.id,
            id_coordenador: perfil.id,
            status: "aceito",
            horario: selectedHour,
            observacao: observacao,
            turmas: selectedRooms.join(",")
        };

        const res = await fetch(`${BASE_URL}/evento-relacao`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const erro = await res.json();
            throw new Error(erro.erro || "Erro ao vincular evento");
        }

        const data = await res.json();
        alert("Evento confirmado com sucesso!");
        console.log(data);

        stepRooms.style.display = "none";
    } catch (err) {
        console.error("Erro ao confirmar evento:", err);
        alert("Erro ao confirmar evento: " + err.message);
    }
}


  // ------------------ LISTENER BOTÃO CONFIRMAR ------------------
  confirmarTurmasBtn.addEventListener("click", () => {
        if (!selectedEvent) {
            alert("Nenhum evento selecionado");
            return;
        }
        if (selectedRooms.length === 0) {
            alert("Selecione pelo menos uma turma!");
            return;
        }
        confirmarEvento(selectedEvent); // usa a variável já atualizada
    });


  // ---------- INICIAR ----------
  await carregarPerfil();
  await carregarEventos();
});
