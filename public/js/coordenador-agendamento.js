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

  let turmasDetalhadas = [];

  const STORAGE_KEY = "agendamentos";
  const agendamentos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];


  // ===========================================================
  // ------------------ FUNÇÕES DE ABRIR/FECHAR MODAL ----------
  // ===========================================================

  function abrirAgendarModal() {
    modal.style.display = "block";
  }

  function fecharAgendarModal() {
    modal.style.display = "none";
  }

  function abrirResumoModal() {
    resumoModal.style.display = "block";
  }

  function fecharResumoModal() {
    resumoModal.style.display = "none";
  }

  // --- Fechar clicando no X ---
  closeModal.addEventListener("click", fecharAgendarModal);
  closeResumo.addEventListener("click", fecharResumoModal);

  // --- Fechar clicando fora do modal ---
  window.addEventListener("click", (event) => {
    if (event.target === modal) fecharAgendarModal();
    if (event.target === resumoModal) fecharResumoModal();
  });

  // --- Fechar ao concluir ---
  function concluirAgendamento() {
    fecharAgendarModal();
  }


  // ===========================================================
  // ------------------ FUNÇÃO PARA CARREGAR PERFIL ------------
  // ===========================================================

  async function carregarPerfil() {
    try {
      const perfil = await buscarPerfil();
      if (perfil) {
        document.querySelector(".user-info p").textContent = perfil.nome;
      }
    } catch (err) {
      console.error("Erro ao buscar perfil:", err);
    }
  }


  // ===========================================================
  // ------------------ FUNÇÃO PARA CARREGAR EVENTOS -----------
  // ===========================================================

  async function carregarEventos() {
    try {
      const eventos = await getEventosLivres();
      eventsContainer.innerHTML = "";

      for (const evento of eventos) {

        let enderecoText = "";
        if (evento.id_endereco) {
          try {
            const res = await fetch(`${BASE_URL}/endereco`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: evento.id_endereco })
            });

            if (res.ok) {
              const dadosEndereco = await res.json();
              if (dadosEndereco.length > 0) enderecoText = dadosEndereco[0];
            }
          } catch (err) {
            console.error("Erro ao buscar endereço:", err);
          }
        }


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

        let tipo = (evento.tipo == "visita_tecnica") ? "Visita Técnica" : "Palestra";

        const card = templateCard.cloneNode(true);
        card.style.display = "block";

        card.querySelector(".agendar-event-title").textContent = evento.nome;
        card.querySelector(".agendar-event-description").textContent = evento.descricao;
        card.querySelector(".empresa-value").textContent = empresaNome;
        card.querySelector(".tipo-value").textContent = tipo;

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
          modalTitle.textContent = `Agendar ${tipo}`;
          abrirAgendarModal();  // <--- AGORA ABRE CORRETAMENTE
          resetModal();
          showCalendar();
        });

        eventsContainer.appendChild(card);
      }
    } catch (err) {
      console.error("Erro ao carregar eventos:", err);
    }
  }


  // ===========================================================
  // ------------------ FUNÇÕES DO MODAL ------------------------
  // ===========================================================

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
    availableDaysContainer.innerHTML = "";

    const dateObj = new Date(selectedEvent.data);

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

    availableDaysContainer.appendChild(dayDiv);
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


  // ===========================================================
  // ------------------ CARREGAR TURMAS -------------------------
  // ===========================================================

  async function showRooms() {
    availableRoomsContainer.innerHTML = "";
    turmasDetalhadas = [];
    selectedRooms = [];

    try {
      const token = localStorage.getItem("token");

      const resPerfil = await fetch(`${BASE_URL}/perfil`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const perfil = await resPerfil.json();

      const resSalas = await fetch(`${BASE_URL}/turmasByInstituicao/${perfil.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      const salas = resSalas.ok ? await resSalas.json() : [];

      turmasDetalhadas = await Promise.all(
        salas.map(async (sala) => {
          const resAlunos = await fetch(`${BASE_URL}/alunos/${sala}`);
          const alunos = resAlunos.ok ? await resAlunos.json() : [];

          return {
            nome: sala,
            alunos
          };
        })
      );

    } catch (err) {
      console.error("Erro ao buscar turmas:", err);
    }

    turmasDetalhadas.forEach(turma => {
      const btn = document.createElement("button");
      btn.textContent = turma.nome;
      btn.classList.add("room-btn");

      btn.addEventListener("click", () => {
        if (selectedRooms.includes(turma.nome)) {
          selectedRooms = selectedRooms.filter(t => t !== turma.nome);
          btn.classList.remove("selected");
        } else {
          selectedRooms.push(turma.nome);
          btn.classList.add("selected");
        }

        confirmarTurmasBtn.style.display = selectedRooms.length > 0 ? "block" : "none";
      });

      availableRoomsContainer.appendChild(btn);
    });

  }


  // ===========================================================
  // ------------------ CONFIRMAR EVENTO ------------------------
  // ===========================================================

  async function confirmarEvento(selectedEvent) {
    try {
      const resPerfil = await fetch(`${BASE_URL}/perfil`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const perfil = await resPerfil.json();

      if (!selectedRooms.length) {
        alert("Selecione ao menos uma turma");
        return;
      }

      if (!selectedHour) {
        alert("Selecione um horário");
        return;
      }

      let totalAlunos = 0;

      for (const nomeTurma of selectedRooms) {
        const turmaObj = turmasDetalhadas.find(t => t.nome === nomeTurma);
        if (turmaObj) totalAlunos += turmaObj.alunos.length;
      }

      const limite = selectedEvent.max_participantes;

      if (totalAlunos > limite) {
        alert(`⚠ LIMITE EXCEDIDO!\nMáximo: ${limite}\nTotal: ${totalAlunos}`);
        return;
      }

      const body = {
        id_evento: selectedEvent.id,
        id_coordenador: perfil.id,
        status: "aceito",
        horario: selectedHour,
        observacao: document.getElementById("observacao")?.value || null,
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

      // FECHA O MODAL E ABRE O RESUMO
      concluirAgendamento();

    } catch (err) {
      console.error("Erro ao confirmar evento:", err);
      alert("Erro: " + err.message);
    }
  }

  confirmarTurmasBtn.addEventListener("click", () => {
    confirmarEvento(selectedEvent);
  });


  // ===========================================================
  // ------------------------ INICIAR ---------------------------
  // ===========================================================

  await carregarPerfil();
  await carregarEventos();
});
