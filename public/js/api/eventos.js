import { BASE_URL } from "../api/config.js";

export async function getEventos() {
  const response = await fetch(`${BASE_URL}/eventos`);
  if (!response.ok) throw new Error("Erro ao buscar eventos");
  return response.json();
}

export async function getEventosLivres() {
  const response = await fetch(`${BASE_URL}/eventos?confirmado=false&status=pendente`);
  if (!response.ok) throw new Error("Erro ao buscar eventos");
  return response.json();
}

export async function criarEvento(payload) {
  const res = await fetch(`${BASE_URL}/inserir-evento`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const contentType = (res.headers.get('content-type') || '').toLowerCase();

  if (!res.ok) {
    const body = contentType.includes('application/json') ? await res.json() : await res.text();
    const msg = (typeof body === 'string') ? body : (body.erro || JSON.stringify(body));
    throw new Error(`${res.status} - ${msg}`);
  }

  return contentType.includes('application/json') ? await res.json() : null;
}