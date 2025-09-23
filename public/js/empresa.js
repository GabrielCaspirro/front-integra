import { getEmpresas, buscarPerfil } from "../js/api/index.js";
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
    }
  } catch (err) {
    console.error("Erro ao carregar usuário logado:", err);
  }
});
