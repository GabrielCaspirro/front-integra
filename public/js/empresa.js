import {
  getEmpresas,
  buscarPerfil,
  getEventosEmpresa,
  getEventosConfirmadosEmpresa,
  buscarSolicitacoes
} from "../js/api/index.js";
import { BASE_URL_IMG } from "./api/config.js";

// =========================
// 🔹 LISTAR EMPRESAS (máx. 4)
// =========================
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const empresas = await getEmpresas();
    const grid = document.getElementById("listaEmpresas");

    grid.innerHTML = "";

    // Exibir no máximo 4 empresas
    empresas.slice(0, 4).forEach(emp => {
      const card = document.createElement("div");
      card.classList.add("partner-card");
      card.setAttribute("data-category", emp.categoria || "outros");

      card.innerHTML = `
        <div class="partner-logo">
          <img src="${emp.logo ? `${BASE_URL_IMG}${emp.logo}` : 'img/logo.png'}" alt="${emp.nome}">
        </div>
        <div class="partner-info">
          <h3>${emp.nome}</h3>
          <p>${emp.descricao || ''}</p>
        </div>
      `;

      grid.appendChild(card);
    });
  } catch (err) {
    console.error("Erro ao carregar empresas:", err);
  }
});

// =========================
// 🔹 PERFIL DA EMPRESA LOGADA
// =========================
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const usuario = await buscarPerfil();

    if (usuario) {
      // Atualiza nome da empresa
      const empresaNome = document.getElementById("empresaNome");
      const nomeEmpresa = document.getElementById("nomeEmpresa");

      if (empresaNome) empresaNome.textContent = usuario.nome;
      if (nomeEmpresa) nomeEmpresa.textContent = usuario.nome;

      // Atualiza foto de perfil
      const userAvatar = document.querySelector(".user-avatar i");
      if (userAvatar && usuario.logo) {
        userAvatar.outerHTML = `
          <img src="${BASE_URL_IMG}${usuario.logo}" alt="Avatar" class="avatar-img">
        `;
      }

      // =========================
      // 🔹 EVENTOS DISPONÍVEIS E CONFIRMADOS
      // =========================
      const eventosDisponiveis = await getEventosEmpresa(usuario.id);
      const eventosAgendados = await getEventosConfirmadosEmpresa(usuario.id);

      const statCards = document.querySelectorAll(".stat-card h3");
      if (statCards.length >= 4) {
        statCards[0].textContent = eventosDisponiveis.length;
        statCards[1].textContent = eventosAgendados.length;
      }

      // =========================
      // 🔹 SOLICITAÇÕES DE PALESTRANTES
      // =========================
      const solicitacoes = await buscarSolicitacoes(usuario.id);

      const palestrantesVinculados = solicitacoes.filter(s => s.status === "Aceito").length;
      const palestrantesPendentes = solicitacoes.filter(s => s.status === "Pendente").length;

      if (statCards.length >= 4) {
        statCards[2].textContent = palestrantesVinculados;
        statCards[3].textContent = palestrantesPendentes;
      }
    }
  } catch (err) {
    console.error("Erro ao carregar usuário logado:", err);
  }
});
