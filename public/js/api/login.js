import { BASE_URL } from "../api/config.js";

export async function login(email, senha, tipo) {
  const resposta = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha, tipo })
  });

  const dados = await resposta.json();

  if (resposta.ok) {
    localStorage.setItem("token", dados.token);
    return dados;
  } else {
    return null;
  }
}

export async function buscarPerfil() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const resposta = await fetch(`${BASE_URL}/perfil`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!resposta.ok) {
    console.error("Erro ao buscar perfil:", await resposta.json());
    return null;
  }

  const dados = await resposta.json();
  return dados;
}