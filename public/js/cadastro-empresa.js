import { cadastrarEmpresa } from "../js/api/index.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("empresa-form");
  const selectSetor = document.getElementById("setor");
  const outroSetor = document.getElementById("outro-setor");
  const mensagem = document.getElementById("mensagem");

  // Mostrar campo "outro setor" se selecionado
  selectSetor.addEventListener("change", () => {
    outroSetor.style.display = selectSetor.value === "outro" ? "block" : "none";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // Ajusta o setor se "outro" for selecionado
    if (selectSetor.value === "outro") {
      formData.set("setor", document.getElementById("setor-atuacao-outro").value);
    }

    try {
      const resultado = await cadastrarEmpresa(formData);
      console.log("RESULTADO API:", resultado);

      if (resultado && resultado.mensagem) {
        // Mostra mensagem de sucesso
        mensagem.innerText = resultado.mensagem;
        mensagem.style.color = "green";

        // Mostra mensagem adicional
        setTimeout(() => {
          alert("A SENHA TEMPORÁRIA IRÁ SER ENVIADA PARA O SEU EMAIL DE CADASTRO");
        }, 500); // aparece meio segundo depois

        // Redireciona após alguns segundos
        setTimeout(() => {
          window.location.href = "/login-empresa";
        }, 3000); // 3 segundos depois do sucesso
      } 
      else if (resultado && resultado.erro) {
        mensagem.innerText = resultado.erro;
        mensagem.style.color = "red";
      } 
      else {
        mensagem.innerText = "Erro desconhecido ao cadastrar.";
        mensagem.style.color = "red";
      }
    } catch (erro) {
      console.error("ERRO DE CONEXÃO:", erro);
      mensagem.innerText = "Erro de conexão com o servidor.";
      mensagem.style.color = "red";
    }
  });
});
