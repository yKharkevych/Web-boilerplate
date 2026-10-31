function createTeacherCard(teacher, favorites) {
    const teacherCard = document.createElement('li');
    teacherCard.classList.add('teacher-card');
    teacherCard.dataset.email = teacher.email;

    if (favorites.has(teacher.email)) {
        teacherCard.classList.add('is-favorite');
    }

    const imgDiv = document.createElement('div');
    imgDiv.classList.add('avatar');

    if (teacher.picture_large) {
        const img = document.createElement('img');
        img.src = teacher.picture_large;
        img.alt = `${teacher.full_name}'s profile picture`;
        imgDiv.append(img);
    } else {
        imgDiv.classList.add('avatar-initials');
        imgDiv.textContent = teacher.full_name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();
    }

    const name = document.createElement('h3');
    name.classList.add('teacher-name');
    name.textContent = teacher.full_name;

    const course = document.createElement('p');
    course.classList.add('teacher-subject');
    course.textContent = teacher.course;

    const country = document.createElement('p');
    country.classList.add('teacher-country');
    country.textContent = teacher.country;

    teacherCard.append(imgDiv, name, course, country);

    return teacherCard;
}

export function renderTeachers(teachers, favorites) {
    const teachersList = document.querySelector('.teachers-grid');
    teachersList.replaceChildren();

    teachers.forEach(teacher => {
        const card = createTeacherCard(teacher, favorites);
        teachersList.append(card);
    });
}

export function renderFavorites(teachers, favorites) {
    const favoritesList = document.querySelector('.favorites-list');
    favoritesList.replaceChildren();

    const favoriteTeachers = teachers.filter(teacher =>
        favorites.has(teacher.email)
    );

    favoriteTeachers.forEach(teacher => {
        const card = createTeacherCard(teacher, favorites);
        favoritesList.append(card);
    });
}

export function renderTeacherInfo(teacher) {
    const popup = document.querySelector('#popup-teacher-info');

    const photo = popup.querySelector('.info-photo');
    photo.src = teacher.picture_large;
    photo.alt = teacher.full_name;

    const name = popup.querySelector('.info-name');
    name.textContent = teacher.full_name;

    const subject = popup.querySelector('.info-subject');
    subject.textContent = teacher.course;

    const infoMain = popup.querySelector('.info-main');
    const paragraphs = infoMain.querySelectorAll(':scope > p');

    paragraphs[0].textContent =
        [teacher.city, teacher.country].filter(Boolean).join(', ');

    paragraphs[1].textContent =
        `${teacher.age ?? 'Unknown'}, ${teacher.gender ?? 'Unknown'}`;

    const email = popup.querySelector('.info-email');
    email.textContent = teacher.email || 'Not specified';
    email.href = teacher.email ? `mailto:${teacher.email}` : '#';

    paragraphs[3].textContent = teacher.phone || 'Not specified';

    const note = popup.querySelector('.info-text');
    note.textContent = teacher.note || 'No additional information';
}

export function renderStatistics(teachers) {
    const tableBody = document.querySelector('.stats-table tbody');

    tableBody.replaceChildren();

    teachers.forEach(teacher => {
        const row = document.createElement('tr');

        const name = document.createElement('td');
        name.textContent = teacher.full_name ?? 'Unknown';

        const course = document.createElement('td');
        course.textContent = teacher.course ?? 'Unknown';

        const age = document.createElement('td');
        age.textContent = teacher.age ?? 'Unknown';

        const gender = document.createElement('td');
        gender.textContent = teacher.gender ?? 'Unknown';

        const country = document.createElement('td');
        country.textContent = teacher.country ?? 'Unknown';

        row.append(name, course, age, gender, country);
        tableBody.append(row);
    });
}