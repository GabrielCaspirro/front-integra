// ==============================
// 🔹 Tela de Instituições + Dados do Coordenador
// ==============================
import { getInstituicoesCoordenador, buscarPerfil } from "../js/api/index.js";
import { BASE_URL } from "../js/api/config.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("etec-cards");
  const template = document.getElementById("etec-template");

  const userNameNav = document.querySelector(".user-info p");
  const welcomeTitle = document.querySelector(".welcome-title");

  try {
    // 🔹 Busca o perfil do coordenador logado
    const coordenador = await buscarPerfil();
    if (!coordenador || !coordenador.id) {
      container.innerHTML = `<p style="text-align:center; color:red;">Não foi possível identificar o coordenador logado.</p>`;
      return;
    }

    // 🔸 Atualiza nome do coordenador
    if (userNameNav) userNameNav.textContent = `Prof. ${coordenador.nome}`;
    if (welcomeTitle) welcomeTitle.textContent = `Bem-vindo(a), Prof. ${coordenador.nome}!`;

    // 🔸 Busca instituições ligadas ao coordenador
    const instituicoes = await getInstituicoesCoordenador(coordenador.id);
    container.innerHTML = ""; // limpa container

    if (!instituicoes.length) {
      container.innerHTML = `<p style="text-align:center; font-size:1.2rem;">Nenhuma instituição vinculada encontrada.</p>`;
      return;
    }

    // 🔸 Para cada instituição, busca total de alunos e eventos
    for (const etec of instituicoes) {
      const card = template.cloneNode(true);
      card.id = `etec-${etec.id_instituicao}`;
      card.style.display = "block";

      // Preenche nome e código
      card.querySelector(".etec-name").textContent = etec.nome;
      card.querySelector(".etec-code").textContent = `Código: ${etec.cod_instituicao || "N/A"}`;

      // 🔹 Busca quantidade de alunos
      let qtdAlunos = 0;
      try {
        const resAlunos = await fetch(`${BASE_URL}/alunos-instituicao/${coordenador.id}?instituicao=${etec.id}`);
        if (resAlunos.ok) {
          const alunos = await resAlunos.json();
          qtdAlunos = alunos.length;
        }
      } catch (err) {
        console.error(`Erro ao carregar alunos da instituição ${etec.nome}:`, err);
      }

      // 🔹 Busca quantidade de eventos aceitos
      let qtdEventos = 0;
      try {
        const resEventos = await fetch(`${BASE_URL}/eventos-confirmados-coordenador/${coordenador.id}?instituicao=${etec.id}`);
        if (resEventos.ok) {
          const eventos = await resEventos.json();
          qtdEventos = eventos.length;
        }
      } catch (err) {
        console.error(`Erro ao carregar eventos da instituição ${etec.nome}:`, err);
      }

      card.querySelector(".stat-students").textContent = qtdAlunos;
      card.querySelector(".stat-events").textContent = qtdEventos;

      // Botão de entrar
      const button = card.querySelector(".enter-button");
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        entrarNaEtec("/home-coordenador", etec.nome, button);
      });

      card.addEventListener("click", () => {
        entrarNaEtec("/home-coordenador", etec.nome, button);
      });

      // Acessibilidade
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Entrar na ${etec.nome}`);

      container.appendChild(card);
    }

  } catch (erro) {
    console.error("Erro ao carregar instituições:", erro);
    container.innerHTML = `<p style="text-align:center; color:red;">Erro ao carregar instituições.</p>`;
  }

  // ---------- ENTRAR NA ETEC ----------
  function entrarNaEtec(url, etecName, button) {
    localStorage.setItem('selectedEtec', JSON.stringify({
      name: etecName,
      timestamp: new Date().toISOString()
    }));

    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
    button.disabled = true;

    setTimeout(() => {
      window.location.href = url;
    }, 800);
  }
});
