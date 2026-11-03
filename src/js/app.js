import { filterUsers, sortUsers, searchUsers } from './teachers.js';
import { renderTeachers, renderFavorites, renderTeacherInfo, renderStatistics } from './render.js';
import { fetchUsers, addTeacher, fetchSavedTeachers } from './api.js';

let uniqueUsers = [];
let visibleUsers = [];

const favorites = new Set();
let selectedTeacher = null;

const filtersForm = document.querySelector('.filters');
const ageFilter = document.querySelector('#filter-age');
const countryFilter = document.querySelector('#filter-country');
const genderFilter = document.querySelector('#filter-sex');

const favoriteFilter = document.querySelector(
    '[name="only-favorites"]'
);

const photoFilter = document.querySelector(
    '[name="only-photo"]'
);

let currentSortField = null;
let currentSortOrder = 'asc';

const statisticsTable = document.querySelector('.stats-table');

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('#search');

const addTeacherForm = document.querySelector('.add-form');

const loadMoreButton = document.querySelector('#load-more-btn');

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

function handleTeacherClick(event) {
    const card = event.target.closest('.teacher-card');

    if (!card) return;

    const email = card.dataset.email;
    const teacher = uniqueUsers.find(t => t.email === email);

    if (!teacher) return;

    selectedTeacher = teacher;

    renderTeacherInfo(teacher);

    favoriteButton.setAttribute(
        'aria-label',
        favorites.has(email)
            ? 'Remove from favorites'
            : 'Add to favorites'
    );

    openPopup(infoPopup);
}

const teachersGrid = document.querySelector('.teachers-grid');
const favoritesList = document.querySelector('.favorites-list');

teachersGrid.addEventListener('click', handleTeacherClick);
favoritesList.addEventListener('click', handleTeacherClick);
const favoriteButton = infoPopup.querySelector('.info-star');

favoriteButton.addEventListener('click', () => {
    if (!selectedTeacher) return;

    const email = selectedTeacher.email;

    if (favorites.has(email)) {
        favorites.delete(email);
    } else {
        favorites.add(email);
    }

    applyFilters();
    renderFavorites(uniqueUsers, favorites);

    favoriteButton.setAttribute(
        'aria-label',
        favorites.has(email)
            ? 'Remove from favorites'
            : 'Add to favorites'
    );
});

function populateSelect(selector, property) {
    const select = document.querySelector(selector);

    const values = [...new Set(
        uniqueUsers
            .map(teacher => teacher[property])
            .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b));

    const placeholder = select.options[0];
    select.replaceChildren(placeholder);

    values.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.append(option);
    });
}

function updateStatistics() {
    const sortedUsers = currentSortField
        ? sortUsers(visibleUsers, currentSortField, currentSortOrder)
        : visibleUsers;

    renderStatistics(sortedUsers);
}

function applyFilters() {
    const filters = {
        country: countryFilter.value,
        age: ageFilter.value,
        gender: genderFilter.value,
        favorite: favoriteFilter.checked,
        photo: photoFilter.checked
    };

    visibleUsers = filterUsers(uniqueUsers, filters, favorites);

    renderTeachers(visibleUsers, favorites);
    updateStatistics();
}
filtersForm.addEventListener('change', () => {
    searchInput.value = '';
    applyFilters();
});
filtersForm.addEventListener('submit', event => {
    event.preventDefault();
});

popups.forEach((popup) => {
  popup.addEventListener('click', (event) => {
    if (event.target === popup || event.target.closest('[data-close]')) {
      closePopups();
    }
  });
});

statisticsTable.querySelector('thead').addEventListener('click', event => {
    const header = event.target.closest('th[data-sort]');

    if (!header) return;

    const sortField = header.dataset.sort;

    if (currentSortField === sortField) {
        currentSortOrder =
            currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortField = sortField;
        currentSortOrder = 'asc';
    }

    updateStatistics();

    statisticsTable.querySelectorAll('th[data-sort]').forEach(th => {
        th.setAttribute(
            'aria-sort',
            th === header
                ? (currentSortOrder === 'asc'
                    ? 'ascending'
                    : 'descending')
                : 'none'
        );
    });
});

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    filtersForm.reset();

    const searchValue = searchInput.value.trim();

    if (!searchValue) {
        applyFilters();
        return;
    }

    const nameResults = searchUsers(uniqueUsers, 'full_name', searchValue);
    const noteResults = searchUsers(uniqueUsers, 'note', searchValue);
    const ageResults = searchUsers(uniqueUsers, 'age', searchValue);

    visibleUsers = [
        ...new Set([...nameResults, ...noteResults, ...ageResults])
    ];

    renderTeachers(visibleUsers, favorites);
    updateStatistics();
});

function calculateAge(birthDate) {
    const today = new Date();

    const birth = new Date(`${birthDate}T00:00:00`);

    let age = today.getFullYear() - birth.getFullYear();

    const hasBirthdayPassed =
        today.getMonth() > birth.getMonth() ||
        (today.getMonth() === birth.getMonth() &&
         today.getDate() >= birth.getDate());

    if (!hasBirthdayPassed) {
        age--;
    }

    return age;
}

function getTeacherFromForm(form) {
    const formData = new FormData(form);

    const birthDate = formData.get('dob');

    return {
        id: crypto.randomUUID(),
        full_name: formData.get('name').trim(),
        course: formData.get('speciality'),
        country: formData.get('country'),
        city: formData.get('city').trim(),
        email: formData.get('email').trim().toLowerCase(),
        phone: formData.get('phone').trim(),
        b_date: birthDate,
        age: calculateAge(birthDate),
        gender: formData.get('sex'),
        bg_color: formData.get('color'),
        note: formData.get('notes').trim() || null,

        title: null,
        state: null,
        postcode: null,
        coordinates: null,
        timezone: null,
        picture_large: null,
        picture_thumbnail: null,
        favorite: false
    };
}

function validateNewTeacher(teacher) {
    if (!teacher.full_name) {
        return 'Enter teacher name';
    }

    if (!teacher.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacher.email)) {
        return 'Enter a valid email';
    }

    const emailExists = uniqueUsers.some(user =>
        user.email?.toLowerCase() === teacher.email
    );

    if (emailExists) {
        return 'A teacher with this email already exists';
    }

    if (!teacher.phone || !/^[\d\s()+-]+$/.test(teacher.phone)) {
        return 'Enter a valid phone number';
    }

    if (!teacher.b_date ||
        !Number.isFinite(teacher.age) ||
        teacher.age <= 0 ||
        teacher.age > 100) {
        return 'Enter a valid date of birth';
    }

    if (!teacher.gender) {
        return 'Select teacher gender';
    }

    if (!teacher.country || !teacher.city) {
        return 'Enter teacher country and city';
    }

    return null;
}


addTeacherForm.addEventListener('submit', async event => {
    event.preventDefault();

    const teacher = getTeacherFromForm(addTeacherForm);
    const error = validateNewTeacher(teacher);

    if (error) {
        alert(error);
        return;
    }

    try {
        const savedTeacher = await addTeacher(teacher);

        uniqueUsers.push(savedTeacher);

        populateSelect('#f-country', 'country');
        populateSelect('#f-speciality', 'course');
        populateSelect('#filter-country', 'country');

        filtersForm.reset();
        searchInput.value = '';

        visibleUsers = uniqueUsers;

        renderTeachers(visibleUsers, favorites);
        renderFavorites(uniqueUsers, favorites);
        updateStatistics();

        addTeacherForm.reset();
        closePopups();

    } catch (error) {
        console.error('Error saving teacher:', error);
        alert('Failed to save teacher. Please try again.');
    }
});


async function init() {
    try {
        const randomUsers = await fetchUsers(50);
        const savedTeachers = await fetchSavedTeachers();

        uniqueUsers = [...randomUsers, ...savedTeachers];
        visibleUsers = uniqueUsers;

        populateSelect('#filter-country', 'country');
        populateSelect('#f-country', 'country');
        populateSelect('#f-speciality', 'course');

        renderTeachers(uniqueUsers, favorites);
        renderFavorites(uniqueUsers, favorites);
        renderStatistics(uniqueUsers);

    } catch (error) {
        console.error('Error fetching users:', error);
    }
}
init();

async function loadMoreUsers() {
    try {
        const newUsers = await fetchUsers(10);
        uniqueUsers.push(...newUsers);

        filtersForm.reset();
        searchInput.value = '';

        populateSelect('#filter-country', 'country');
        populateSelect('#f-country', 'country');
        populateSelect('#f-speciality', 'course');

        visibleUsers = uniqueUsers;

        renderTeachers(uniqueUsers, favorites);
        renderFavorites(uniqueUsers, favorites);
        renderStatistics(uniqueUsers);
        
    } catch (error) {
        console.error('Error loading more users:', error);
    } finally {
        loadMoreButton.disabled = false;
        loadMoreButton.textContent = 'Load More';
    }
}

loadMoreButton.addEventListener('click', loadMoreUsers);