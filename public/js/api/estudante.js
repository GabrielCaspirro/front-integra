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

export async function inserirAlunoAPI(aluno) {
    try {
        const response = await fetch(`${BASE_URL}/inserir-estudante`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aluno)
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.erro || 'Erro ao cadastrar aluno.');
            return null;
        }

        alert('Aluno cadastrado com sucesso!');
        return data; // aqui tem o id_aluno retornado
    } catch (err) {
        console.error(err);
        alert('Erro ao conectar com a API.');
        return null;
    }
}

