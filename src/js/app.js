const addPopup = document.getElementById('popup-add-teacher');
const infoPopup = document.getElementById('popup-teacher-info');
const popups = [addPopup, infoPopup];

function openPopup(popup) {
  popups.forEach((p) => p.setAttribute('hidden', ''));
  popup.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

function closePopups() {
  popups.forEach((p) => p.setAttribute('hidden', ''));
  document.body.style.overflow = '';
}

document.querySelectorAll('#add-teacher-btn, [data-open="add-teacher"]').forEach((btn) => {
  btn.addEventListener('click', () => openPopup(addPopup));
});

document.querySelectorAll('.teachers-grid .teacher-card, .favorites-list .teacher-card').forEach((card) => {
  card.addEventListener('click', () => openPopup(infoPopup));
});

popups.forEach((popup) => {
  popup.addEventListener('click', (event) => {
    if (event.target === popup || event.target.closest('[data-close]')) {
      closePopups();
    }
  });
});

document.querySelector('.add-form').addEventListener('submit', (event) => {
  event.preventDefault();
  closePopups();
});
