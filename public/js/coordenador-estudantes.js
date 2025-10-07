import { buscarPerfil, inserirAlunoAPI } from '../js/api/index.js';
import { BASE_URL } from '../js/api/config.js';

document.addEventListener("DOMContentLoaded", async () => {
    // ----------------- MODAIS -----------------
    const studentsModal = document.getElementById("students-modal");
    const studentFormModal = document.getElementById("student-form-modal");
    studentsModal.style.display = "none";
    studentFormModal.style.display = "none";

    // ----------------- CAMPOS DE PESQUISA -----------------
    const studentSearchInput = document.getElementById("student-search");
    const studentFilterSelect = document.getElementById("student-filter");
    const turmaSearchInput = document.getElementById("turma-search");
    const turmaFilterSelect = document.getElementById("turma-filter-field");

    let turmas = []; // Vai carregar via API
    let currentTurma = null;
    let editingStudent = null;

    // ----------------- PEGAR USUÁRIO -----------------
    const perfil = await buscarPerfil();
    if (perfil && perfil.nome) {
        const userProfileName = document.querySelector("#user-profile-btn p");
        userProfileName.textContent = perfil.nome;
    }

    // ----------------- FUNÇÕES AUXILIARES -----------------
    function getCursoClass(curso) {
        return `course-${curso.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")}`;
    }

    function resetStudentForm() {
        document.getElementById("student-name").value = "";
        document.getElementById("student-rm").value = "";
        document.getElementById("student-email").value = "";
        editingStudent = null;
    }

    // ----------------- RENDER TURMAS -----------------
    function renderTurmas() {
        const classesGrid = document.getElementById("classes-grid");
        classesGrid.innerHTML = "";

        const searchText = turmaSearchInput.value.toLowerCase();
        const filterField = turmaFilterSelect.value;

        turmas.forEach(turma => {
            let match = true;

            if (filterField !== "all") {
                if (filterField === "serie") match = turma.nome.charAt(0) === searchText;
                else if (filterField === "letra") match = turma.nome.charAt(1).toLowerCase() === searchText;
                else match = turma[filterField]?.toLowerCase().includes(searchText);
            } else if (searchText) {
                match = turma.nome.toLowerCase().includes(searchText) ||
                        turma.curso.toLowerCase().includes(searchText) ||
                        turma.turno.toLowerCase().includes(searchText);
            }

            if (!match) return;

            const classCard = document.createElement("div");
            classCard.classList.add("class-card", getCursoClass(turma.curso));
            const ano = turma.nome.charAt(0);
            const letraTurma = turma.nome.charAt(1);

            classCard.innerHTML = `
                <div class="class-header">
                    <div class="class-name center">${ano}º${letraTurma}</div>
                </div>
                <div class="class-curso"><p>${turma.curso}</p></div>
                <div class="class-info">
                    <p><strong>Turno:</strong> ${turma.turno}</p>
                    <p class="student-count"><strong>Alunos:</strong> ${turma.alunos?.length || 0}</p>
                </div>
                <button class="button primary-button full-width" onclick="showStudents(${turma.id})">Analisar</button>
            `;
            classesGrid.appendChild(classCard);
        });
    }

    // ----------------- MODAL DE ESTUDANTES -----------------
    window.showStudents = (turmaId) => {
        currentTurma = turmas.find(t => t.id === turmaId);
        if (!currentTurma) return;

        const modalContent = studentsModal.querySelector(".modal-content");
        modalContent.classList.remove(...Array.from(modalContent.classList).filter(c => c.startsWith("course-")));
        modalContent.classList.add(getCursoClass(currentTurma.curso));

        const ano = currentTurma.nome.charAt(0);
        const letraTurma = currentTurma.nome.charAt(1);

        document.getElementById("students-modal-title").textContent = `Alunos da Turma ${ano}º${letraTurma}`;
        document.getElementById("students-modal-description").textContent = `${currentTurma.curso} - ${currentTurma.modulo} - ${currentTurma.turno}`;

        studentSearchInput.value = "";
        studentFilterSelect.value = "all";
        renderStudentsList();
        studentsModal.style.display = "flex";
    }

    function renderStudentsList() {
        const studentsList = document.getElementById("students-list");
        studentsList.innerHTML = "";
        if (!currentTurma?.alunos) return;

        const searchText = studentSearchInput.value.toLowerCase();
        const filterField = studentFilterSelect.value;

        const filteredStudents = currentTurma.alunos.filter(aluno => {
            if (filterField === "all") {
                return aluno.nome.toLowerCase().includes(searchText) ||
                       aluno.rm.toLowerCase().includes(searchText) ||
                       aluno.email.toLowerCase().includes(searchText);
            } else {
                return aluno[filterField]?.toLowerCase().includes(searchText);
            }
        });

        filteredStudents.forEach(aluno => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${aluno.nome}</td>
                <td>${aluno.rm}</td>
                <td>${aluno.email}</td>
                <td>
                    <div class="table-actions">
                        <button class="table-action edit" onclick="editStudent(${aluno.id})" title="Editar"><i class="fas fa-edit"></i></button>
                        <button class="table-action delete" onclick="deleteStudent(${aluno.id})" title="Excluir"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            studentsList.appendChild(row);
        });
    }

    // ----------------- CADASTRAR ALUNO -----------------
    async function saveStudent() {
        const name = document.getElementById("student-name").value.trim();
        const rm = document.getElementById("student-rm").value.trim();
        const email = document.getElementById("student-email").value.trim();

        if (!name || !rm || !email) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        // Verifica duplicados localmente
        const existingRM = currentTurma.alunos.some(a => a.rm === rm && (!editingStudent || a.id !== editingStudent.id));
        const existingEmail = currentTurma.alunos.some(a => a.email === email && (!editingStudent || a.id !== editingStudent.id));

        if (existingRM) { alert("Este RM já está cadastrado."); return; }
        if (existingEmail) { alert("Este email já está cadastrado."); return; }

        // Objeto para enviar à API
        const novoAluno = {
            nome: name,
            rm,
            email,
            curso: currentTurma.curso,
            modulo_ano: currentTurma.nome,
            telefone: "", // preencher se necessário
            id_instituicao: perfil.id_instituicao || 1
        };

        const resultado = await inserirAlunoAPI(novoAluno);
        if (!resultado) return;

        // Atualiza a lista local
        currentTurma.alunos.push({ id: resultado.id_aluno, nome, rm, email });

        studentFormModal.style.display = "none";
        resetStudentForm();
        renderStudentsList();
        renderTurmas();
    }

    document.getElementById("save-student-btn").addEventListener("click", saveStudent);

    // ----------------- EVENTOS DE MODAIS -----------------
    document.getElementById("close-students-modal").addEventListener("click", () => studentsModal.style.display = "none");
    document.getElementById("close-student-form-modal").addEventListener("click", () => {
        studentFormModal.style.display = "none";
        resetStudentForm();
    });
    document.getElementById("add-student-btn").addEventListener("click", () => {
        editingStudent = null;
        document.getElementById("student-form-title").textContent = "Adicionar Aluno";
        resetStudentForm();
        studentFormModal.style.display = "flex";
    });

    window.addEventListener("click", (e) => {
        if (e.target === studentsModal) studentsModal.style.display = "none";
        if (e.target === studentFormModal) {
            studentFormModal.style.display = "none";
            resetStudentForm();
        }
    });

    // ----------------- FILTROS -----------------
    studentSearchInput.addEventListener("input", renderStudentsList);
    studentFilterSelect.addEventListener("change", renderStudentsList);
    turmaSearchInput.addEventListener("input", renderTurmas);
    turmaFilterSelect.addEventListener("change", renderTurmas);

    // ----------------- CARREGAR TURMAS VIA API -----------------
    async function carregarTurmas() {
        try {
            const response = await fetch(`${BASE_URL}/salas/${perfil.id}`);
            if (!response.ok) throw new Error("Erro ao carregar turmas.");
            const salas = await response.json();

            turmas = await Promise.all(salas.map(async sala => {
                const alunosRes = await fetch(`${BASE_URL}/alunos/${sala}`);
                const alunos = alunosRes.ok ? await alunosRes.json() : [];
                return {
                    id: Date.now() + Math.random(),
                    nome: sala,
                    curso: "",
                    modulo: "",
                    turno: "",
                    alunos
                };
            }));

            renderTurmas();
        } catch (err) {
            console.error(err);
        }
    }

    await carregarTurmas();
});
