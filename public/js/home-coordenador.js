import { buscarPerfil } from '../js/api/index.js';
import { BASE_URL } from '../js/api/config.js';

document.addEventListener("DOMContentLoaded", async () => {
    // ----------------- PEGAR PERFIL -----------------
    const perfil = await buscarPerfil();
    if (!perfil || !perfil.id) return;

    // Atualiza nome do usuário no header e boas-vindas
    const userProfileName = document.querySelector("#user-profile-btn p");
    const welcomeTitle = document.querySelector(".welcome-title");
    if (userProfileName) userProfileName.textContent = perfil.nome;
    if (welcomeTitle) welcomeTitle.textContent = `Bem-vindo(a), ${perfil.nome}!`;

    // ----------------- PEGAR TOTAL DE EVENTOS -----------------
    async function carregarEventos() {
        try {
            const res = await fetch(`${BASE_URL}/eventos-confirmados-coordenador/${perfil.id}`);
            if (!res.ok) throw new Error("Erro ao carregar eventos.");
            const eventos = await res.json();

            const eventosCountElem = document.querySelector("#event-count");
            if (eventosCountElem) eventosCountElem.textContent = eventos.length;
        } catch (err) {
            console.error("Erro ao carregar eventos:", err);
        }
    }

    // ----------------- PEGAR TOTAL DE ALUNOS -----------------
    async function carregarAlunos() {
        try {
            const res = await fetch(`${BASE_URL}/alunos-instituicao/${perfil.id}`);
            if (!res.ok) throw new Error("Erro ao carregar alunos.");
            const alunos = await res.json();

            const studentCountElem = document.querySelector("#student-count");
            if (studentCountElem) studentCountElem.textContent = alunos.length;
        } catch (err) {
            console.error("Erro ao carregar alunos:", err);
        }
    }

    // ----------------- INICIALIZAÇÃO -----------------
    await carregarEventos();
    await carregarAlunos();
});
