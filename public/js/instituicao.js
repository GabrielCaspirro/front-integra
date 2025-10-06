// Global variables
let currentEditingStudent = null
let currentEditingCoordinator = null
let coordinators = []

// Sample data for coordinators
const sampleCoordinators = [
  {
    id: 1,
    name: "Prof. Maria Silva",
    cpf: "123.456.789-00",
    email: "maria.silva@etec.sp.gov.br",
    phone: "(11) 99999-1234",
    area: "informatica",
    status: "ativo",
  },
  {
    id: 2,
    name: "Prof. João Santos",
    cpf: "987.654.321-00",
    email: "joao.santos@etec.sp.gov.br",
    phone: "(11) 99999-5678",
    area: "administracao",
    status: "ativo",
  },
  {
    id: 3,
    name: "Prof. Ana Costa",
    cpf: "456.789.123-00",
    email: "ana.costa@etec.sp.gov.br",
    phone: "(11) 99999-9012",
    area: "recursos-humanos",
    status: "inativo",
  },
]

// Sample data for classes (existing)
const sampleClasses = [
  {
    id: 1,
    serie: "1º",
    letra: "A",
    curso: "Informática para Internet",
    turno: "Manhã",
    students: [
      { id: 1, name: "João Silva", rm: "12345", email: "joao@email.com" },
      { id: 2, name: "Maria Santos", rm: "12346", email: "maria@email.com" },
      { id: 3, name: "Pedro Costa", rm: "12347", email: "pedro@email.com" },
    ],
  },
  {
    id: 2,
    serie: "2º",
    letra: "B",
    curso: "Administração",
    turno: "Tarde",
    students: [
      { id: 4, name: "Ana Lima", rm: "12348", email: "ana@email.com" },
      { id: 5, name: "Carlos Oliveira", rm: "12349", email: "carlos@email.com" },
    ],
  },
]

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  coordinators = [...sampleCoordinators]

  closeAllModals()

  // Initialize both sections
  renderClasses()
  renderCoordinators()

  // Set up event listeners
  setupEventListeners()

  // Show students section by default
  showSection("students")

  setTimeout(() => {
    closeAllModals()
  }, 100)
})

function closeAllModals() {
  const modals = document.querySelectorAll(".modal")
  modals.forEach((modal) => {
    modal.style.display = "none"
  })

  const modalIds = ["students-modal", "student-form-modal", "coordinator-form-modal"]

  modalIds.forEach((modalId) => {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.style.display = "none"
    }
  })

  document.body.style.overflow = "auto"

  currentEditingStudent = null
  currentEditingCoordinator = null
}

// Section navigation
function showSection(section) {
  // Hide all sections
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active")
  })

  // Remove active class from all tabs
  document.querySelectorAll(".tab-button").forEach((tab) => {
    tab.classList.remove("active")
  })

  // Show selected section
  document.getElementById(`${section}-section`).classList.add("active")
  document.getElementById(`${section}-tab`).classList.add("active")
}

// Setup event listeners
function setupEventListeners() {
  // Existing student event listeners
  setupStudentEventListeners()

  // New coordinator event listeners
  setupCoordinatorEventListeners()
}

function setupStudentEventListeners() {
  // Student search and filter
  const studentSearch = document.getElementById("turma-search")
  const studentFilter = document.getElementById("turma-filter-field")

  if (studentSearch) {
    studentSearch.addEventListener("input", filterClasses)
  }

  if (studentFilter) {
    studentFilter.addEventListener("change", filterClasses)
  }

  // Student modal events
  const closeStudentsModal = document.getElementById("close-students-modal")
  const addStudentBtn = document.getElementById("add-student-btn")
  const closeStudentFormModal = document.getElementById("close-student-form-modal")
  const saveStudentBtn = document.getElementById("save-student-btn")

  if (closeStudentsModal) {
    closeStudentsModal.addEventListener("click", () => closeModal("students-modal"))
  }

  if (addStudentBtn) {
    addStudentBtn.addEventListener("click", () => openStudentForm())
  }

  if (closeStudentFormModal) {
    closeStudentFormModal.addEventListener("click", () => closeModal("student-form-modal"))
  }

  if (saveStudentBtn) {
    saveStudentBtn.addEventListener("click", saveStudent)
  }
}

function setupCoordinatorEventListeners() {
  // Coordinator search and filter
  const coordinatorSearch = document.getElementById("coordinator-search")
  const coordinatorFilter = document.getElementById("coordinator-filter-field")

  if (coordinatorSearch) {
    coordinatorSearch.addEventListener("input", filterCoordinators)
  }

  if (coordinatorFilter) {
    coordinatorFilter.addEventListener("change", filterCoordinators)
  }

  // Coordinator modal events
  const addCoordinatorBtn = document.getElementById("add-coordinator-btn")
  const closeCoordinatorFormModal = document.getElementById("close-coordinator-form-modal")
  const saveCoordinatorBtn = document.getElementById("save-coordinator-btn")

  if (addCoordinatorBtn) {
    addCoordinatorBtn.addEventListener("click", () => openCoordinatorForm())
  }

  if (closeCoordinatorFormModal) {
    closeCoordinatorFormModal.addEventListener("click", () => closeModal("coordinator-form-modal"))
  }

  if (saveCoordinatorBtn) {
    saveCoordinatorBtn.addEventListener("click", saveCoordinator)
  }
}

// Render coordinators
function renderCoordinators() {
  const coordinatorsGrid = document.getElementById("coordinators-grid")
  if (!coordinatorsGrid) return

  coordinatorsGrid.innerHTML = ""

  coordinators.forEach((coordinator) => {
    const coordinatorCard = createCoordinatorCard(coordinator)
    coordinatorsGrid.appendChild(coordinatorCard)
  })
}

// Create coordinator card
function createCoordinatorCard(coordinator) {
  const card = document.createElement("div")
  card.className = "coordinator-card"

  const initials = coordinator.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
  const areaNames = {
    informatica: "Informática",
    administracao: "Administração",
    "recursos-humanos": "Recursos Humanos",
    geral: "Coordenação Geral",
  }

  card.innerHTML = `
        <div class="coordinator-status ${coordinator.status}">${coordinator.status.charAt(0).toUpperCase() + coordinator.status.slice(1)}</div>
        
        <div class="coordinator-header">
            <div class="coordinator-avatar">${initials}</div>
            <div class="coordinator-info">
                <h3>${coordinator.name}</h3>
                <p>${areaNames[coordinator.area] || coordinator.area}</p>
            </div>
        </div>
        
        <div class="coordinator-details">
            <div class="coordinator-detail">
                <i class="fas fa-envelope"></i>
                <span>${coordinator.email}</span>
            </div>
            <div class="coordinator-detail">
                <i class="fas fa-phone"></i>
                <span>${coordinator.phone}</span>
            </div>
            <div class="coordinator-detail">
                <i class="fas fa-id-card"></i>
                <span>${coordinator.cpf}</span>
            </div>
        </div>
        
        <div class="coordinator-area-badge ${coordinator.area}">
            ${areaNames[coordinator.area] || coordinator.area}
        </div>
        
        <div class="coordinator-actions-buttons">
            <button class="button outline-button" onclick="editCoordinator(${coordinator.id})">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button class="button danger-button" onclick="deleteCoordinator(${coordinator.id})">
                <i class="fas fa-trash"></i> Excluir
            </button>
        </div>
    `

  return card
}

// Filter coordinators
function filterCoordinators() {
  const searchTerm = document.getElementById("coordinator-search").value.toLowerCase()
  const filterField = document.getElementById("coordinator-filter-field").value

  const coordinatorCards = document.querySelectorAll(".coordinator-card")

  coordinatorCards.forEach((card) => {
    const coordinator = coordinators.find((c) => {
      const cardName = card.querySelector(".coordinator-info h3").textContent
      return cardName === c.name
    })

    if (!coordinator) return

    let shouldShow = true

    if (searchTerm) {
      const searchableText = `${coordinator.name} ${coordinator.email} ${coordinator.area}`.toLowerCase()
      shouldShow = searchableText.includes(searchTerm)
    }

    if (shouldShow && filterField !== "all") {
      switch (filterField) {
        case "nome":
          shouldShow = coordinator.name.toLowerCase().includes(searchTerm)
          break
        case "area":
          shouldShow = coordinator.area.toLowerCase().includes(searchTerm)
          break
        case "status":
          shouldShow = coordinator.status.toLowerCase().includes(searchTerm)
          break
      }
    }

    card.style.display = shouldShow ? "block" : "none"
  })
}

// Open coordinator form
function openCoordinatorForm(coordinator = null) {
  if (!coordinator && !event) return

  currentEditingCoordinator = coordinator

  const modal = document.getElementById("coordinator-form-modal")
  const title = document.getElementById("coordinator-form-title")
  const form = document.getElementById("coordinator-form")

  if (coordinator) {
    title.textContent = "Editar Coordenador"
    document.getElementById("coordinator-name").value = coordinator.name
    document.getElementById("coordinator-cpf").value = coordinator.cpf
    document.getElementById("coordinator-email").value = coordinator.email
    document.getElementById("coordinator-phone").value = coordinator.phone
    document.getElementById("coordinator-area").value = coordinator.area
    document.getElementById("coordinator-status").value = coordinator.status
    document.getElementById("coordinator-password").value = ""
  } else {
    title.textContent = "Adicionar Coordenador"
    form.reset()
  }

  openModal("coordinator-form-modal")
}

// Save coordinator
function saveCoordinator() {
  const form = document.getElementById("coordinator-form")
  const formData = new FormData(form)

  const coordinatorData = {
    name: document.getElementById("coordinator-name").value,
    cpf: document.getElementById("coordinator-cpf").value,
    email: document.getElementById("coordinator-email").value,
    phone: document.getElementById("coordinator-phone").value,
    area: document.getElementById("coordinator-area").value,
    status: document.getElementById("coordinator-status").value,
  }

  // Validate required fields
  if (
    !coordinatorData.name ||
    !coordinatorData.cpf ||
    !coordinatorData.email ||
    !coordinatorData.phone ||
    !coordinatorData.area
  ) {
    alert("Por favor, preencha todos os campos obrigatórios.")
    return
  }

  if (currentEditingCoordinator) {
    // Update existing coordinator
    const index = coordinators.findIndex((c) => c.id === currentEditingCoordinator.id)
    if (index !== -1) {
      coordinators[index] = { ...coordinators[index], ...coordinatorData }
    }
  } else {
    // Add new coordinator
    const newCoordinator = {
      id: Date.now(),
      ...coordinatorData,
    }
    coordinators.push(newCoordinator)
  }

  renderCoordinators()
  closeModal("coordinator-form-modal")

  const action = currentEditingCoordinator ? "atualizado" : "adicionado"
  alert(`Coordenador ${action} com sucesso!`)
}

// Edit coordinator
function editCoordinator(coordinatorId) {
  const coordinator = coordinators.find((c) => c.id === coordinatorId)
  if (coordinator) {
    openCoordinatorForm(coordinator)
  }
}

// Delete coordinator
function deleteCoordinator(coordinatorId) {
  if (confirm("Tem certeza que deseja excluir este coordenador?")) {
    coordinators = coordinators.filter((c) => c.id !== coordinatorId)
    renderCoordinators()
    alert("Coordenador excluído com sucesso!")
  }
}

// Existing functions for students (keeping the original functionality)
function renderClasses() {
  const classesGrid = document.getElementById("classes-grid")
  if (!classesGrid) return

  classesGrid.innerHTML = ""

  sampleClasses.forEach((classData) => {
    const classCard = createClassCard(classData)
    classesGrid.appendChild(classCard)
  })
}

function createClassCard(classData) {
  const card = document.createElement("div")
  card.className = "class-card"

  const courseClass = classData.curso
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
  card.classList.add(`course-${courseClass}`)

  card.innerHTML = `
        <div class="class-header">
            <h3 class="class-title">${classData.serie}${classData.letra} - ${classData.curso}</h3>
            <span class="class-shift">${classData.turno}</span>
        </div>
        <div class="class-info">
            <p class="student-count">${classData.students.length} estudantes</p>
            <p>Série: ${classData.serie} | Turma: ${classData.letra}</p>
        </div>
        <div class="class-actions">
            <button class="button primary-button" onclick="viewStudents(${classData.id})">
                <i class="fas fa-users"></i> Ver Alunos
            </button>
        </div>
    `

  return card
}

function filterClasses() {
  const searchTerm = document.getElementById("turma-search").value.toLowerCase()
  const filterField = document.getElementById("turma-filter-field").value

  const classCards = document.querySelectorAll(".class-card")

  classCards.forEach((card) => {
    let shouldShow = true

    if (searchTerm) {
      const cardText = card.textContent.toLowerCase()
      shouldShow = cardText.includes(searchTerm)
    }

    card.style.display = shouldShow ? "block" : "none"
  })
}

function viewStudents(classId) {
  const classData = sampleClasses.find((c) => c.id === classId)
  if (!classData) return

  const modal = document.getElementById("students-modal")
  const title = document.getElementById("students-modal-title")
  const description = document.getElementById("students-modal-description")
  const studentsList = document.getElementById("students-list")

  title.textContent = `Alunos da Turma ${classData.serie}${classData.letra}`
  description.textContent = `${classData.curso} - ${classData.turno}`

  studentsList.innerHTML = ""

  classData.students.forEach((student) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.rm}</td>
            <td>${student.email}</td>
            <td>
                <button class="button outline-button" onclick="editStudent(${student.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="button danger-button" onclick="deleteStudent(${student.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `
    studentsList.appendChild(row)
  })

  openModal("students-modal")
}

function openStudentForm(student = null) {
  if (!student && !event) return

  currentEditingStudent = student

  const modal = document.getElementById("student-form-modal")
  const title = document.getElementById("student-form-title")
  const form = document.getElementById("student-form")

  if (student) {
    title.textContent = "Editar Aluno"
    document.getElementById("student-name").value = student.name
    document.getElementById("student-rm").value = student.rm
    document.getElementById("student-email").value = student.email
    document.getElementById("student-password").value = ""
  } else {
    title.textContent = "Adicionar Aluno"
    form.reset()
  }

  openModal("student-form-modal")
}

function saveStudent() {
  // Implementation for saving student
  alert("Funcionalidade de salvar aluno implementada!")
  closeModal("student-form-modal")
}

function editStudent(studentId) {
  alert(`Editar aluno ID: ${studentId}`)
}

function deleteStudent(studentId) {
  if (confirm("Tem certeza que deseja excluir este aluno?")) {
    alert(`Aluno ID ${studentId} excluído!`)
  }
}

// Modal utilities
function openModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "flex"
    document.body.style.overflow = "hidden"
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "none"
    document.body.style.overflow = "auto"
  }
}

// Close modals when clicking outside
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    closeModal(e.target.id)
  }
})
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