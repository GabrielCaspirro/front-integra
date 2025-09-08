// api/instituicao.js
import { BASE_URL } from "../api/config.js";

// Cadastro de instituição
export async function cadastrarInstituicao(dados) {
  const response = await fetch(`${BASE_URL}/inserir-instituicao`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return response.json();
}