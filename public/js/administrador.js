document.addEventListener("DOMContentLoaded", () => {
  // Sample data
  const estudantes = [
    {
      id: 1,
      nome: "Ana Silva",
      email: "ana.silva@etec.sp.gov.br",
      etec: "ETEC São Paulo",
      curso: "Desenvolvimento de Sistemas",
    },
    {
      id: 2,
      nome: "Bruno Santos",
      email: "bruno.santos@etec.sp.gov.br",
      etec: "ETEC São Paulo",
      curso: "Redes de Computadores",
    },
    {
      id: 3,
      nome: "Carla Oliveira",
      email: "carla.oliveira@etec.sp.gov.br",
      etec: "ETEC Guarulhos",
      curso: "Administração",
    },
    {
      id: 4,
      nome: "Daniel Pereira",
      email: "daniel.pereira@etec.sp.gov.br",
      etec: "ETEC Osasco",
      curso: "Desenvolvimento de Sistemas",
    },
    {
      id: 5,
      nome: "Eduarda Lima",
      email: "eduarda.lima@etec.sp.gov.br",
      etec: "ETEC São Paulo",
      curso: "Marketing",
    },
  ]

  const coordenadores = [
    {
      id: 1,
      nome: "Fernando Costa",
      email: "fernando.costa@etec.sp.gov.br",
      etec: "ETEC São Paulo",
      departamento: "Tecnologia da Informação",
    },
    {
      id: 2,
      nome: "Gabriela Martins",
      email: "gabriela.martins@etec.sp.gov.br",
      etec: "ETEC Guarulhos",
      departamento: "Gestão e Negócios",
    },
    {
      id: 3,
      nome: "Henrique Alves",
      email: "henrique.alves@etec.sp.gov.br",
      etec: "ETEC Osasco",
      departamento: "Tecnologia da Informação",
    },
  ]

  const empresas = [
    {
      id: 1,
      nome: "TechSolutions",
      email: "contato@techsolutions.com",
      setor: "Tecnologia",
      cidade: "São Paulo",
    },
    {
      id: 2,
      nome: "Inovação Digital",
      email: "contato@inovacaodigital.com",
      setor: "Marketing Digital",
      cidade: "São Paulo",
    },
    {
      id: 3,
      nome: "Construtech",
      email: "contato@construtech.com",
      setor: "Construção Civil",
      cidade: "São Paulo",
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

    // Filter and render estudantes
    renderEstudantes(
      estudantes.filter(
        (estudante) =>
          estudante.nome.toLowerCase().includes(searchTerm) || estudante.email.toLowerCase().includes(searchTerm),
      ),
    )

    // Filter and render coordenadores
    renderCoordenadores(
      coordenadores.filter(
        (coordenador) =>
          coordenador.nome.toLowerCase().includes(searchTerm) || coordenador.email.toLowerCase().includes(searchTerm),
      ),
    )

    // Filter and render empresas
    renderEmpresas(
      empresas.filter(
        (empresa) =>
          empresa.nome.toLowerCase().includes(searchTerm) || empresa.email.toLowerCase().includes(searchTerm),
      ),
    )
  })

  // Render estudantes
  function renderEstudantes(estudantesList) {
    const tableBody = document.getElementById("estudantes-table-body")
    tableBody.innerHTML = ""

    estudantesList.forEach((estudante) => {
      const row = document.createElement("tr")

      const nameCell = document.createElement("td")
      nameCell.className = "font-medium"
      nameCell.textContent = estudante.nome

      const emailCell = document.createElement("td")
      emailCell.textContent = estudante.email

      const etecCell = document.createElement("td")
      etecCell.textContent = estudante.etec

      const cursoCell = document.createElement("td")
      cursoCell.textContent = estudante.curso

      const actionsCell = document.createElement("td")

      const deleteButton = document.createElement("button")
      deleteButton.className = "action-button delete"
      deleteButton.innerHTML = '<i class="fas fa-trash"></i>'
      deleteButton.title = "Remover"
      deleteButton.addEventListener("click", () => removerUsuario(estudante.id, "estudante"))

      actionsCell.appendChild(deleteButton)

      row.appendChild(nameCell)
      row.appendChild(emailCell)
      row.appendChild(etecCell)
      row.appendChild(cursoCell)
      row.appendChild(actionsCell)

      tableBody.appendChild(row)
    })
  }

  // Render coordenadores
  function renderCoordenadores(coordenadoresList) {
    const tableBody = document.getElementById("coordenadores-table-body")
    tableBody.innerHTML = ""

    coordenadoresList.forEach((coordenador) => {
      const row = document.createElement("tr")

      const nameCell = document.createElement("td")
      nameCell.className = "font-medium"
      nameCell.textContent = coordenador.nome

      const emailCell = document.createElement("td")
      emailCell.textContent = coordenador.email

      const etecCell = document.createElement("td")
      etecCell.textContent = coordenador.etec

      const departamentoCell = document.createElement("td")
      departamentoCell.textContent = coordenador.departamento

      const actionsCell = document.createElement("td")

      const deleteButton = document.createElement("button")
      deleteButton.className = "action-button delete"
      deleteButton.innerHTML = '<i class="fas fa-trash"></i>'
      deleteButton.title = "Remover"
      deleteButton.addEventListener("click", () => removerUsuario(coordenador.id, "coordenador"))

      actionsCell.appendChild(deleteButton)

      row.appendChild(nameCell)
      row.appendChild(emailCell)
      row.appendChild(etecCell)
      row.appendChild(departamentoCell)
      row.appendChild(actionsCell)

      tableBody.appendChild(row)
    })
  }

  // Render empresas
  function renderEmpresas(empresasList) {
    const tableBody = document.getElementById("empresas-table-body")
    tableBody.innerHTML = ""

    empresasList.forEach((empresa) => {
      const row = document.createElement("tr")

      const nameCell = document.createElement("td")
      nameCell.className = "font-medium"
      nameCell.textContent = empresa.nome

      const emailCell = document.createElement("td")
      emailCell.textContent = empresa.email

      const setorCell = document.createElement("td")
      setorCell.textContent = empresa.setor

      const cidadeCell = document.createElement("td")
      cidadeCell.textContent = empresa.cidade

      const actionsCell = document.createElement("td")

      const deleteButton = document.createElement("button")
      deleteButton.className = "action-button delete"
      deleteButton.innerHTML = '<i class="fas fa-trash"></i>'
      deleteButton.title = "Remover"
      deleteButton.addEventListener("click", () => removerUsuario(empresa.id, "empresa"))

      actionsCell.appendChild(deleteButton)

      row.appendChild(nameCell)
      row.appendChild(emailCell)
      row.appendChild(setorCell)
      row.appendChild(cidadeCell)
      row.appendChild(actionsCell)

      tableBody.appendChild(row)
    })
  }

  // Add user modal
  const addUserModal = document.getElementById("add-user-modal")
  const addUserBtn = document.getElementById("add-user-btn")
  const closeUserModalBtn = document.getElementById("close-user-modal")
  const confirmAddUserBtn = document.getElementById("confirm-add-user")
  const userTypeSelect = document.getElementById("user-type")

  // Show/hide fields based on user type
  userTypeSelect.addEventListener("change", () => {
    const userType = userTypeSelect.value

    // Hide all conditional fields
    document.getElementById("etec-field").classList.add("hidden")
    document.getElementById("curso-field").classList.add("hidden")
    document.getElementById("departamento-field").classList.add("hidden")
    document.getElementById("empresa-fields").classList.add("hidden")

    // Show fields based on user type
    if (userType === "estudante" || userType === "coordenador") {
      document.getElementById("etec-field").classList.remove("hidden")
    }

    if (userType === "estudante") {
      document.getElementById("curso-field").classList.remove("hidden")
    }

    if (userType === "coordenador") {
      document.getElementById("departamento-field").classList.remove("hidden")
    }

    if (userType === "empresa") {
      document.getElementById("empresa-fields").classList.remove("hidden")
    }
  })

  addUserBtn.addEventListener("click", () => {
    addUserModal.style.display = "flex"
  })

  closeUserModalBtn.addEventListener("click", () => {
    addUserModal.style.display = "none"
  })

  confirmAddUserBtn.addEventListener("click", () => {
    // Get form values
    const name = document.getElementById("user-name").value
    const email = document.getElementById("user-email").value
    const userType = document.getElementById("user-type").value

    if (name && email && userType) {
      alert(`Usuário "${name}" adicionado com sucesso!`)
      addUserModal.style.display = "none"

      // Reset form
      document.getElementById("user-name").value = ""
      document.getElementById("user-email").value = ""
      document.getElementById("user-type").value = ""
      document.getElementById("user-etec").value = ""
      document.getElementById("user-curso").value = ""
      document.getElementById("user-departamento").value = ""
      document.getElementById("empresa-name").value = ""
      document.getElementById("empresa-setor").value = ""

      // Hide all conditional fields
      document.getElementById("etec-field").classList.add("hidden")
      document.getElementById("curso-field").classList.add("hidden")
      document.getElementById("departamento-field").classList.add("hidden")
      document.getElementById("empresa-fields").classList.add("hidden")
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.")
    }
  })

  // Remove user
  function removerUsuario(id, tipo) {
    if (confirm(`Tem certeza que deseja remover este ${tipo}?`)) {
      alert(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} com ID ${id} removido com sucesso!`)
      // In a real application, we would remove the user from the list
      // and re-render the list
    }
  }

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === addUserModal) {
      addUserModal.style.display = "none"
    }
  })

  // Initial render
  renderEstudantes(estudantes)
  renderCoordenadores(coordenadores)
  renderEmpresas(empresas)
})
