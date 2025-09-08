document.addEventListener("DOMContentLoaded", () => {
  // Sample events data
  const events = [
    {
      id: 1,
      title: "Visita Técnica - Empresa de Software",
      date: new Date(2025, 4, 20), // 20 de maio de 2025
      type: "Visita Técnica",
      location: "São Paulo, SP",
      description:
        "Visita à empresa de desenvolvimento de software para conhecer o ambiente de trabalho e as tecnologias utilizadas.",
    },
    {
      id: 2,
      title: "Palestra: Inteligência Artificial",
      date: new Date(2025, 4, 22), // 22 de maio de 2025
      type: "Palestra",
      location: "Online",
      description: "Palestra sobre os avanços da Inteligência Artificial e suas aplicações no mercado de trabalho.",
    },
    {
      id: 3,
      title: "Workshop de Design Thinking",
      date: new Date(2025, 4, 25), // 25 de maio de 2025
      type: "Workshop",
      location: "ETEC Central",
      description: "Workshop prático sobre metodologia de Design Thinking aplicada a projetos de tecnologia.",
    },
  ]

  // Calendar variables
  const currentDate = new Date()
  let selectedDate = new Date()

  // Initialize calendar
  renderCalendar()
  updateSelectedDayEvents()
  renderUpcomingEvents()

  // Calendar rendering function
  function renderCalendar() {
    const calendarEl = document.getElementById("calendar")

    // Create calendar header
    const calendarHeader = document.createElement("div")
    calendarHeader.className = "calendar-header"

    const monthYear = document.createElement("div")
    monthYear.className = "calendar-title"
    monthYear.textContent = formatMonthYear(currentDate)

    const navButtons = document.createElement("div")
    navButtons.className = "calendar-nav"

    const prevButton = document.createElement("button")
    prevButton.className = "calendar-nav-btn"
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>'
    prevButton.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1)
      renderCalendar()
    })

    const nextButton = document.createElement("button")
    nextButton.className = "calendar-nav-btn"
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>'
    nextButton.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1)
      renderCalendar()
    })

    navButtons.appendChild(prevButton)
    navButtons.appendChild(nextButton)

    calendarHeader.appendChild(monthYear)
    calendarHeader.appendChild(navButtons)

    // Create calendar grid
    const calendarGrid = document.createElement("div")
    calendarGrid.className = "calendar-grid"

    // Add day headers
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    dayNames.forEach((day) => {
      const dayHeader = document.createElement("div")
      dayHeader.className = "calendar-day-header"
      dayHeader.textContent = day
      calendarGrid.appendChild(dayHeader)
    })

    // Get days for the current month view
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

    // Previous month days
    const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate()
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const dayEl = document.createElement("div")
      dayEl.className = "calendar-day other-month"
      dayEl.textContent = prevMonthDays - i
      calendarGrid.appendChild(dayEl)
    }

    // Current month days
    const today = new Date()
    for (let i = 1; i <= daysInMonth; i++) {
      const dayEl = document.createElement("div")
      dayEl.className = "calendar-day"
      dayEl.textContent = i

      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i)

      // Check if day has events
      if (hasEventOnDay(dayDate)) {
        dayEl.classList.add("has-event")
      }

      // Check if day is today
      if (
        today.getDate() === i &&
        today.getMonth() === currentDate.getMonth() &&
        today.getFullYear() === currentDate.getFullYear()
      ) {
        dayEl.classList.add("today")
      }

      // Check if day is selected
      if (
        selectedDate.getDate() === i &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear()
      ) {
        dayEl.classList.add("selected")
      }

      // Add click event
      dayEl.addEventListener("click", () => {
        selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
        renderCalendar()
        updateSelectedDayEvents()
      })

      calendarGrid.appendChild(dayEl)
    }

    // Next month days
    const totalDaysDisplayed = firstDayOfMonth + daysInMonth
    const nextMonthDays = 42 - totalDaysDisplayed // 6 rows of 7 days

    for (let i = 1; i <= nextMonthDays; i++) {
      const dayEl = document.createElement("div")
      dayEl.className = "calendar-day other-month"
      dayEl.textContent = i
      calendarGrid.appendChild(dayEl)
    }

    // Clear and append to calendar element
    calendarEl.innerHTML = ""
    calendarEl.appendChild(calendarHeader)
    calendarEl.appendChild(calendarGrid)
  }

  // Check if a day has events
  function hasEventOnDay(day) {
    return events.some(
      (event) =>
        day.getDate() === event.date.getDate() &&
        day.getMonth() === event.date.getMonth() &&
        day.getFullYear() === event.date.getFullYear(),
    )
  }

  // Get events for selected day
  function getEventsForSelectedDay() {
    return events.filter(
      (event) =>
        selectedDate.getDate() === event.date.getDate() &&
        selectedDate.getMonth() === event.date.getMonth() &&
        selectedDate.getFullYear() === event.date.getFullYear(),
    )
  }

  // Update events for selected day
  function updateSelectedDayEvents() {
    const selectedDateEl = document.getElementById("selected-date")
    const eventsContainer = document.getElementById("events-container")

    // Update selected date text
    selectedDateEl.textContent = formatDate(selectedDate)

    // Get events for selected day
    const selectedDayEvents = getEventsForSelectedDay()

    // Clear events container
    eventsContainer.innerHTML = ""

    if (selectedDayEvents.length > 0) {
      // Create event items
      selectedDayEvents.forEach((event) => {
        const eventItem = document.createElement("div")
        eventItem.className = "event-item"

        const eventHeader = document.createElement("div")
        eventHeader.className = "event-header"

        const eventInfo = document.createElement("div")
        eventInfo.className = "event-info"

        const eventTitle = document.createElement("h4")
        eventTitle.textContent = event.title

        const eventLocation = document.createElement("p")
        eventLocation.textContent = `${event.type} • ${event.location}`

        eventInfo.appendChild(eventTitle)
        eventInfo.appendChild(eventLocation)

        const eventBadge = document.createElement("div")
        eventBadge.className = "event-badge"
        eventBadge.textContent = event.type

        eventHeader.appendChild(eventInfo)
        eventHeader.appendChild(eventBadge)

        const eventActions = document.createElement("div")
        eventActions.className = "event-actions"

        const rateButton = document.createElement("button")
        rateButton.className = "button outline-button"
        rateButton.textContent = "Avaliar"
        rateButton.addEventListener("click", () => openRatingModal(event))

        eventActions.appendChild(rateButton)

        eventItem.appendChild(eventHeader)
        eventItem.appendChild(eventActions)

        eventsContainer.appendChild(eventItem)
      })
    } else {
      // No events message
      const noEvents = document.createElement("div")
      noEvents.className = "no-events"

      const calendarIcon = document.createElement("i")
      calendarIcon.className = "fas fa-calendar"

      const noEventsText = document.createElement("p")
      noEventsText.textContent = "Nenhum evento nesta data"

      noEvents.appendChild(calendarIcon)
      noEvents.appendChild(noEventsText)

      eventsContainer.appendChild(noEvents)
    }
  }

  // Render upcoming events
  function renderUpcomingEvents() {
    const upcomingEventsEl = document.getElementById("upcoming-events")

    // Sort events by date
    const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime())

    // Clear container
    upcomingEventsEl.innerHTML = ""

    // Create event items
    sortedEvents.forEach((event) => {
      const eventItem = document.createElement("div")
      eventItem.className = "upcoming-event"

      const eventDate = document.createElement("p")
      eventDate.className = "upcoming-event-date"
      eventDate.textContent = formatDateShort(event.date)

      const eventTitle = document.createElement("h4")
      eventTitle.className = "upcoming-event-title"
      eventTitle.textContent = event.title

      const eventDetails = document.createElement("p")
      eventDetails.className = "upcoming-event-details"
      eventDetails.textContent = `${event.type} • ${event.location}`

      eventItem.appendChild(eventDate)
      eventItem.appendChild(eventTitle)
      eventItem.appendChild(eventDetails)

      upcomingEventsEl.appendChild(eventItem)
    })
  }

  // Rating modal functionality
  const modal = document.getElementById("rating-modal")
  const closeModalBtn = document.getElementById("close-modal")
  const submitRatingBtn = document.getElementById("submit-rating")
  const starButtons = document.querySelectorAll(".star-button")
  let currentRating = 0
  let currentEvent = null

  // Open rating modal
  function openRatingModal(event) {
    currentEvent = event
    currentRating = 0

    // Reset stars
    starButtons.forEach((btn) => {
      btn.classList.remove("active")
      btn.innerHTML = '<i class="far fa-star"></i>'
    })

    // Disable submit button
    submitRatingBtn.disabled = true

    // Set event details
    document.getElementById("event-title").textContent = event.title
    document.getElementById("event-description").textContent = event.description

    // Show modal
    modal.style.display = "flex"
  }

  // Close modal
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none"
  })

  // Star rating
  starButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const rating = Number.parseInt(btn.getAttribute("data-rating"))
      currentRating = rating

      // Update stars
      starButtons.forEach((star, index) => {
        if (index < rating) {
          star.classList.add("active")
          star.innerHTML = '<i class="fas fa-star"></i>'
        } else {
          star.classList.remove("active")
          star.innerHTML = '<i class="far fa-star"></i>'
        }
      })

      // Enable submit button
      submitRatingBtn.disabled = false
    })
  })

  // Submit rating
  submitRatingBtn.addEventListener("click", () => {
    // Here you would send the rating to the server
    alert(`Evento "${currentEvent.title}" avaliado com ${currentRating} estrelas!`)

    // Close modal
    modal.style.display = "none"
  })

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none"
    }
  })

  // Helper functions
  function formatMonthYear(date) {
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ]
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  }

  function formatDate(date) {
    const days = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"]
    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ]

    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`
  }

  function formatDateShort(date) {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

    return `${date.getDate()} de ${months[date.getMonth()]}`
  }
})
