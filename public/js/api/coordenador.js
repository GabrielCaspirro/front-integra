// ==============================
// 🔹 Funções de API - Coordenador
// ==============================

import { BASE_URL } from "./config.js";

/**
 * Busca as instituições vinculadas a um coordenador
 * @param {number} idCoordenador
 * @returns {Promise<Array>}
 */
export async function getInstituicoesCoordenador(idCoordenador) {
  try {
    const resposta = await fetch(`${BASE_URL}/coordenador-instituicoes/${idCoordenador}`);
    if (!resposta.ok) throw new Error("Erro ao buscar instituições do coordenador");

    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Erro na função getInstituicoesCoordenador:", erro);
    return [];
  }
}
