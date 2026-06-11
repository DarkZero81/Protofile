(function () {
  const themeToggleBtn = document.getElementById("theme-toggle");
  const toggleIcon = document.getElementById("toggle-icon");
  const toggleText = document.getElementById("toggle-text");
  const body = document.body;

  const storageKey = "theme";
  const legacyStorageKey = "portfolio-theme";

  function getStoredTheme() {
    return (
      localStorage.getItem(storageKey) || localStorage.getItem(legacyStorageKey)
    );
  }

  function updateToggleButton(theme) {
    if (toggleIcon) toggleIcon.textContent = theme === "light" ? "☀️" : "🌙";
    if (toggleText)
      toggleText.textContent =
        theme === "light" ? "الوضع النهاري" : "الوضع الليلي";
  }

  function syncCloseButtons(theme) {
    document.querySelectorAll(".btn-close").forEach((button) => {
      if (theme === "dark") {
        button.classList.add("btn-close-white");
      } else {
        button.classList.remove("btn-close-white");
      }
    });
  }

  function enableLightMode() {
    body.classList.add("light-theme");
    body.classList.remove("dark-theme");
    updateToggleButton("light");
    syncCloseButtons("light");
    localStorage.setItem(storageKey, "light");
  }

  function enableDarkMode() {
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
    updateToggleButton("dark");
    syncCloseButtons("dark");
    localStorage.setItem(storageKey, "dark");
  }

  function applyStoredTheme() {
    const storedTheme = getStoredTheme();
    if (storedTheme === "light") {
      enableLightMode();
    } else if (storedTheme === "dark") {
      enableDarkMode();
    } else if (body.classList.contains("light-theme")) {
      updateToggleButton("light");
    } else if (body.classList.contains("dark-theme")) {
      updateToggleButton("dark");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyStoredTheme();

    if (!themeToggleBtn) return;

    themeToggleBtn.addEventListener("click", () => {
      if (body.classList.contains("light-theme")) {
        enableDarkMode();
      } else {
        enableLightMode();
      }
    });
  });
})();
