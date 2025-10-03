document.addEventListener("DOMContentLoaded", () => {
    const studentsModal = document.getElementById("students-modal")
    const studentFormModal = document.getElementById("student-form-modal")

    studentsModal.style.display = "none"
    studentFormModal.style.display = "none"

    const studentSearchInput = document.getElementById("student-search")
    const studentFilterSelect = document.getElementById("student-filter")
    const turmaSearchInput = document.getElementById("turma-search")
    const turmaFilterSelect = document.getElementById("turma-filter-field")

    const turmas = [
        {
            "id": 1,
            "nome": "1A",
            "curso": "Administração",
            "modulo": "1º Módulo",
            "turno": "Manhã",
            "alunos": [
                { "id": 10, "nome": "João Pedro", "rm": "12101", "email": "joao.pedro@etec.sp.gov.br" },
                { "id": 11, "nome": "Larissa Souza", "rm": "12102", "email": "larissa.souza@etec.sp.gov.br" }
            ]
        },
        {
            "id": 2,
            "nome": "2A",
            "curso": "Administração",
            "modulo": "2º Módulo",
            "turno": "Manhã",
            "alunos": [
                { "id": 12, "nome": "Marcos Silva", "rm": "11101", "email": "marcos.silva@etec.sp.gov.br" },
                { "id": 13, "nome": "Natália Santos", "rm": "11102", "email": "natalia.santos@etec.sp.gov.br" },
                { "id": 14, "nome": "Otávio Lima", "rm": "11103", "email": "otavio.lima@etec.sp.gov.br" }
            ]
        },
        {
            "id": 2, "nome": "2B", "curso": "Recursos Humanos", "modulo": "2º Módulo", "turno": "Manhã", "alunos": []
        },
        {
            "id": 3, "nome": "3B", "curso": "Recursos Humanos", "modulo": "3º Módulo", "turno": "Manhã", "alunos": []
        },
        {
            "id": 5, "nome": "1C", "curso": "Informática para Internet", "modulo": "1º Módulo", "turno": "Manhã",
            "alunos": [
                { "id": 1, "nome": "Ana Silva", "rm": "12001", "email": "ana.silva@etec.sp.gov.br" },
                { "id": 2, "nome": "Bruno Santos", "rm": "12002", "email": "bruno.santos@etec.sp.gov.br" },
                { "id": 3, "nome": "Carla Oliveira", "rm": "12003", "email": "carla.oliveira@etec.sp.gov.br" }
            ]
        },
        {
            "id": 6, "nome": "2C", "curso": "Informática para Internet", "modulo": "2º Módulo", "turno": "Manhã",
            "alunos": [
                { "id": 4, "nome": "Diego Costa", "rm": "11001", "email": "diego.costa@etec.sp.gov.br" },
                { "id": 5, "nome": "Elena Rodrigues", "rm": "11002", "email": "elena.rodrigues@etec.sp.gov.br" }
            ]
        },
        {
            "id": 7, "nome": "3C", "curso": "Informática para Internet", "modulo": "3º Módulo", "turno": "Manhã",
            "alunos": [
                { "id": 6, "nome": "Felipe Lima", "rm": "10001", "email": "felipe.lima@etec.sp.gov.br" },
                { "id": 7, "nome": "Gabriela Mendes", "rm": "10002", "email": "gabriela.mendes@etec.sp.gov.br" },
                { "id": 8, "nome": "Hugo Alves", "rm": "10003", "email": "hugo.alves@etec.sp.gov.br" },
                { "id": 9, "nome": "Evellyn Feliciano", "rm": "10004", "email": "evellyn.feliciano@etec.sp.gov.br" },
                { "id": 10, "nome": "Gabriel Caspirro", "rm": "10005", "email": "gabriel.caspirro@etec.sp.gov.br" },
                { "id": 11, "nome": "Guilherme Augusto", "rm": "10006", "email": "guilherme.augusto@etec.sp.gov.br" },
                { "id": 12, "nome": "Guilherme Nakamura", "rm": "10007", "email": "guilherme.nakamura@etec.sp.gov.br" },
                { "id": 13, "nome": "Iago Menezes", "rm": "10008", "email": "iago.menezes@etec.sp.gov.br" }
            ]
        },
        { "id": 8, "nome": "1F", "curso": "Informática para Internet", "modulo": "1º Módulo", "turno": "Tarde", "alunos": [] },
        { "id": 9, "nome": "2F", "curso": "Informática para Internet", "modulo": "2º Módulo", "turno": "Tarde", "alunos": [] },
        { "id": 10, "nome": "1I", "curso": "Química", "modulo": "1º Módulo", "turno": "Tarde", "alunos": [] },
        { "id": 11, "nome": "3I", "curso": "Química", "modulo": "3º Módulo", "turno": "Tarde", "alunos": [] }
    ]

    let currentTurma = null
    let editingStudent = null

    // ----------------- EVENTOS DE MODAIS -----------------
    document.getElementById("close-students-modal").addEventListener("click", () => {
        studentsModal.style.display = "none"
    })

    document.getElementById("close-student-form-modal").addEventListener("click", () => {
        studentFormModal.style.display = "none"
        resetStudentForm()
    })

    document.getElementById("add-student-btn").addEventListener("click", () => {
        editingStudent = null
        document.getElementById("student-form-title").textContent = "Adicionar Aluno"
        resetStudentForm()
        studentFormModal.style.display = "flex"
    })

    document.getElementById("save-student-btn").addEventListener("click", saveStudent)

    window.addEventListener("click", (e) => {
        if (e.target === studentsModal) studentsModal.style.display = "none"
        if (e.target === studentFormModal) {
            studentFormModal.style.display = "none"
            resetStudentForm()
        }
    })

    // ----------------- PESQUISA E FILTRO -----------------
    studentSearchInput.addEventListener("input", renderStudentsList)
    studentFilterSelect.addEventListener("change", renderStudentsList)
    turmaSearchInput.addEventListener("input", renderTurmas)
    turmaFilterSelect.addEventListener("change", renderTurmas)

    // ----------------- FUNÇÕES AUXILIARES -----------------
    function getCursoClass(curso) {
        const key = curso.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-")
        return `course-${key}`
    }

    function resetStudentForm() {
        document.getElementById("student-name").value = ""
        document.getElementById("student-rm").value = ""
        document.getElementById("student-email").value = ""
        document.getElementById("student-password").value = ""
        editingStudent = null
    }

    // ----------------- RENDERIZAÇÃO DE TURMAS -----------------
    function renderTurmas() {
        const classesGrid = document.getElementById("classes-grid")
        classesGrid.innerHTML = ""

        const searchText = turmaSearchInput.value.toLowerCase()
        const filterField = turmaFilterSelect.value

        turmas.forEach(turma => {
            let match = true
            if (filterField !== "all") {
                if (filterField === "serie") match = turma.nome.charAt(0) === searchText
                else if (filterField === "letra") match = turma.nome.charAt(1).toLowerCase() === searchText
                else match = turma[filterField].toLowerCase().includes(searchText)
            } else if (searchText) {
                match = turma.nome.toLowerCase().includes(searchText) ||
                    turma.curso.toLowerCase().includes(searchText) ||
                    turma.turno.toLowerCase().includes(searchText)
            }

            if (!match) return

            const classCard = document.createElement("div")
            classCard.classList.add("class-card", getCursoClass(turma.curso))

            const ano = turma.nome.charAt(0)
            const letraTurma = turma.nome.charAt(1)

            classCard.innerHTML = `
                <div class="class-header">
                    <div class="class-name center">${ano}º${letraTurma}</div>
                </div>
                <div class="class-curso"><p>${turma.curso}</p></div>
                <div class="class-info">
                    <p><strong>Turno:</strong> ${turma.turno}</p>
                    <p class="student-count"><strong>Alunos:</strong> ${turma.alunos.length}</p>
                </div>
                <button class="button primary-button full-width" onclick="showStudents(${turma.id})">Analisar</button>
            `
            classesGrid.appendChild(classCard)
        })
    }

    // ----------------- MODAL DE ESTUDANTES -----------------
    window.showStudents = (turmaId) => {
        currentTurma = turmas.find(t => t.id === turmaId)
        if (!currentTurma) return

        const modalContent = studentsModal.querySelector(".modal-content")
        modalContent.classList.remove(...Array.from(modalContent.classList).filter(c => c.startsWith("course-")))
        modalContent.classList.add(getCursoClass(currentTurma.curso))

        const ano = currentTurma.nome.charAt(0)
        const letraTurma = currentTurma.nome.charAt(1)

        document.getElementById("students-modal-title").textContent = `Alunos da Turma ${ano}º${letraTurma}`
        document.getElementById("students-modal-description").textContent =
            `${currentTurma.curso} - ${currentTurma.modulo} - ${currentTurma.turno}`

        studentSearchInput.value = ""
        studentFilterSelect.value = "all"
        renderStudentsList()
        studentsModal.style.display = "flex"
    }

    function renderStudentsList() {
        const studentsList = document.getElementById("students-list")
        studentsList.innerHTML = ""
        if (!currentTurma) return

        const searchText = studentSearchInput.value.toLowerCase()
        const filterField = studentFilterSelect.value

        const filteredStudents = currentTurma.alunos.filter(aluno => {
            if (filterField === "all") {
                return aluno.nome.toLowerCase().includes(searchText) ||
                    aluno.rm.toLowerCase().includes(searchText) ||
                    aluno.email.toLowerCase().includes(searchText)
            } else {
                return aluno[filterField].toLowerCase().includes(searchText)
            }
        })

        filteredStudents.forEach(aluno => {
            const row = document.createElement("tr")
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
            `
            studentsList.appendChild(row)
        })
    }

    // ----------------- FUNÇÕES DE EDIÇÃO/EXCLUSÃO -----------------
    window.editStudent = (studentId) => {
        editingStudent = currentTurma.alunos.find(a => a.id === studentId)
        if (!editingStudent) return

        document.getElementById("student-form-title").textContent = "Editar Aluno"
        document.getElementById("student-name").value = editingStudent.nome
        document.getElementById("student-rm").value = editingStudent.rm
        document.getElementById("student-email").value = editingStudent.email
        document.getElementById("student-password").value = ""
        studentFormModal.style.display = "flex"
    }

    window.deleteStudent = (studentId) => {
        const aluno = currentTurma.alunos.find(a => a.id === studentId)
        if (!aluno) return

        if (confirm(`Tem certeza que deseja excluir o aluno ${aluno.nome}?`)) {
            currentTurma.alunos = currentTurma.alunos.filter(a => a.id !== studentId)
            renderStudentsList()
            renderTurmas()
            alert("Aluno excluído com sucesso!")
        }
    }

    function saveStudent() {
        const name = document.getElementById("student-name").value.trim()
        const rm = document.getElementById("student-rm").value.trim()
        const email = document.getElementById("student-email").value.trim()
        const password = document.getElementById("student-password").value.trim()

        if (!name || !rm || !email || !password) {
            alert("Por favor, preencha todos os campos.")
            return
        }

        const existingRM = turmas.some(t =>
            t.alunos.some(a => a.rm === rm && (!editingStudent || a.id !== editingStudent.id))
        )
        if (existingRM) {
            alert("Este RM já está cadastrado para outro aluno.")
            return
        }

        const existingEmail = turmas.some(t =>
            t.alunos.some(a => a.email === email && (!editingStudent || a.id !== editingStudent.id))
        )
        if (existingEmail) {
            alert("Este email já está cadastrado para outro aluno.")
            return
        }

        if (editingStudent) {
            editingStudent.nome = name
            editingStudent.rm = rm
            editingStudent.email = email
            alert("Aluno atualizado com sucesso!")
        } else {
            currentTurma.alunos.push({ id: Date.now(), nome: name, rm, email })
            alert("Aluno adicionado com sucesso!")
        }

        studentFormModal.style.display = "none"
        resetStudentForm()
        renderStudentsList()
        renderTurmas()
    }

    // ----------------- RENDER INICIAL -----------------
    renderTurmas()
})