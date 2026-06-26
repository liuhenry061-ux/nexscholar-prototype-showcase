const STORAGE_KEY = "nexscholarPrototypeUser";

function readUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem(STORAGE_KEY);
}

function hydrateAuthLinks() {
  const user = readUser();
  document.querySelectorAll(".nav a").forEach((link) => {
    if (link.getAttribute("href") === "./auth.html") {
      link.textContent = user ? "Dashboard" : "Login";
      link.setAttribute("href", user ? "./dashboard.html" : "./auth.html");
    }
  });
}

function bindRoleCards() {
  const roleButtons = document.querySelectorAll("[data-role]");
  const audienceCards = document.querySelectorAll("[data-audience]");

  roleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const role = button.dataset.role;
      roleButtons.forEach((item) => item.classList.toggle("active", item === button));
      audienceCards.forEach((card) => {
        card.hidden = card.dataset.audience !== role;
      });
    });
  });
}

function bindToggleGroups() {
  const toggleGroups = document.querySelectorAll("[data-toggle-group]");

  toggleGroups.forEach((group) => {
    const buttons = group.querySelectorAll("[data-target]");
    const scope = group.dataset.scope || "";

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.target;

        buttons.forEach((item) => item.classList.toggle("active", item === button));

        document.querySelectorAll(`[data-panel="${scope}"]`).forEach((panel) => {
          panel.hidden = panel.dataset.value !== target;
        });

        document.querySelectorAll(`[data-bind="${scope}"]`).forEach((bound) => {
          if (bound.dataset.value) {
            bound.hidden = bound.dataset.value !== target;
          }
        });
      });
    });
  });
}

function bindAuthForms() {
  const loginButton = document.querySelector("[data-login-submit]");
  const registerButton = document.querySelector("[data-register-submit]");

  if (loginButton) {
    loginButton.addEventListener("click", () => {
      const email = document.querySelector("#signin-email")?.value.trim();
      const role = document.querySelector("#signin-role")?.value || "Student researcher";

      if (!email) {
        alert("Please enter your email.");
        return;
      }

      const user = {
        name: email.split("@")[0].replace(/[._-]/g, " "),
        email,
        role,
        goal: role === "Lecturer or supervisor" ? "Screen postgraduate candidates" : "Find a supervisor",
        readiness: role === "Lecturer or supervisor" ? 82 : 74,
      };

      writeUser(user);
      window.location.href = "./dashboard.html";
    });
  }

  if (registerButton) {
    registerButton.addEventListener("click", () => {
      const name = document.querySelector("#register-name")?.value.trim();
      const email = document.querySelector("#register-email")?.value.trim();
      const role = document.querySelector("#register-role")?.value || "Student researcher";
      const goal = document.querySelector("#register-goal")?.value || "Find a supervisor";

      if (!name || !email) {
        alert("Please complete your name and email.");
        return;
      }

      const user = {
        name,
        email,
        role,
        goal,
        readiness: role === "Lecturer or supervisor" ? 78 : 68,
      };

      writeUser(user);
      window.location.href = "./dashboard.html";
    });
  }
}

function hydrateDashboard() {
  const dashboardRoot = document.querySelector("[data-dashboard-root]");
  if (!dashboardRoot) return;

  const user = readUser();
  if (!user) {
    window.location.href = "./auth.html";
    return;
  }

  document.querySelectorAll("[data-user-name]").forEach((node) => {
    node.textContent = user.name;
  });
  document.querySelectorAll("[data-user-email]").forEach((node) => {
    node.textContent = user.email;
  });
  document.querySelectorAll("[data-user-role]").forEach((node) => {
    node.textContent = user.role;
  });
  document.querySelectorAll("[data-user-goal]").forEach((node) => {
    node.textContent = user.goal;
  });
  document.querySelectorAll("[data-user-readiness]").forEach((node) => {
    node.textContent = `${user.readiness}%`;
  });

  document.querySelectorAll("[data-progress-width]").forEach((node) => {
    requestAnimationFrame(() => {
      node.style.width = `${user.readiness}%`;
    });
  });

  const logoutButton = document.querySelector("[data-logout]");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      clearUser();
      window.location.href = "./auth.html";
    });
  }
}

function animateCounters() {
  document.querySelectorAll("[data-count]").forEach((node) => {
    const end = Number(node.dataset.count || "0");
    let current = 0;
    const step = Math.max(1, Math.ceil(end / 28));

    const tick = () => {
      current = Math.min(end, current + step);
      node.textContent = String(current);
      if (current < end) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  });
}

function bindSpotlights() {
  document.querySelectorAll("[data-spotlight]").forEach((panel) => {
    panel.addEventListener("mousemove", (event) => {
      const rect = panel.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      panel.style.setProperty("--spot-x", `${x}%`);
      panel.style.setProperty("--spot-y", `${y}%`);
    });
  });
}

function bindTiltCards() {
  const finePointer = window.matchMedia("(pointer:fine)").matches;
  if (!finePointer) return;

  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 8;
      const rotateX = (0.5 - y) * 8;
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function bindSearchRotation() {
  const searchInput = document.querySelector("[data-rotating-search]");
  if (!searchInput) return;

  const samples = [
    "Bioinformatics supervisor in Malaysia with scholarship support",
    "Human computer interaction PhD with mixed methods mentor",
    "Cancer systems modelling lab with funding opportunities",
    "Medical imaging AI program with conference activity",
  ];

  let index = 0;
  window.setInterval(() => {
    index = (index + 1) % samples.length;
    searchInput.value = samples[index];
  }, 2600);
}

function bindScrollReveal() {
  const targets = document.querySelectorAll(".reveal-on-scroll");
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  targets.forEach((target, index) => {
    target.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(target);
  });

  window.setTimeout(() => {
    targets.forEach((target) => target.classList.add("is-visible"));
  }, 1400);
}

hydrateAuthLinks();
bindRoleCards();
bindToggleGroups();
bindAuthForms();
hydrateDashboard();
animateCounters();
bindSpotlights();
bindTiltCards();
bindSearchRotation();
bindScrollReveal();
