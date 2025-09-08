import { cadastrarPalestrante } from "../js/api/index.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cadastroPalestranteForm");
  const mensagem = document.getElementById("mensagem");

  const selectEspecialidade = document.getElementById("especialidade");
  const outroArea = document.getElementById("outro-area");

  selectEspecialidade.addEventListener("change", () => {
    outroArea.style.display = selectEspecialidade.value === "Outro" ? "block" : "none";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const dataNascimento = document.getElementById("data-nascimento").value;
    const especialidade =
      selectEspecialidade.value === "Outro"
        ? document.getElementById("especialidade-outro").value
        : selectEspecialidade.value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;

    try {
      const resultado = await cadastrarPalestrante({
        nome,
        dataNascimento,
        especialidade,
        email,
        telefone,
      });

      if (resultado) {
        mensagem.innerText = "Cadastro realizado com sucesso!";
        mensagem.style.color = "green";
        setTimeout(() => window.location.href = "/login-palestrante", 2000);
      } else {
        mensagem.innerText = resultado.erro || "Erro ao cadastrar";
        mensagem.style.color = "red";
      }
    } catch (erro) {
      mensagem.innerText = "Erro de conexão com o servidor";
      mensagem.style.color = "red";
    }
  });
});