document.addEventListener("DOMContentLoaded", () => {
  // Sample data
  const empresas = [
    {
      id: 1,
      nome: "TechSolutions",
      setor: "Tecnologia",
      contato: "contato@techsolutions.com",
      telefone: "(11) 9999-8888",
      endereco: "São Paulo, SP",
      disponibilidade: "Segunda a Sexta, 14h às 17h",
    },
    {
      id: 2,
      nome: "Inovação Digital",
      setor: "Marketing Digital",
      contato: "contato@inovacaodigital.com",
      telefone: "(11) 9999-7777",
      endereco: "São Paulo, SP",
      disponibilidade: "Terças e Quintas, 9h às 12h",
    },
    {
      id: 3,
      nome: "Construtech",
      setor: "Construção Civil",
      contato: "contato@construtech.com",
      telefone: "(11) 9999-6666",
      endereco: "São Paulo, SP",
      disponibilidade: "Quartas, 13h às 16h",
    },
  ]

  const palestrantes = [
    {
      id: 1,
      nome: "Ana Silva",
      area: "Inteligência Artificial",
      contato: "ana.silva@palestrante.com",
      telefone: "(11) 9999-5555",
      disponibilidade: "Segundas e Quartas, 19h às 21h",
      bio: "Especialista em IA com mais de 10 anos de experiência no mercado.",
    },
    {
      id: 2,
      nome: "Carlos Mendes",
      area: "Empreendedorismo",
      contato: "carlos.mendes@palestrante.com",
      telefone: "(11) 9999-4444",
      disponibilidade: "Terças e Quintas, 18h às 20h",
      bio: "Empreendedor serial com 3 startups de sucesso.",
    },
    {
      id: 3,
      nome: "Mariana Costa",
      area: "Design UX/UI",
      contato: "mariana.costa@palestrante.com",
      telefone: "(11) 9999-3333",
      disponibilidade: "Sextas, 14h às 18h",
      bio: "Designer com experiência em grandes empresas de tecnologia.",
    },
  ]

  const eventosAgendados = [
    {
      id: 1,
      titulo: "Visita Técnica - TechSolutions",
      tipo: "Visita Técnica",
      data: new Date(2025, 4, 20),
      horario: "14:00 - 16:00",
      local: "São Paulo, SP",
      empresa: "TechSolutions",
    },
    {
      id: 2,
      titulo: "Palestra: Inteligência Artificial",
      tipo: "Palestra",
      data: new Date(2025, 4, 22),
      horario: "19:00 - 21:00",
      local: "Online",
      palestrante: "Ana Silva",
    },
  ]

  const alunos = [
    {
      id: 1,
      nome: "João Silva",
      rm: "12345",
      curso: "Desenvolvimento de Sistemas",
      modulo: "3º Módulo",
      email: "joao.silva@etec.sp.gov.br",
    },
    {
      id: 2,
      nome: "Maria Oliveira",
      rm: "12346",
      curso: "Administração",
      modulo: "2º Módulo",
      email: "maria.oliveira@etec.sp.gov.br",
    },
    {
      id: 3,
      nome: "Pedro Santos",
      rm: "12347",
      curso: "Logística",
      modulo: "1º Módulo",
      email: "pedro.santos@etec.sp.gov.br",
    },
  ]

  // Tab switching
  const tabTriggers = document.querySelectorAll(".tab-trigger")
  const tabContents = document.querySelectorAll(".tab-content")

  tabTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      // Remove active class from all triggers and contents
      tabTriggers.forEach((t) => t.classList.remove("active"))
      tabContents.forEach((c) => c.classList.remove("active"))

      // Add active class to clicked trigger and corresponding content
      trigger.classList.add("active")
      const tabId = trigger.getAttribute("data-tab")
      document.getElementById(`${tabId}-tab`).classList.add("active")
    })
  })

  // Search functionality
  const searchInput = document.getElementById("search-input")
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase()

    // Filter and render empresas
    renderEmpresas(
      empresas.filter(
        (empresa) =>
          empresa.nome.toLowerCase().includes(searchTerm) || empresa.setor.toLowerCase().includes(searchTerm),
      ),
    )
  })

  const searchPalestrantes = document.getElementById("search-palestrantes")
  searchPalestrantes.addEventListener("input", () => {
    const searchTerm = searchPalestrantes.value.toLowerCase()

    // Filter and render palestrantes
    renderPalestrantes(
      palestrantes.filter(
        (palestrante) =>
          palestrante.nome.toLowerCase().includes(searchTerm) || palestrante.area.toLowerCase().includes(searchTerm),
      ),
    )
  })

  const searchAlunos = document.getElementById("search-alunos")
  searchAlunos.addEventListener("input", () => {
    const searchTerm = searchAlunos.value.toLowerCase()

    // Filter and render alunos
    renderAlunos(
      alunos.filter(
        (aluno) =>
          aluno.nome.toLowerCase().includes(searchTerm) ||
          aluno.rm.toLowerCase().includes(searchTerm) ||
          aluno.curso.toLowerCase().includes(searchTerm),
      ),
    )
  })

  // Render empresas
  function renderEmpresas(empresasList) {
    const empresasGrid = document.getElementById("empresas-grid")
    empresasGrid.innerHTML = ""

    empresasList.forEach((empresa) => {
      const card = document.createElement("div")
      card.className = "card company-card"

      const cardHeader = document.createElement("div")
      cardHeader.className = "card-header company-header"

      const cardTitle = document.createElement("h3")
      cardTitle.className = "company-title"
      cardTitle.textContent = empresa.nome

      const cardDescription = document.createElement("p")
      cardDescription.className = "company-sector"
      cardDescription.textContent = empresa.setor

      cardHeader.appendChild(cardTitle)
      cardHeader.appendChild(cardDescription)

      const cardContent = document.createElement("div")
      cardContent.className = "card-content"

      const companyDetails = document.createElement("div")
      companyDetails.className = "company-details"

      // Email
      const emailDetail = document.createElement("div")
      emailDetail.className = "company-detail"
      emailDetail.innerHTML = `<i class="fas fa-envelope"></i><span>${empresa.contato}</span>`

      // Phone
      const phoneDetail = document.createElement("div")
      phoneDetail.className = "company-detail"
      phoneDetail.innerHTML = `<i class="fas fa-phone"></i><span>${empresa.telefone}</span>`

      // Address
      const addressDetail = document.createElement("div")
      addressDetail.className = "company-detail"
      addressDetail.innerHTML = `<i class="fas fa-building"></i><span>${empresa.endereco}</span>`

      // Availability
      const availabilityDetail = document.createElement("div")
      availabilityDetail.className = "company-detail"
      availabilityDetail.innerHTML = `<i class="fas fa-calendar"></i><span>${empresa.disponibilidade}</span>`

      companyDetails.appendChild(emailDetail)
      companyDetails.appendChild(phoneDetail)
      companyDetails.appendChild(addressDetail)
      companyDetails.appendChild(availabilityDetail)

      cardContent.appendChild(companyDetails)

      const cardFooter = document.createElement("div")
      cardFooter.className = "card-footer"

      const scheduleButton = document.createElement("button")
      scheduleButton.className = "button outline-button full-width"
      scheduleButton.textContent = "Agendar Visita"
      scheduleButton.addEventListener("click", () => openVisitModal(empresa))

      cardFooter.appendChild(scheduleButton)

      card.appendChild(cardHeader)
      card.appendChild(cardContent)
      card.appendChild(cardFooter)

      empresasGrid.appendChild(card)
    })
  }

  // Render palestrantes
  function renderPalestrantes(palestrantesList) {
    const palestrantesGrid = document.getElementById("palestrantes-grid")
    palestrantesGrid.innerHTML = ""

    palestrantesList.forEach((palestrante) => {
      const card = document.createElement("div")
      card.className = "card speaker-card"

      const cardHeader = document.createElement("div")
      cardHeader.className = "card-header speaker-header"

      const cardTitle = document.createElement("h3")
      cardTitle.className = "speaker-title"
      cardTitle.textContent = palestrante.nome

      const cardDescription = document.createElement("p")
      cardDescription.className = "speaker-area"
      cardDescription.textContent = palestrante.area

      cardHeader.appendChild(cardTitle)
      cardHeader.appendChild(cardDescription)

      const cardContent = document.createElement("div")
      cardContent.className = "card-content"

      const speakerBio = document.createElement("p")
      speakerBio.className = "speaker-bio"
      speakerBio.textContent = palestrante.bio

      const speakerDetails = document.createElement("div")
      speakerDetails.className = "speaker-details"

      // Email
      const emailDetail = document.createElement("div")
      emailDetail.className = "speaker-detail"
      emailDetail.innerHTML = `<i class="fas fa-envelope"></i><span>${palestrante.contato}</span>`

      // Phone
      const phoneDetail = document.createElement("div")
      phoneDetail.className = "speaker-detail"
      phoneDetail.innerHTML = `<i class="fas fa-phone"></i><span>${palestrante.telefone}</span>`

      // Availability
      const availabilityDetail = document.createElement("div")
      availabilityDetail.className = "speaker-detail"
      availabilityDetail.innerHTML = `<i class="fas fa-calendar"></i><span>${palestrante.disponibilidade}</span>`

      speakerDetails.appendChild(emailDetail)
      speakerDetails.appendChild(phoneDetail)
      speakerDetails.appendChild(availabilityDetail)

      cardContent.appendChild(speakerBio)
      cardContent.appendChild(speakerDetails)

      const cardFooter = document.createElement("div")
      cardFooter.className = "card-footer"

      const scheduleButton = document.createElement("button")
      scheduleButton.className = "button outline-button full-width"
      scheduleButton.textContent = "Agendar Palestra"
      scheduleButton.addEventListener("click", () => openLectureModal(palestrante))

      cardFooter.appendChild(scheduleButton)

      card.appendChild(cardHeader)
      card.appendChild(cardContent)
      card.appendChild(cardFooter)

      palestrantesGrid.appendChild(card)
    })
  }

  // Render eventos agendados
  function renderEventosAgendados() {
    const eventosAgendadosList = document.getElementById("eventos-agendados-list")
    eventosAgendadosList.innerHTML = ""

    eventosAgendados.forEach((evento) => {
      const eventItem = document.createElement("div")
      eventItem.className = "event-item"

      const eventHeader = document.createElement("div")
      eventHeader.className = "event-header"

      const eventInfo = document.createElement("div")

      const eventTitle = document.createElement("h3")
      eventTitle.className = "event-title"
      eventTitle.textContent = evento.titulo

      const eventDate = document.createElement("p")
      eventDate.className = "event-date"
      eventDate.textContent = `${formatDate(evento.data)} • ${evento.horario}`

      eventInfo.appendChild(eventTitle)
      eventInfo.appendChild(eventDate)

      const eventBadge = document.createElement("div")
      eventBadge.className = "event-badge"
      eventBadge.textContent = evento.tipo

      eventHeader.appendChild(eventInfo)
      eventHeader.appendChild(eventBadge)

      const eventDetails = document.createElement("div")
      eventDetails.className = "event-details"

      const eventLocation = document.createElement("p")
      eventLocation.textContent = `Local: ${evento.local}`

      eventDetails.appendChild(eventLocation)

      if (evento.empresa) {
        const eventCompany = document.createElement("p")
        eventCompany.textContent = `Empresa: ${evento.empresa}`
        eventDetails.appendChild(eventCompany)
      }

      if (evento.palestrante) {
        const eventSpeaker = document.createElement("p")
        eventSpeaker.textContent = `Palestrante: ${evento.palestrante}`
        eventDetails.appendChild(eventSpeaker)
      }

      eventItem.appendChild(eventHeader)
      eventItem.appendChild(eventDetails)

      eventosAgendadosList.appendChild(eventItem)
    })
  }

  // Render alunos
  function renderAlunos(alunosList) {
    const studentsList = document.getElementById("students-list")
    studentsList.innerHTML = ""

    alunosList.forEach((aluno) => {
      const row = document.createElement("tr")

      const nameCell = document.createElement("td")
      nameCell.textContent = aluno.nome

      const rmCell = document.createElement("td")
      rmCell.textContent = aluno.rm

      const courseCell = document.createElement("td")
      courseCell.textContent = aluno.curso

      const moduleCell = document.createElement("td")
      moduleCell.textContent = aluno.modulo

      const emailCell = document.createElement("td")
      emailCell.textContent = aluno.email

      const actionsCell = document.createElement("td")
      const actionsDiv = document.createElement("div")
      actionsDiv.className = "table-actions"

      const editButton = document.createElement("button")
      editButton.className = "table-action edit"
      editButton.innerHTML = '<i class="fas fa-edit"></i>'
      editButton.title = "Editar"
      editButton.addEventListener("click", () => editAluno(aluno.id))

      const deleteButton = document.createElement("button")
      deleteButton.className = "table-action delete"
      deleteButton.innerHTML = '<i class="fas fa-trash"></i>'
      deleteButton.title = "Excluir"
      deleteButton.addEventListener("click", () => excluirAluno(aluno.id))

      actionsDiv.appendChild(editButton)
      actionsDiv.appendChild(deleteButton)
      actionsCell.appendChild(actionsDiv)

      row.appendChild(nameCell)
      row.appendChild(rmCell)
      row.appendChild(courseCell)
      row.appendChild(moduleCell)
      row.appendChild(emailCell)
      row.appendChild(actionsCell)

      studentsList.appendChild(row)
    })
  }

  // Schedule Event Modal
  const scheduleEventModal = document.getElementById("schedule-event-modal")
  const scheduleEventBtn = document.getElementById("schedule-event-btn")
  const closeScheduleModalBtn = document.getElementById("close-schedule-modal")
  const confirmScheduleBtn = document.getElementById("confirm-schedule")

  scheduleEventBtn.addEventListener("click", () => {
    scheduleEventModal.style.display = "flex"
  })

  closeScheduleModalBtn.addEventListener("click", () => {
    scheduleEventModal.style.display = "none"
  })

  confirmScheduleBtn.addEventListener("click", () => {
    // Get form values
    const eventTitle = document.getElementById("event-title").value
    const eventDate = document.getElementById("event-date").value
    const eventTime = document.getElementById("event-time").value
    const eventDescription = document.getElementById("event-description").value

    if (eventTitle && eventDate && eventTime) {
      alert(`Evento "${eventTitle}" agendado com sucesso!`)
      scheduleEventModal.style.display = "none"

      // Reset form
      document.getElementById("event-title").value = ""
      document.getElementById("event-date").value = ""
      document.getElementById("event-time").value = ""
      document.getElementById("event-description").value = ""
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.")
    }
  })

  // Visit Modal
  const scheduleVisitModal = document.getElementById("schedule-visit-modal")
  const closeVisitModalBtn = document.getElementById("close-visit-modal")
  const confirmVisitBtn = document.getElementById("confirm-visit")
  let selectedEmpresa = null

  function openVisitModal(empresa) {
    selectedEmpresa = empresa

    // Update modal description
    document.getElementById("visit-modal-description").textContent =
      `Preencha os detalhes para agendar uma visita à ${empresa.nome}.`

    // Set default title
    document.getElementById("visit-title").value = `Visita Técnica - ${empresa.nome}`

    // Show modal
    scheduleVisitModal.style.display = "flex"
  }

  closeVisitModalBtn.addEventListener("click", () => {
    scheduleVisitModal.style.display = "none"
  })

  confirmVisitBtn.addEventListener("click", () => {
    // Get form values
    const visitTitle = document.getElementById("visit-title").value
    const visitDate = document.getElementById("visit-date").value
    const visitTime = document.getElementById("visit-time").value
    const visitDescription = document.getElementById("visit-description").value

    if (visitTitle && visitDate && visitTime) {
      alert(`Visita "${visitTitle}" agendada com sucesso!`)
      scheduleVisitModal.style.display = "none"

      // Reset form
      document.getElementById("visit-title").value = ""
      document.getElementById("visit-date").value = ""
      document.getElementById("visit-time").value = ""
      document.getElementById("visit-description").value = ""
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.")
    }
  })

  // Lecture Modal
  const scheduleLectureModal = document.getElementById("schedule-lecture-modal")
  const closeLectureModalBtn = document.getElementById("close-lecture-modal")
  const confirmLectureBtn = document.getElementById("confirm-lecture")
  let selectedPalestrante = null

  function openLectureModal(palestrante) {
    selectedPalestrante = palestrante

    // Update modal description
    document.getElementById("lecture-modal-description").textContent =
      `Preencha os detalhes para agendar uma palestra com ${palestrante.nome}.`

    // Set default title
    document.getElementById("lecture-title").value = `Palestra: ${palestrante.area}`

    // Show modal
    scheduleLectureModal.style.display = "flex"
  }

  closeLectureModalBtn.addEventListener("click", () => {
    scheduleLectureModal.style.display = "none"
  })

  confirmLectureBtn.addEventListener("click", () => {
    // Get form values
    const lectureTitle = document.getElementById("lecture-title").value
    const lectureDate = document.getElementById("lecture-date").value
    const lectureTime = document.getElementById("lecture-time").value
    const lectureDescription = document.getElementById("lecture-description").value

    if (lectureTitle && lectureDate && lectureTime) {
      alert(`Palestra "${lectureTitle}" agendada com sucesso!`)
      scheduleLectureModal.style.display = "none"

      // Reset form
      document.getElementById("lecture-title").value = ""
      document.getElementById("lecture-date").value = ""
      document.getElementById("lecture-time").value = ""
      document.getElementById("lecture-description").value = ""
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.")
    }
  })

  // Add Student Modal
  const addStudentModal = document.getElementById("add-student-modal")
  const addStudentBtn = document.getElementById("add-student-btn")
  const closeStudentModalBtn = document.getElementById("close-student-modal")
  const confirmAddStudentBtn = document.getElementById("confirm-add-student")

  addStudentBtn.addEventListener("click", () => {
    addStudentModal.style.display = "flex"
  })

  closeStudentModalBtn.addEventListener("click", () => {
    addStudentModal.style.display = "none"
  })

  confirmAddStudentBtn.addEventListener("click", () => {
    // Get form values
    const studentName = document.getElementById("student-name").value
    const studentRM = document.getElementById("student-rm").value
    const studentCourse = document.getElementById("student-course").value
    const studentModule = document.getElementById("student-module").value
    const studentEmail = document.getElementById("student-email").value
    const studentPassword = document.getElementById("student-password").value

    if (studentName && studentRM && studentCourse && studentModule && studentEmail && studentPassword) {
      alert(`Aluno "${studentName}" adicionado com sucesso!`)
      addStudentModal.style.display = "none"

      // Reset form
      document.getElementById("student-name").value = ""
      document.getElementById("student-rm").value = ""
      document.getElementById("student-course").value = ""
      document.getElementById("student-module").value = ""
      document.getElementById("student-email").value = ""
      document.getElementById("student-password").value = ""

      // In a real application, we would add the new student to the list
      // and re-render the list
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.")
    }
  })

  // Edit student
  function editAluno(id) {
    alert(`Editar aluno ${id}`)
    // In a real application, we would open a modal with the student data
    // and allow the user to edit it
  }

  // Delete student
  function excluirAluno(id) {
    if (confirm("Tem certeza que deseja excluir este aluno?")) {
      alert(`Aluno ${id} excluído com sucesso!`)
      // In a real application, we would remove the student from the list
      // and re-render the list
    }
  }

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === scheduleEventModal) {
      scheduleEventModal.style.display = "none"
    }
    if (e.target === scheduleVisitModal) {
      scheduleVisitModal.style.display = "none"
    }
    if (e.target === scheduleLectureModal) {
      scheduleLectureModal.style.display = "none"
    }
    if (e.target === addStudentModal) {
      addStudentModal.style.display = "none"
    }
  })

  // Helper function to format date
  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  // Initial render
  renderEmpresas(empresas)
  renderPalestrantes(palestrantes)
  renderEventosAgendados()
  renderAlunos(alunos)
})
