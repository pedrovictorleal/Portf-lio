// Smooth Scroll para navegação
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });

    // Botão explorar
    const exploreBtn = document.getElementById("explore-btn");
    if (exploreBtn) {
      exploreBtn.addEventListener("click", () => {
        document.querySelector("#about").scrollIntoView({
          behavior: "smooth",
        });
      });
    }
  }
}

// Intersection Observer para animações
class ScrollAnimations {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    // Observar elementos para animação
    document
      .querySelectorAll(".skill-card, .project-card, .gallery-item")
      .forEach((el) => {
        this.observer.observe(el);
      });
  }
}

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
  new SmoothScroll();
  new ScrollAnimations();
});
