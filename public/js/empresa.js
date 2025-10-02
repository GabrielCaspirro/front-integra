import { getEmpresas, buscarPerfil, getEventosEmpresa, getEventosConfirmadosEmpresa, buscarSolicitacoes } from "../js/api/index.js";
import { BASE_URL_IMG } from "./api/config.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const empresas = await getEmpresas();
    const grid = document.getElementById("listaEmpresas");

    grid.innerHTML = "";
    empresas.forEach(emp => {
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
    console.error(err);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const usuario = await buscarPerfil();

    if (usuario) {
      const empresaNome = document.getElementById("empresaNome");
      const nomeEmpresa = document.getElementById("nomeEmpresa");

      if (empresaNome) empresaNome.textContent = usuario.nome;
      if (nomeEmpresa) nomeEmpresa.textContent = usuario.nome;

      // Atualizar foto de perfil
      const userAvatar = document.querySelector(".user-avatar i");
      if (userAvatar && usuario.logo) {
        userAvatar.outerHTML = `<img src="${BASE_URL_IMG}${usuario.logo}" alt="Avatar" class="avatar-img">`;
      }

      // Atualizar eventos
      const eventosDisponiveis = await getEventosEmpresa(usuario.id);
      const eventosAgendados = await getEventosConfirmadosEmpresa(usuario.id);

      document.querySelector(".stat-card:nth-child(1) h3").textContent = eventosDisponiveis.length;
      document.querySelector(".stat-card:nth-child(2) h3").textContent = eventosAgendados.length;

      // 👇 Atualizar palestrantes
      const solicitacoes = await buscarSolicitacoes(usuario.id); // retorna array de solicitações
      const palestrantesVinculados = solicitacoes.filter(s => s.status === "Aceito").length;
      const palestrantesPendentes = solicitacoes.filter(s => s.status === "Pendente").length;

      // Atualiza os cards
      document.querySelector(".stat-card:nth-child(3) h3").textContent = palestrantesVinculados;
      document.querySelector(".stat-card:nth-child(4) h3").textContent = palestrantesPendentes;
    }
  } catch (err) {
    console.error("Erro ao carregar usuário logado:", err);
  }
});
