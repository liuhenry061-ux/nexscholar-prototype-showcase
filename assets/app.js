const STORAGE_KEY = "nexscholar-prototype-state";

const profiles = {
  student: [
    {
      id: "nur-aina",
      type: "supervisor",
      name: "Assoc. Prof. Dr. Nur Aina Rahman",
      meta: "UTM • Systems bioinformatics",
      subject: "Bioinformatics",
      score: 91,
      fit: 93,
      method: 88,
      readiness: 76,
      readinessLabel: "Contact-ready",
      readinessCode: "contact",
      project: "Cancer systems modelling with RNA-seq and pathway analysis",
      funding: "2 funded PhD tracks visible",
      currentSubject: "Computational biology",
      tags: ["bioinformatics", "health", "ai"],
      chips: ["Cancer data", "RNA-seq", "Python"],
      explain: "Best overall fit because topic overlap, method alignment, and current project direction are all strong.",
      action: "Contact supervisor",
      secondaryAction: "Compare profile"
    },
    {
      id: "syafiq",
      type: "supervisor",
      name: "Dr. Syafiq Mahzan",
      meta: "UM • Medical imaging AI",
      subject: "Artificial Intelligence",
      score: 84,
      fit: 82,
      method: 90,
      readiness: 61,
      readinessLabel: "Improve abstract first",
      readinessCode: "improve",
      project: "Clinical imaging models for early disease detection",
      funding: "1 open research assistantship",
      currentSubject: "Computer vision in health",
      tags: ["ai", "health"],
      chips: ["Deep learning", "Imaging", "PyTorch"],
      explain: "Strong method match, but your current proposal abstract is not specific enough for the lab's active project scope.",
      action: "Refine proposal",
      secondaryAction: "Compare profile"
    },
    {
      id: "amirah",
      type: "supervisor",
      name: "Dr. Amirah Sofea",
      meta: "USM • Human-centred digital health",
      subject: "Human-Computer Interaction",
      score: 79,
      fit: 77,
      method: 75,
      readiness: 82,
      readinessLabel: "Ready after shortlisting",
      readinessCode: "contact",
      project: "Patient-facing digital health journeys and usability evaluation",
      funding: "Self-funded or grant-pending",
      currentSubject: "HCI and health informatics",
      tags: ["hci", "health"],
      chips: ["UX studies", "Mixed methods", "Healthcare"],
      explain: "A lower research-fit score, but a strong communication and readiness path if the user wants an applied health-HCI direction.",
      action: "Shortlist pathway",
      secondaryAction: "Compare profile"
    }
  ],
  lecturer: [
    {
      id: "li-mei",
      type: "candidate",
      name: "Li Mei Chen",
      meta: "MSc applicant • Computational biology",
      subject: "Bioinformatics",
      score: 89,
      fit: 90,
      method: 84,
      readiness: 83,
      readinessLabel: "Ready to contact",
      readinessCode: "contact",
      project: "Single-cell transcriptomics for treatment response prediction",
      funding: "Self-funded + scholarship shortlist",
      currentSubject: "Computational biology",
      tags: ["bioinformatics", "health"],
      chips: ["CGPA 3.72", "RNA-seq", "Proposal draft"],
      explain: "Recommended because the candidate has a clear topic, relevant tools, and enough proposal maturity for meaningful screening.",
      action: "Contact candidate",
      secondaryAction: "Compare profile"
    },
    {
      id: "ahmad",
      type: "candidate",
      name: "Ahmad Firdaus",
      meta: "PhD prospect • Human-computer interaction",
      subject: "Human-Computer Interaction",
      score: 81,
      fit: 85,
      method: 78,
      readiness: 58,
      readinessLabel: "Needs stronger plan",
      readinessCode: "improve",
      project: "Accessible interfaces for academic platforms",
      funding: "No funding path confirmed",
      currentSubject: "HCI",
      tags: ["hci"],
      chips: ["Prototype testing", "Mixed methods", "UX studies"],
      explain: "Good domain fit, but the proposal still needs a sharper method plan before shortlisting.",
      action: "Request stronger plan",
      secondaryAction: "Compare profile"
    },
    {
      id: "farah",
      type: "candidate",
      name: "Farah Nabila",
      meta: "PhD prospect • Applied machine learning",
      subject: "Artificial Intelligence",
      score: 86,
      fit: 88,
      method: 86,
      readiness: 73,
      readinessLabel: "Shortlist now",
      readinessCode: "contact",
      project: "Federated learning for cross-campus health datasets",
      funding: "Faculty grant under review",
      currentSubject: "AI for health data",
      tags: ["ai", "health"],
      chips: ["PyTorch", "Health data", "Publication"],
      explain: "Balanced candidate with strong fit and enough evidence to justify a shortlist discussion.",
      action: "Shortlist candidate",
      secondaryAction: "Compare profile"
    }
  ]
};

const demoContent = {
  search: {
    title: "Search example loaded",
    body: 'The user searches for "Bioinformatics PhD supervisor in Malaysia" after selecting the goal "Find supervisor".'
  },
  recommend: {
    title: "Recommendation example shown",
    body: "The system reveals a top recommendation with transparent score factors: research fit, method overlap, and action readiness."
  },
  update: {
    title: "Profile update example shown",
    body: "The user adds one missing publication and the system explains that this may improve the top match score and outreach confidence."
  }
};

function readState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      mode: "student",
      interest: "all",
      readiness: "all",
      selectedIds: []
    };
  } catch {
    return {
      mode: "student",
      interest: "all",
      readiness: "all",
      selectedIds: []
    };
  }
}

function writeState(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function getState() {
  const state = readState();
  if (!state.mode) state.mode = "student";
  if (!state.interest) state.interest = "all";
  if (!state.readiness) state.readiness = "all";
  if (!Array.isArray(state.selectedIds)) state.selectedIds = [];
  return state;
}

function setState(patch) {
  const next = { ...getState(), ...patch };
  writeState(next);
  return next;
}

function byMode(mode) {
  return profiles[mode] || profiles.student;
}

function filteredProfiles(state) {
  return byMode(state.mode).filter((profile) => {
    const interestOk = state.interest === "all" || profile.tags.includes(state.interest);
    const readinessOk = state.readiness === "all" || profile.readinessCode === state.readiness;
    return interestOk && readinessOk;
  });
}

function renderMatching() {
  const state = getState();
  const results = filteredProfiles(state);
  const container = document.querySelector("#match-results");
  const compareLink = document.querySelector("#compare-selected");
  const hero = results[0] || byMode(state.mode)[0];
  if (!container || !compareLink || !hero) return;

  document.querySelectorAll("[data-mode]").forEach((button) => {
    const active = button.dataset.mode === state.mode;
    button.classList.toggle("primary", active);
    button.classList.toggle("secondary", !active);
  });

  document.querySelectorAll("[data-role-toggle]").forEach((button) => {
    button.classList.toggle("active", button.dataset.roleToggle === state.mode);
  });

  document.querySelectorAll("[data-interest]").forEach((button) => {
    button.classList.toggle("active", button.dataset.interest === state.interest);
  });

  document.querySelectorAll("[data-ready]").forEach((button) => {
    button.classList.toggle("active", button.dataset.ready === state.readiness);
  });

  document.querySelector("#hero-name").textContent = hero.name;
  document.querySelector("#hero-meta").textContent = `${hero.meta} • ${hero.project}`;
  document.querySelector("#hero-score").textContent = hero.score;
  document.querySelector("#hero-fit").textContent = hero.fit;
  document.querySelector("#hero-method").textContent = hero.method;
  document.querySelector("#hero-ready").textContent = hero.readiness;
  document.querySelector("#hero-fit-bar").style.width = `${hero.fit}%`;
  document.querySelector("#hero-method-bar").style.width = `${hero.method}%`;
  document.querySelector("#hero-ready-bar").style.width = `${hero.readiness}%`;
  document.querySelector("#hero-explain").textContent = `Why this ${state.mode === "student" ? "match" : "screening result"}: ${hero.explain}`;

  container.innerHTML = results.map((profile) => {
    const checked = state.selectedIds.includes(profile.id) ? "checked" : "";
    return `
      <article class="match-card">
        <div class="match-header">
          <div>
            <h3>${profile.name}</h3>
            <p>${profile.meta}</p>
          </div>
          <div class="score-chip"><strong>${profile.score}</strong></div>
        </div>
        <div class="meta">
          <span>${profile.currentSubject}</span>
          <span>${profile.funding}</span>
          <span>${profile.readinessLabel}</span>
        </div>
        <div class="tags">
          ${profile.chips.map((chip) => `<span class="tag">${chip}</span>`).join("")}
        </div>
        <div class="compare-list">
          <div class="compare-row"><span>Research fit</span><strong>${profile.fit}%</strong></div>
          <div class="compare-row"><span>Method overlap</span><strong>${profile.method}%</strong></div>
          <div class="compare-row"><span>Action readiness</span><strong>${profile.readinessLabel}</strong></div>
        </div>
        <div class="explain">${profile.explain}</div>
        <label class="checkbox-row">
          <input type="checkbox" data-select-profile="${profile.id}" ${checked}>
          <span>Select for comparison</span>
        </label>
        <div class="actions-row">
          <button class="button secondary" data-inline-compare="${profile.id}">${profile.secondaryAction}</button>
          <button class="button primary" data-inline-action="${profile.id}">${profile.action}</button>
        </div>
      </article>
    `;
  }).join("");

  compareLink.textContent = state.selectedIds.length >= 2
    ? `Compare selected (${state.selectedIds.length})`
    : "Compare selected";
}

function renderComparison() {
  const state = getState();
  const selected = byMode(state.mode).filter((profile) => state.selectedIds.includes(profile.id));
  const pool = byMode(state.mode);
  const fallback = pool.slice(0, 2);
  const active = selected.length >= 2
    ? selected
    : selected.length === 1
      ? [selected[0], ...pool.filter((profile) => profile.id !== selected[0].id).slice(0, 1)]
      : fallback;
  const grid = document.querySelector("#comparison-grid");
  const table = document.querySelector("#compare-table");
  const recommendationTitle = document.querySelector("#comparison-recommendation-title");
  const recommendationCopy = document.querySelector("#comparison-recommendation-copy");
  const recommendationTags = document.querySelector("#comparison-recommendation-tags");
  if (!grid || !table || !recommendationTitle || !recommendationCopy || !recommendationTags) return;

  const sorted = [...active].sort((a, b) => b.score - a.score);
  const top = sorted[0];
  const second = sorted[1];

  grid.innerHTML = active.map((profile) => `
    <article class="compare-card">
      <div class="score-line">
        <div>
          <h3>${profile.name}</h3>
          <p>${profile.meta}</p>
        </div>
        <div class="score-chip"><strong>${profile.score}</strong></div>
      </div>
      <div class="tags">
        ${profile.chips.map((chip) => `<span class="tag">${chip}</span>`).join("")}
      </div>
      <div class="compare-list" style="margin-top: 16px;">
        <div class="compare-row"><span>Current research / project</span><strong>${profile.project}</strong></div>
        <div class="compare-row"><span>Funding availability</span><strong>${profile.funding}</strong></div>
        <div class="compare-row"><span>Action readiness</span><strong>${profile.readinessLabel}</strong></div>
      </div>
    </article>
  `).join("");

  recommendationTitle.textContent = state.mode === "student" ? "Recommended supervisor" : "Recommended candidate";
  recommendationCopy.textContent = `${top.name} is the strongest first choice right now because it leads on score${second ? ` and stays ahead of ${second.name} once funding and readiness are considered` : ""}.`;
  recommendationTags.innerHTML = `
    <span class="tag">Top score ${top.score}</span>
    <span class="tag">${top.funding}</span>
    <span class="tag">${top.readinessLabel}</span>
  `;

  const rows = [
    ["Current research / project", ...active.map((profile) => profile.project)],
    ["Current project subject", ...active.map((profile) => profile.currentSubject)],
    ["Funding availability", ...active.map((profile) => profile.funding)],
    ["Action readiness", ...active.map((profile) => profile.readinessLabel)],
    ["Matching score", ...active.map((profile) => `${profile.score}`)],
    ["Research fit indicator", ...active.map((profile) => `${profile.fit}%`)],
    ["Method overlap", ...active.map((profile) => `${profile.method}%`)]
  ];

  table.querySelector("thead").innerHTML = `
    <tr>
      <th>Comparison field</th>
      ${active.map((profile) => `<th>${profile.name}</th>`).join("")}
    </tr>
  `;
  table.querySelector("tbody").innerHTML = rows.map((row) => `
    <tr>
      <th>${row[0]}</th>
      ${row.slice(1).map((value) => `<td>${value}</td>`).join("")}
    </tr>
  `).join("");
}

function renderDemo(step) {
  const content = demoContent[step] || demoContent.search;
  const panel = document.querySelector("#demo-panel");
  if (!panel) return;
  panel.innerHTML = `<strong>${content.title}</strong><p>${content.body}</p>`;
  document.querySelectorAll("[data-demo]").forEach((button) => {
    button.classList.toggle("active", button.dataset.demo === step);
  });
}

function initTour() {
  const overlay = document.querySelector("#tour-overlay");
  if (!overlay) return;
  const steps = [
    {
      title: "Select your academic goal",
      copy: "Choose an outcome first so matching, comparison, and opportunities can be shaped around that goal."
    },
    {
      title: "Complete basic profile",
      copy: "Focus only on high-impact fields like topic, methods, academic level, and current outputs."
    },
    {
      title: "Run a guided example",
      copy: "The system demonstrates one realistic search and recommendation path so users learn through action."
    },
    {
      title: "Take the final step",
      copy: "End the guide by updating one profile field or moving into comparison immediately."
    }
  ];
  let current = 0;

  const label = document.querySelector("#tour-label");
  const title = document.querySelector("#tour-title");
  const copy = document.querySelector("#tour-copy");
  const next = document.querySelector("#tour-next");

  function paintStep() {
    label.textContent = `Step ${current + 1} of 4`;
    title.textContent = steps[current].title;
    copy.textContent = steps[current].copy;
    next.textContent = current === steps.length - 1 ? "Finish" : "Next";
    document.querySelectorAll(".step-card").forEach((card) => {
      const stepNumber = Number(card.dataset.step);
      card.classList.toggle("active", stepNumber === current + 1);
      card.classList.toggle("complete", stepNumber < current + 1);
    });
  }

  function startTour() {
    current = 0;
    overlay.hidden = false;
    paintStep();
  }

  function endTour() {
    overlay.hidden = true;
  }

  document.querySelector("#start-tour")?.addEventListener("click", startTour);
  document.querySelector("#restart-tour")?.addEventListener("click", startTour);
  document.querySelector("#tour-skip")?.addEventListener("click", endTour);
  next?.addEventListener("click", () => {
    if (current === steps.length - 1) {
      endTour();
      return;
    }
    current += 1;
    paintStep();
  });
}

function bindMatchingEvents() {
  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      setState({ mode: button.dataset.mode, selectedIds: [] });
      renderMatching();
    });
  });

  document.querySelectorAll("[data-role-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      setState({ mode: button.dataset.roleToggle, selectedIds: [] });
      renderMatching();
    });
  });

  document.querySelectorAll("[data-interest]").forEach((button) => {
    button.addEventListener("click", () => {
      setState({ interest: button.dataset.interest });
      renderMatching();
    });
  });

  document.querySelectorAll("[data-ready]").forEach((button) => {
    button.addEventListener("click", () => {
      setState({ readiness: button.dataset.ready });
      renderMatching();
    });
  });

  document.querySelector("#clear-selection")?.addEventListener("click", () => {
    setState({ selectedIds: [] });
    renderMatching();
  });

  document.querySelector("#match-results")?.addEventListener("click", (event) => {
    const compareId = event.target.closest("[data-inline-compare]")?.dataset.inlineCompare;
    const actionId = event.target.closest("[data-inline-action]")?.dataset.inlineAction;
    if (compareId) {
      const state = getState();
      const selectedIds = Array.from(new Set([...state.selectedIds, compareId])).slice(-3);
      setState({ selectedIds });
      window.location.href = "./comparison.html";
      return;
    }
    if (actionId) {
      const card = byMode(getState().mode).find((item) => item.id === actionId);
      if (card) {
        alert(`${card.action}: ${card.name}`);
      }
    }
  });

  document.querySelector("#match-results")?.addEventListener("change", (event) => {
    const input = event.target.closest("[data-select-profile]");
    if (!input) return;
    const id = input.dataset.selectProfile;
    const state = getState();
    const selectedIds = new Set(state.selectedIds);
    if (input.checked) {
      selectedIds.add(id);
    } else {
      selectedIds.delete(id);
    }
    setState({ selectedIds: Array.from(selectedIds) });
    renderMatching();
  });
}

function bindComparisonEvents() {
  document.querySelector("#swap-compare-mode")?.addEventListener("click", () => {
    const nextMode = getState().mode === "student" ? "lecturer" : "student";
    const nextSelected = byMode(nextMode).slice(0, 2).map((profile) => profile.id);
    setState({ mode: nextMode, selectedIds: nextSelected });
    renderComparison();
  });
}

function bindDemoEvents() {
  document.querySelectorAll("[data-demo]").forEach((button) => {
    button.addEventListener("click", () => renderDemo(button.dataset.demo));
  });
}

function bootstrap() {
  const page = document.body.dataset.page;
  if (page === "matching") {
    bindMatchingEvents();
    renderMatching();
  }
  if (page === "comparison") {
    bindComparisonEvents();
    renderComparison();
  }
  if (page === "onboarding") {
    initTour();
    bindDemoEvents();
    renderDemo("search");
  }
}

bootstrap();
