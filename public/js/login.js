import { login } from "../js/api/index.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const senha = document.getElementById("senha").value;
      const tipo = form.getAttribute("data-tipo"); // ex: "aluno", "coordenador"

      const result = await login(email, senha, tipo);

      if (result) {
        alert("Login realizado com sucesso!");
        // redireciona para a página certa
        if (tipo === "aluno") {
          window.location.href = "/estudante";
        } else if (tipo === "coordenador") {
          window.location.href = "/coordenador";
        } else if (tipo === "instituicao") {
          window.location.href = "/instituicao";
        } else if (tipo === "empresa") {
          window.location.href = "/empresa";
        } else if (tipo === "palestrante") {
          window.location.href = "/palestrante";
        }
      } else {
        alert("Email ou senha inválidos!");
      }
    });
  }
});