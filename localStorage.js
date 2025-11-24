// Gerenciamento de Favoritos com localStorage
class FavoritesManager {
  constructor() {
    this.favoritesKey = "portfolio-favorites";
    this.favorites = this.getFavorites();
    this.init();
  }

  getFavorites() {
    const stored = localStorage.getItem(this.favoritesKey);
    return stored ? JSON.parse(stored) : [];
  }

  saveFavorites() {
    localStorage.setItem(this.favoritesKey, JSON.stringify(this.favorites));
  }

  toggleFavorite(itemId) {
    const index = this.favorites.indexOf(itemId);
    if (index > -1) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(itemId);
    }
    this.saveFavorites();
    this.updateUI();
  }

  isFavorite(itemId) {
    return this.favorites.includes(itemId);
  }

  updateUI() {
    document.querySelectorAll(".favorite-btn").forEach((btn) => {
      const itemId = btn.dataset.item;
      if (this.isFavorite(itemId)) {
        btn.classList.add("active");
        btn.textContent = "❤️";
      } else {
        btn.classList.remove("active");
        btn.textContent = "🤍";
      }
    });
  }

  init() {
    // Event listeners para botões de favorito
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("favorite-btn")) {
        const itemId = e.target.dataset.item;
        this.toggleFavorite(itemId);
      }
    });

    this.updateUI();
  }
}

// Tema escuro/claro
class ThemeManager {
  constructor() {
    this.themeKey = "portfolio-theme";
    this.currentTheme = this.getStoredTheme() || "light";
    this.init();
  }

  getStoredTheme() {
    return localStorage.getItem(this.themeKey);
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.body.classList.toggle("dark-mode", theme === "dark");
    localStorage.setItem(this.themeKey, theme);
    this.updateThemeButton();
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light";
    this.setTheme(newTheme);
  }

  updateThemeButton() {
    const themeBtn = document.getElementById("theme-btn");
    if (themeBtn) {
      themeBtn.textContent = this.currentTheme === "light" ? "🌙" : "☀️";
      themeBtn.setAttribute(
        "aria-label",
        this.currentTheme === "light"
          ? "Ativar modo escuro"
          : "Ativar modo claro"
      );
    }
  }

  init() {
    // Aplicar tema salvo
    this.setTheme(this.currentTheme);

    // Event listener para botão de tema
    const themeBtn = document.getElementById("theme-btn");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => this.toggleTheme());
    }
  }
}

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
  new FavoritesManager();
  new ThemeManager();
});
