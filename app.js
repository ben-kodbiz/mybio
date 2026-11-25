(function () {
  "use strict";

  var root = document.documentElement;
  var themeToggle = document.getElementById("theme-toggle");
  var menuToggle = document.getElementById("menu-toggle");
  var siteNav = document.getElementById("site-nav");
  var filterButtons = document.querySelectorAll(".filter-btn");
  var projectRows = document.querySelectorAll("#project-list .project-row");
  var filterStatus = document.getElementById("filter-status");
  var emptyState = document.getElementById("project-empty");

  function syncThemeButton() {
    if (!themeToggle) return;
    var current = root.getAttribute("data-theme") || "dark";
    var isLight = current === "light";
    themeToggle.textContent = isLight ? "Dark mode" : "Light mode";
    themeToggle.setAttribute("aria-pressed", String(isLight));
  }

  if (themeToggle) {
    syncThemeButton();
    themeToggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") || "dark";
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      syncThemeButton();
    });
  }

  function closeMenu() {
    if (!menuToggle || !siteNav) return;
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "Menu";
  }

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", function () {
      var opening = !siteNav.classList.contains("is-open");
      siteNav.classList.toggle("is-open", opening);
      menuToggle.setAttribute("aria-expanded", String(opening));
      menuToggle.textContent = opening ? "Close" : "Menu";
    });

    siteNav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
        closeMenu();
        menuToggle.focus();
      }
    });
  }

  if (filterButtons.length > 0 && projectRows.length > 0) {
    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        var filter = button.getAttribute("data-filter") || "all";
        var visibleCount = 0;

        filterButtons.forEach(function (btn) {
          var active = btn === button;
          btn.classList.toggle("is-active", active);
          btn.setAttribute("aria-pressed", String(active));
        });

        projectRows.forEach(function (row) {
          var matches = filter === "all" || row.getAttribute("data-category") === filter;
          row.hidden = !matches;
          if (matches) visibleCount += 1;
        });

        if (filterStatus) {
          filterStatus.textContent =
            visibleCount === 1
              ? "Showing 1 repository"
              : "Showing " + visibleCount + " repositories";
        }

        if (emptyState) {
          emptyState.hidden = visibleCount > 0;
        }
      });
    });
  }
})();
