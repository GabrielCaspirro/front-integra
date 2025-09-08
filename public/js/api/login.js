import { BASE_URL } from "../api/config.js";

export async function login(email, senha, tipo) {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha, tipo })
    });

    if (!response.ok) throw new Error("Erro no login");
    return await response.json(); // deve retornar { token, usuario }
  } catch (err) {
    console.error("Erro em login:", err);
    return null;
  }
}
