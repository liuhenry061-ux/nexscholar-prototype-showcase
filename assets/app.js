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
