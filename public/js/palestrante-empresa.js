import { buscarPerfil, buscarSolicitacoes, responderSolicitacao } from "../js/api/index.js";

document.addEventListener("DOMContentLoaded", async () => {
  const pendingContainer = document.getElementById("pendingSpeakers");
  const approvedContainer = document.getElementById("approvedSpeakers");
  const rejectedContainer = document.getElementById("rejectedSpeakers");

  const pendingCountEl = document.getElementById("pendingCount");
  const approvedCountEl = document.getElementById("approvedCount");
  const rejectedCountEl = document.getElementById("rejectedCount");
  const totalCountEl = document.getElementById("totalCount");

  async function carregarPerfilEmpresa() {
    const perfil = await buscarPerfil();
    if (!perfil) return;

    if (perfil) {
        // Atualizar nome
        document.querySelector("#user-profile-btn p").textContent =
        perfil.nome_empresa || perfil.nome;

        // Atualizar avatar (se tiver imagem)
        const avatar = document.querySelector("#user-profile-btn .user-avatar");
        if (perfil.logo) {
        avatar.innerHTML = `<img src="${perfil.logo}" alt="Foto de perfil" class="avatar-img">`;
        }
    }

    return perfil;
  }

  function renderizarSolicitacoes(solicitacoes) {
    // Limpa grids
    pendingContainer.innerHTML = "";
    approvedContainer.innerHTML = "";
    rejectedContainer.innerHTML = "";

    // Filtra por status
    const pendentes = solicitacoes.filter(s => s.status === "Pendente");
    const aprovados = solicitacoes.filter(s => s.status === "Aceito");
    const rejeitados = solicitacoes.filter(s => s.status === "Recusado");

    // Atualiza contadores das estatísticas e tabs
    pendingCountEl.textContent = pendentes.length;
    approvedCountEl.textContent = aprovados.length;
    rejectedCountEl.textContent = rejeitados.length;
    totalCountEl.textContent = solicitacoes.length;

    document.querySelector(".tab-button[data-tab='pending'] .tab-count").textContent = pendentes.length;
    document.querySelector(".tab-button[data-tab='approved'] .tab-count").textContent = aprovados.length;
    document.querySelector(".tab-button[data-tab='rejected'] .tab-count").textContent = rejeitados.length;

    // Renderiza os cards
    pendentes.forEach(s => criarCard(s, pendingContainer, true));
    aprovados.forEach(s => criarCard(s, approvedContainer, false));
    rejeitados.forEach(s => criarCard(s, rejectedContainer, false));
  }   


  function criarCard(solicitacao, container, permitirAcoes) {
    const card = document.createElement("div");
    card.className = "speaker-card";

    card.innerHTML = `
      <div class="speaker-info">
        <h4>${solicitacao.nome_palestrante}</h4>
        <p>${solicitacao.email_palestrante}</p>
      </div>
      <div class="speaker-actions"></div>
    `;

    const actions = card.querySelector(".speaker-actions");
    if (permitirAcoes) {
      const aceitarBtn = document.createElement("button");
      aceitarBtn.className = "button primary-button";
      aceitarBtn.textContent = "Aceitar";
      console.log(solicitacao.id_solicitacao)
      aceitarBtn.addEventListener("click", async () => {
        try {
          const data = await responderSolicitacao(solicitacao.id_solicitacao, true);
          alert(data.mensagem);
          init(); // recarrega as listas
        } catch (err) {
          alert(err.message);
        }
      });

      const recusarBtn = document.createElement("button");
      recusarBtn.className = "button outline-button";
      recusarBtn.textContent = "Recusar";
      recusarBtn.addEventListener("click", async () => {
        try {
          const data = await responderSolicitacao(solicitacao.id_solicitacao, false);
          alert(data.mensagem);
          init();
        } catch (err) {
          alert(err.message);
        }
      });

      actions.appendChild(aceitarBtn);
      actions.appendChild(recusarBtn);
    }

    container.appendChild(card);
  }

  // Tabs
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const tab = btn.dataset.tab;
      tabContents.forEach(c => c.classList.remove("active"));
      document.getElementById(`${tab}-content`).classList.add("active");
    });
  });

  // Busca
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    document.querySelectorAll(".speaker-card").forEach(card => {
      const nome = card.querySelector("h4").textContent.toLowerCase();
      card.style.display = nome.includes(term) ? "block" : "none";
    });
  });

  // Função de inicialização
  async function init() {
    const perfil = await carregarPerfilEmpresa();
    if (!perfil) return;
    const solicitacoes = await buscarSolicitacoes(perfil.id);
    renderizarSolicitacoes(solicitacoes);
  }

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();
    
    // percorre todas as grids
    [pendingContainer, approvedContainer, rejectedContainer].forEach(container => {
        container.querySelectorAll(".speaker-card").forEach(card => {
            const nome = card.querySelector("h4").textContent.toLowerCase();
            card.style.display = nome.includes(term) ? "block" : "none";
        });
    });
   });


  init();
});