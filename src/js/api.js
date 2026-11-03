const courses = ["Mathematics", "Physics", "English", "Computer Science", "Dancing", "Chess", "Biology", "Chemistry", "Law", "Art", "Medicine", "Statistics"];

export async function fetchUsers(count = 50) {
    const response = await fetch(
        `https://randomuser.me/api?results=${count}`
    );

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    const users = data.results.map((user) => {
        return{
            id: user.login.uuid,
            gender: user.gender,
            title: user.name.title,
            full_name: `${user.name.first} ${user.name.last}`,
            city: user.location.city,
            state: user.location.state,
            country: user.location.country,
            postcode: user.location.postcode,
            coordinates: user.location.coordinates,
            timezone: user.location.timezone,
            email: user.email,
            b_date: user.dob.date,
            age: user.dob.age,
            phone: user.phone,
            picture_large: user.picture.large,
            picture_thumbnail: user.picture.thumbnail,
            course: courses[Math.floor(Math.random() * courses.length)],
            favorite: false,
            bg_color: null,
            note: null
        }
    });
    return users;
}

export async function addTeacher(teacher) {
    const response = await fetch('http://localhost:3002/teachers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(teacher)
    });

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
}

export async function fetchSavedTeachers() {
    const response = await fetch('http://localhost:3002/teachers');

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
}