import { buscarPerfil } from './index.js'; 
import { BASE_URL } from "../api/config.js";

export async function buscarEventosAluno() {
    const perfil = await buscarPerfil();
    if (!perfil) return [];

    const id_aluno = perfil.id;

    try {
        const resposta = await fetch(`${BASE_URL}/eventos-aluno?id_aluno=${id_aluno}`);
        if (!resposta.ok) {
            console.error("Erro ao buscar eventos:", await resposta.json());
            return [];
        }

        const eventos = await resposta.json();
        return eventos;

    } catch (erro) {
        console.error("Erro ao conectar com a API:", erro);
        return [];
    }
}
