// Funcionalidade principal - Carregamento JSON e Validação de Formulário
class PortfolioApp {
  constructor() {
    this.skills = [];
    this.projects = [];
    this.init();
  }

  async init() {
    await this.loadSkills();
    await this.loadProjects();
    this.setupFormValidation();
    this.setupSearch();
    this.animateStats();
  }

  // Carregar habilidades do JSON
  async loadSkills() {
    try {
      const response = await fetch("data/projects.json");
      const data = await response.json();
      this.skills = data.skills;
      this.renderSkills();
    } catch (error) {
      console.error("Erro ao carregar habilidades:", error);
    }
  }

  // Carregar projetos do JSON
  async loadProjects() {
    try {
      const response = await fetch("data/projects.json");
      const data = await response.json();
      this.projects = data.projects;
      this.renderProjects();
    } catch (error) {
      console.error("Erro ao carregar projetos:", error);
    }
  }

  renderSkills() {
    const container = document.getElementById("skills-container");
    if (!container) return;

    container.innerHTML = this.skills
      .map(
        (skill) => `
            <div class="skill-card">
                <h3>${skill.name}</h3>
                <div class="skill-level">
                    <div class="skill-bar">
                        <div class="skill-progress" style="width: ${skill.level}%"></div>
                    </div>
                    <span>${skill.level}%</span>
                </div>
            </div>
        `
      )
      .join("");
  }

  renderProjects() {
    const container = document.getElementById("projects-container");
    if (!container) return;

    container.innerHTML = this.projects
      .map(
        (project) => `
            <div class="project-card" data-project="${project.title.toLowerCase()}">
                <img src="${project.image}" alt="${
          project.title
        }" loading="lazy">
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.tags
                          .map((tag) => `<span class="tag">${tag}</span>`)
                          .join("")}
                    </div>
                    <div class="project-links">
                        <a href="${
                          project.demo
                        }" target="_blank" rel="noopener">Demo</a>
                        <a href="${
                          project.code
                        }" target="_blank" rel="noopener">Código</a>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  }

  // Validação de formulário
  setupFormValidation() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.validateForm()) {
        this.handleFormSubmit(form);
      }
    });

    // Validação em tempo real
    ["name", "email", "message"].forEach((field) => {
      const input = document.getElementById(field);
      if (input) {
        input.addEventListener("blur", () => this.validateField(field));
      }
    });
  }

  validateForm() {
    let isValid = true;
    ["name", "email", "message"].forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    return isValid;
  }

  validateField(fieldName) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    let isValid = true;
    let message = "";

    switch (fieldName) {
      case "name":
        if (field.value.trim().length < 2) {
          isValid = false;
          message = "Nome deve ter pelo menos 2 caracteres";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          isValid = false;
          message = "Email inválido";
        }
        break;
      case "message":
        if (field.value.trim().length < 10) {
          isValid = false;
          message = "Mensagem deve ter pelo menos 10 caracteres";
        }
        break;
    }

    field.classList.toggle("error", !isValid);
    errorElement.textContent = message;
    return isValid;
  }

  async handleFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Simular envio
    try {
      // Aqui você integraria com um serviço real
      console.log("Dados do formulário:", data);
      this.showMessage("Mensagem enviada com sucesso!", "success");
      form.reset();
    } catch (error) {
      this.showMessage("Erro ao enviar mensagem. Tente novamente.", "error");
    }
  }

  showMessage(text, type) {
    const messageEl = document.createElement("div");
    messageEl.className = `message ${type}`;
    messageEl.textContent = text;
    messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            color: white;
            background: ${
              type === "success" ? "var(--success-color)" : "var(--error-color)"
            };
            z-index: 10000;
        `;

    document.body.appendChild(messageEl);
    setTimeout(() => {
      messageEl.remove();
    }, 5000);
  }

  // Busca em projetos
  setupSearch() {
    const searchInput = document.getElementById("project-search");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      this.filterProjects(searchTerm);
    });
  }

  filterProjects(searchTerm) {
    const projectCards = document.querySelectorAll(".project-card");

    projectCards.forEach((card) => {
      const title = card.querySelector("h3").textContent.toLowerCase();
      const description = card.querySelector("p").textContent.toLowerCase();
      const tags = Array.from(card.querySelectorAll(".tag")).map((tag) =>
        tag.textContent.toLowerCase()
      );

      const matches =
        title.includes(searchTerm) ||
        description.includes(searchTerm) ||
        tags.some((tag) => tag.includes(searchTerm));

      card.style.display = matches ? "block" : "none";
    });
  }

  // Animação de estatísticas
  animateStats() {
    const stats = document.querySelectorAll(".stat-number");

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateValue(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });

    stats.forEach((stat) => observer.observe(stat));
  }

  animateValue(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        element.textContent = target + "+";
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  }
}

// Inicializar aplicação
document.addEventListener("DOMContentLoaded", () => {
  new PortfolioApp();
});
