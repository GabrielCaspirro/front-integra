document.addEventListener("DOMContentLoaded", () => {
  // Sample data
  const palestras = [
    {
      id: 1,
      titulo: "Inteligência Artificial: Tendências e Aplicações",
      empresa: "TechSolutions",
      data: new Date(2025, 5, 15),
      horario: "19:00 - 21:00",
      local: "Online",
      descricao: "Palestra sobre as tendências e aplicações da Inteligência Artificial no mercado atual.",
      vagas: 50,
      vagasDisponiveis: 35,
    },
    {
      id: 2,
      titulo: "Design Thinking para Desenvolvedores",
      empresa: "Inovação Digital",
      data: new Date(2025, 5, 22),
      horario: "18:00 - 20:00",
      local: "São Paulo, SP",
      descricao:
        "Como aplicar o Design Thinking no desenvolvimento de software para criar produtos mais centrados no usuário.",
      vagas: 30,
      vagasDisponiveis: 15,
    },
    {
      id: 3,
      titulo: "Carreira em Desenvolvimento Web",
      empresa: "WebDev Solutions",
      data: new Date(2025, 6, 5),
      horario: "19:00 - 21:00",
      local: "Online",
      descricao: "Dicas e estratégias para construir uma carreira sólida em desenvolvimento web.",
      vagas: 100,
      vagasDisponiveis: 78,
    },
  ]

  const empresas = [
    {
      id: 1,
      nome: "TechSolutions",
      setor: "Tecnologia",
      descricao: "Empresa líder em soluções tecnológicas para o mercado corporativo.",
      endereco: "São Paulo, SP",
      site: "www.techsolutions.com",
      contato: "contato@techsolutions.com",
      telefone: "(11) 9999-8888",
      vagasPalestrantes: true,
    },
    {
      id: 2,
      nome: "Inovação Digital",
      setor: "Marketing Digital",
      descricao: "Agência especializada em marketing digital e transformação digital para empresas.",
      endereco: "São Paulo, SP",
      site: "www.inovacaodigital.com",
      contato: "contato@inovacaodigital.com",
      telefone: "(11) 9999-7777",
      vagasPalestrantes: true,
    },
    {
      id: 3,
      nome: "Construtech",
      setor: "Construção Civil",
      descricao: "Empresa de tecnologia para o setor de construção civil.",
      endereco: "São Paulo, SP",
      site: "www.construtech.com",
      contato: "contato@construtech.com",
      telefone: "(11) 9999-6666",
      vagasPalestrantes: false,
    },
  ]

  const meusEventos = [
    {
      id: 1,
      tipo: "palestra",
      titulo: "Inteligência Artificial: Tendências e Aplicações",
      empresa: "TechSolutions",
      data: new Date(2025, 5, 15),
      horario: "19:00 - 21:00",
      local: "Online",
      status: "confirmado",
    },
    {
      id: 2,
      tipo: "empresa",
      empresa: "Inovação Digital",
      dataInscricao: new Date(2025, 4, 10),
      status: "pendente",
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
  const searchPalestras = document.getElementById("search-palestras")
  searchPalestras.addEventListener("input", () => {
    const searchTerm = searchPalestras.value.toLowerCase()

    // Filter and render palestras
    renderPalestras(
      palestras.filter(
        (palestra) =>
          palestra.titulo.toLowerCase().includes(searchTerm) || palestra.empresa.toLowerCase().includes(searchTerm),
      ),
    )
  })

  const searchEmpresas = document.getElementById("search-empresas")
  searchEmpresas.addEventListener("input", () => {
    const searchTerm = searchEmpresas.value.toLowerCase()

    // Filter and render empresas
    renderEmpresas(
      empresas.filter(
        (empresa) =>
          empresa.nome.toLowerCase().includes(searchTerm) || empresa.setor.toLowerCase().includes(searchTerm),
      ),
    )
  })

  // Render palestras
  function renderPalestras(palestrasList) {
    const palestrasGrid = document.getElementById("palestras-grid")
    palestrasGrid.innerHTML = ""

    palestrasList.forEach((palestra) => {
      const card = document.createElement("div")
      card.className = "event-card"

      const header = document.createElement("div")
      header.className = "event-header"

      const title = document.createElement("h3")
      title.className = "event-title"
      title.textContent = palestra.titulo

      const meta = document.createElement("div")
      meta.className = "event-meta"
      meta.innerHTML = `
        <i class="fas fa-building"></i>
        <span>${palestra.empresa}</span>
        <span>•</span>
        <span>${formatDate(palestra.data)}</span>
      `

      header.appendChild(title)
      header.appendChild(meta)

      const content = document.createElement("div")
      content.className = "event-content"

      const description = document.createElement("p")
      description.className = "event-description"
      description.textContent = palestra.descricao

      const details = document.createElement("div")
      details.className = "event-details"

      // Time
      const timeDetail = document.createElement("div")
      timeDetail.className = "event-detail"
      timeDetail.innerHTML = `<i class="fas fa-clock"></i><span>${palestra.horario}</span>`

      // Location
      const locationDetail = document.createElement("div")
      locationDetail.className = "event-detail"
      locationDetail.innerHTML = `<i class="fas fa-map-marker-alt"></i><span>${palestra.local}</span>`

      // Available spots
      const spotsDetail = document.createElement("div")
      spotsDetail.className = "event-detail"
      spotsDetail.innerHTML = `<i class="fas fa-users"></i><span>Vagas disponíveis: ${palestra.vagasDisponiveis} de ${palestra.vagas}</span>`

      details.appendChild(timeDetail)
      details.appendChild(locationDetail)
      details.appendChild(spotsDetail)

      content.appendChild(description)
      content.appendChild(details)

      const footer = document.createElement("div")
      footer.className = "event-footer"

      const registerButton = document.createElement("button")
      registerButton.className = "button primary-button full-width"
      registerButton.textContent = "Inscrever-se"
      registerButton.addEventListener("click", () => openRegisterModal(palestra))

      footer.appendChild(registerButton)

      card.appendChild(header)
      card.appendChild(content)
      card.appendChild(footer)

      palestrasGrid.appendChild(card)
    })
  }

  // Render empresas
  function renderEmpresas(empresasList) {
    const empresasGrid = document.getElementById("empresas-grid")
    empresasGrid.innerHTML = ""

    empresasList.forEach((empresa) => {
      const card = document.createElement("div")
      card.className = "company-card"

      const header = document.createElement("div")
      header.className = "company-header"

      const title = document.createElement("h3")
      title.className = "company-title"
      title.textContent = empresa.nome

      const sector = document.createElement("p")
      sector.className = "company-sector"
      sector.textContent = empresa.setor

      header.appendChild(title)
      header.appendChild(sector)

      const content = document.createElement("div")
      content.className = "company-content"

      const description = document.createElement("p")
      description.className = "company-description"
      description.textContent = empresa.descricao

      const details = document.createElement("div")
      details.className = "company-details"

      // Address
      const addressDetail = document.createElement("div")
      addressDetail.className = "company-detail"
      addressDetail.innerHTML = `<i class="fas fa-map-marker-alt"></i><span>${empresa.endereco}</span>`

      // Website
      const websiteDetail = document.createElement("div")
      websiteDetail.className = "company-detail"
      websiteDetail.innerHTML = `<i class="fas fa-globe"></i><span>${empresa.site}</span>`

      // Email
      const emailDetail = document.createElement("div")
      emailDetail.className = "company-detail"
      emailDetail.innerHTML = `<i class="fas fa-envelope"></i><span>${empresa.contato}</span>`

      // Phone
      const phoneDetail = document.createElement("div")
      phoneDetail.className = "company-detail"
      phoneDetail.innerHTML = `<i class="fas fa-phone"></i><span>${empresa.telefone}</span>`

      details.appendChild(addressDetail)
      details.appendChild(websiteDetail)
      details.appendChild(emailDetail)
      details.appendChild(phoneDetail)

      content.appendChild(description)
      content.appendChild(details)

      const footer = document.createElement("div")
      footer.className = "company-footer"

      const applyButton = document.createElement("button")
      applyButton.className = "button primary-button full-width"

      if (empresa.vagasPalestrantes) {
        applyButton.textContent = "Inscrever-se como Palestrante"
        applyButton.addEventListener("click", () => openApplyModal(empresa))
      } else {
        applyButton.textContent = "Sem vagas para palestrantes"
        applyButton.disabled = true
        applyButton.classList.add("disabled")
      }

      footer.appendChild(applyButton)

      card.appendChild(header)
      card.appendChild(content)
      card.appendChild(footer)

      empresasGrid.appendChild(card)
    })
  }

  // Render meus eventos
  function renderMeusEventos() {
    const eventosAgendadosList = document.getElementById("eventos-agendados-list")
    eventosAgendadosList.innerHTML = ""

    if (meusEventos.length > 0) {
      meusEventos.forEach((evento) => {
        const eventItem = document.createElement("div")
        eventItem.className = "my-event"

        const eventHeader = document.createElement("div")
        eventHeader.className = "my-event-header"

        const eventTitle = document.createElement("h3")
        eventTitle.className = "my-event-title"

        const eventBadge = document.createElement("span")
        eventBadge.className = "my-event-badge"

        if (evento.tipo === "palestra") {
          eventTitle.textContent = evento.titulo
          eventBadge.textContent = "Palestra"
          eventBadge.classList.add("lecture")
        } else if (evento.tipo === "empresa") {
          eventTitle.textContent = `Inscrição na ${evento.empresa}`

          if (evento.status === "pendente") {
            eventBadge.textContent = "Pendente"
            eventBadge.classList.add("pending")
          } else {
            eventBadge.textContent = "Empresa"
            eventBadge.classList.add("company")
          }
        }

        eventHeader.appendChild(eventTitle)
        eventHeader.appendChild(eventBadge)

        const eventDetails = document.createElement("div")
        eventDetails.className = "my-event-details"

        if (evento.tipo === "palestra") {
          eventDetails.innerHTML = `
            <p>Empresa: ${evento.empresa}</p>
            <p>Local: ${evento.local}</p>
            <p>Data: ${formatDate(evento.data)} • ${evento.horario}</p>
          `
        } else if (evento.tipo === "empresa") {
          eventDetails.innerHTML = `
            <p>Data de inscrição: ${formatDate(evento.dataInscricao)}</p>
            <p>Status: ${evento.status === "pendente" ? "Aguardando aprovação" : "Aprovado"}</p>
          `
        }

        eventItem.appendChild(eventHeader)
        eventItem.appendChild(eventDetails)

        eventosAgendadosList.appendChild(eventItem)
      })
    } else {
      const noEvents = document.createElement("div")
      noEvents.className = "no-events-message"
      noEvents.innerHTML = `
        <i class="fas fa-calendar"></i>
        <h3>Nenhum evento agendado</h3>
        <p>Quando você se inscrever em palestras ou empresas, eles aparecerão aqui.</p>
      `
      eventosAgendadosList.appendChild(noEvents)
    }
  }

  // Apply to Company Modal
  const applyCompanyModal = document.getElementById("apply-company-modal")
  const closeApplyModalBtn = document.getElementById("close-apply-modal")
  const confirmApplyBtn = document.getElementById("confirm-apply")
  let selectedEmpresa = null

  function openApplyModal(empresa) {
    selectedEmpresa = empresa

    // Update modal description
    document.getElementById("company-modal-description").textContent =
      `Preencha os detalhes para se inscrever como palestrante na ${empresa.nome}.`

    // Show modal
    applyCompanyModal.style.display = "flex"
  }

  closeApplyModalBtn.addEventListener("click", () => {
    applyCompanyModal.style.display = "none"
  })

  confirmApplyBtn.addEventListener("click", () => {
    // Get form values
    const motivation = document.getElementById("apply-motivation").value
    const experience = document.getElementById("apply-experience").value
    const availability = document.getElementById("apply-availability").value

    if (motivation && experience && availability) {
      alert(`Inscrição enviada para ${selectedEmpresa.nome} com sucesso!`)
      applyCompanyModal.style.display = "none"

      // Reset form
      document.getElementById("apply-motivation").value = ""
      document.getElementById("apply-experience").value = ""
      document.getElementById("apply-availability").value = ""
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.")
    }
  })

  // Register for Lecture Modal
  const registerLectureModal = document.getElementById("register-lecture-modal")
  const closeRegisterModalBtn = document.getElementById("close-register-modal")
  const confirmRegisterBtn = document.getElementById("confirm-register")
  let selectedPalestra = null

  function openRegisterModal(palestra) {
    selectedPalestra = palestra

    // Update modal description
    document.getElementById("lecture-modal-description").textContent =
      `Confirme sua inscrição na palestra "${palestra.titulo}".`

    // Show modal
    registerLectureModal.style.display = "flex"
  }

  closeRegisterModalBtn.addEventListener("click", () => {
    registerLectureModal.style.display = "none"
  })

  confirmRegisterBtn.addEventListener("click", () => {
    // Get form values
    const notes = document.getElementById("register-notes").value

    alert(`Inscrição confirmada para a palestra "${selectedPalestra.titulo}"!`)
    registerLectureModal.style.display = "none"

    // Reset form
    document.getElementById("register-notes").value = ""
  })

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === applyCompanyModal) {
      applyCompanyModal.style.display = "none"
    }
    if (e.target === registerLectureModal) {
      registerLectureModal.style.display = "none"
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
  renderPalestras(palestras)
  renderEmpresas(empresas)
  renderMeusEventos()
})
