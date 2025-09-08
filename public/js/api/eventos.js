import { BASE_URL } from "../api/config.js";

export async function getEventos() {
  const response = await fetch(`${BASE_URL}/eventos`);
  if (!response.ok) throw new Error("Erro ao buscar eventos");
  return response.json();
}