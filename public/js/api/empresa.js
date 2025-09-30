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
      body: formData,
    });

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      const texto = await response.text();
      throw new Error(`Resposta inesperada da API: ${texto}`);
    }
  } catch (erro) {
    console.error("Erro na requisição:", erro);
    return null;
  }
}

export async function getEventosEmpresa(id_empresa) {
  const res = await fetch(`${BASE_URL}/eventos?id_empresa=${id_empresa}`);

  if (!res.ok) throw new Error("Erro ao buscar eventos da empresa");
  return res.json();
}

export async function getEventosConfirmadosEmpresa(id_empresa) {
  const res = await fetch(`${BASE_URL}/eventos?id_empresa${id_empresa}&confirmado=true`);

  if (!res.ok) throw new Error("Erro ao buscar eventos confirmados");
  return res.json();
}