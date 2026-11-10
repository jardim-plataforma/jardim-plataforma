const cards = [...document.querySelectorAll('#lab-catalog .lab-card')];

const perPage = 9;
const totalPages = Math.max(1, Math.ceil(cards.length / perPage));

const previous = document.getElementById('lab-prev');
const next = document.getElementById('lab-next');
const indicator = document.getElementById('lab-page-info');

let page = 1;

function render() {
  cards.forEach((card, index) => {
    const start = (page - 1) * perPage;
    card.hidden = index < start || index >= start + perPage;
  });

  previous.disabled = page === 1;
  next.disabled = page === totalPages;

  indicator.textContent = `${page} de ${totalPages}`;
}

previous.addEventListener('click', () => {
  if (page > 1) {
    page--;
    render();
  }
});

next.addEventListener('click', () => {
  if (page < totalPages) {
    page++;
    render();
  }
});

render();