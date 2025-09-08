import { BASE_URL } from "../api/config.js";

export async function getEmpresas() {
  const response = await fetch(`${BASE_URL}/empresas`);
  if (!response.ok) throw new Error("Erro ao buscar empresas");
  return response.json();
}

export async function cadastrarEmpresa(formData) {
  try {
    const response = await fetch(`${BASE_URL}/inserir-empresa`, {
      method: "POST",
      body: formData, // enviar FormData direto
      // NÃO colocar headers: { "Content-Type": "application/json" }
    });

    return await response.json();
  } catch (erro) {
    console.error("Erro na requisição:", erro);
    return null;
  }
}