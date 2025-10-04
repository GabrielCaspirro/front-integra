// js/cadastro_instituicao.js
import { cadastrarInstituicao } from "../js/api/index.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("instituicao-form");
  const selectTipo = document.getElementById("tipo-instituicao");
  const outroTipo = document.getElementById("outro-tipo");
  const mensagem = document.getElementById("mensagem"); // criar <p id="mensagem"></p> no HTML

  // Mostrar campo "outro tipo" se selecionado
  selectTipo.addEventListener("change", () => {
    outroTipo.style.display = selectTipo.value === "Outro" ? "block" : "none";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome-instituicao").value;
    const tipo =
      selectTipo.value === "Outro"
        ? document.getElementById("tipo-instituicao-outro").value
        : selectTipo.value;
    const codigo = document.getElementById("codigo-instituicao").value;
    const email = document.getElementById("email-instituicao").value;
    const cep = document.getElementById("cep").value;
    const telefone = document.getElementById("telefone").value;

    try {
      const resultado = await cadastrarInstituicao({
        nome,
        tipo,
        codigo,
        email,
        cep,
        telefone,
      });

      if (resultado) {
        // Mensagem de sucesso principal
        mensagem.innerText = "Cadastro realizado com sucesso!";
        mensagem.style.color = "green";

        // Mostra alerta informativo após o sucesso
        setTimeout(() => {
          alert("SUA SENHA TEMPORÁRIA VAI SER ENVIADA PARA O SEU EMAIL");
        }, 500);

        // Redireciona após 3 segundos
        setTimeout(() => {
          window.location.href = "/login-instituicao";
        }, 3000);
      } else {
        mensagem.innerText = resultado.erro || "Erro ao cadastrar";
        mensagem.style.color = "red";
      }
    } catch (erro) {
      console.error("Erro de conexão:", erro);
      mensagem.innerText = "Erro de conexão com o servidor";
      mensagem.style.color = "red";
    }
  });
});
