import { BASE_URL } from "../api/config.js";

// Cadastro de palestrante
export async function cadastrarPalestrante(dados) {
  const response = await fetch(`${BASE_URL}/inserir-palestrante`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return response.json();
}