document.addEventListener("DOMContentLoaded", () => {
  // 1. Authenticated Header Controls (Real User Name & Initials)
  if (document.body.classList.contains("portal-authenticated")) {
    const globalHeader = document.querySelector("#global-header");
    const masthead = globalHeader && globalHeader.querySelector(".masthead-inner");
    const mobileMenu = globalHeader && globalHeader.querySelector("#mobile-menu");

    let savedUser = null;
    try {
      savedUser = JSON.parse(localStorage.getItem("swb_user"));
    } catch {
      savedUser = null;
    }

    const fullName = savedUser
      ? `${savedUser.first_name || ""} ${savedUser.last_name || ""}`.trim() || savedUser.email
      : "Account Holder";

    const initials = savedUser && savedUser.first_name && savedUser.last_name
      ? `${savedUser.first_name[0]}${savedUser.last_name[0]}`.toUpperCase()
      : fullName.slice(0, 2).toUpperCase();

    if (masthead) {
      globalHeader.querySelectorAll(".header-auth, .mobile-auth").forEach(group => group.remove());

      const createAccountControls = drawer => {
        const englishPortal = document.body.dataset.portalLanguage === "en";
        const controls = document.createElement("div");
        controls.className = drawer ? "portal-header-account portal-header-account--drawer" : "portal-header-account";

        const badge = document.createElement("span");
        badge.className = "portal-user-badge";
        badge.textContent = initials;
        badge.setAttribute("aria-label", englishPortal ? `Signed in as ${fullName}` : `Angemeldet als ${fullName}`);

        const name = document.createElement("span");
        name.className = "portal-header-user-name user-name";
        name.dataset.userName = "true";
        name.textContent = fullName;

        const logout = document.createElement("a");
        logout.className = "portal-header-logout";
        logout.href = "online-banking.html";
        logout.textContent = englishPortal ? "Logout" : "Abmelden";
        logout.addEventListener("click", () => {
          localStorage.removeItem("swb_token");
          localStorage.removeItem("swb_user");
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("loggedIn");
          localStorage.removeItem("currentUser");
        });

        controls.append(badge, name, logout);
        return controls;
      };

      const menuToggle = masthead.querySelector(".menu-toggle");
      masthead.insertBefore(createAccountControls(false), menuToggle || null);
      const mobileSearch = mobileMenu && mobileMenu.querySelector(".mobile-search");
      if (mobileSearch) mobileSearch.insertAdjacentElement("afterend", createAccountControls(true));
    }
  }

  // 2. Mobile Portal Navigation Toggle
  const navToggle = document.querySelector(".portal-nav-toggle");
  const portalNav = document.querySelector("#portal-navigation");
  if (navToggle && portalNav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") !== "true";
      navToggle.setAttribute("aria-expanded", String(expanded));
      portalNav.classList.toggle("is-open", expanded);
    });
  }

  // 3. Balance Hide/Show Toggle
  const balanceToggle = document.querySelector("[data-balance-toggle]");
  if (balanceToggle) {
    balanceToggle.addEventListener("click", () => {
      const hidden = balanceToggle.getAttribute("aria-pressed") !== "true";
      balanceToggle.setAttribute("aria-pressed", String(hidden));
      document.querySelectorAll("[data-user-balance], [data-balance]").forEach(el => {
        if (!el.dataset.realBalance) {
          el.dataset.realBalance = el.textContent.trim();
        }
        el.textContent = hidden ? "••••••••" : el.dataset.realBalance;
      });
    });
  }
});