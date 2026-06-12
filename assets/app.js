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
