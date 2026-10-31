import { randomUserMock } from '../mock.js';
import {additionalUsers} from '../mock.js';
//import readline from 'readline';


// завдання 1
const courses = ["Mathematics", "Physics", "English", "Computer Science", "Dancing", "Chess", "Biology", "Chemistry", "Law", "Art", "Medicine", "Statistics"];

const random_user_mock = randomUserMock.map((user) =>{
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

const additional_users = additionalUsers.map((user) =>{
    return{
        id: user.id,
        gender: user.gender || null,
        title: user.title || null,
        full_name: user.full_name,
        city: user.city || null,
        state: user.state || null,
        country: user.country || null,
        postcode: user.postcode || null,
        coordinates: user.coordinates || null,
        timezone: user.timezone || null,
        email: user.email || null,
        b_date: user.b_date || user.b_day || null,
        age: user.age || (user.b_day ? (new Date().getFullYear() - new Date(user.b_day).getFullYear()) : null),
        phone: user.phone || null,
        picture_large: user.picture_large || null,
        picture_thumbnail: user.picture_thumbnail || null,
        course: user.course ? user.course : courses[Math.floor(Math.random() * courses.length)],
        favorite: user.favorite ?? false,
        bg_color: user.bg_color || null,
        note: user.note || null,
    }
});

const combinedUsers = [...random_user_mock, ...additional_users];
export const uniqueUsers = combinedUsers.filter((user, index, array) => {
  return array.findIndex((u) => u.email === user.email) === index;
});

// завдання 2
function isValidCapitalizedString(value, isRequired = false) {
  if (value === null || value === undefined) {
    return !isRequired;
  }
  if (typeof value !== 'string' || value.trim().length === 0) {
    return false;
  }
  const firstChar = value.trim()[0];
  return firstChar === firstChar.toUpperCase() && firstChar !== firstChar.toLowerCase();
}

function validateUser(user) {
  if (!user || typeof user !== 'object') {
    return false;
  }

  const stringFields = ['full_name', 'gender', 'city', 'country', 'state', 'note'];
  for (const field of stringFields) {
    if (!isValidCapitalizedString(user[field], false)) {
      return false;
    }
  }

  if (typeof user.age !== 'number' || Number.isNaN(user.age) || user.age <= 0) {
    return false;
  }

  if (typeof user.email !== 'string' || !user.email.includes('@')) {
    return false;
  }

  if (typeof user.phone !== 'string' || user.phone.trim().length === 0) {
    return false;
  }
  const phoneRegex = /^[\d\s()+-]+$/;
  if (!phoneRegex.test(user.phone)) {
    return false;
  }

  return true;
}

// завдання 3
export function filterUsers(users, filters, favorites) {
    return users.filter(user => {
        const matchCountry = !filters.country ||
            user.country === filters.country;

        let matchAge = true;

        if (filters.age === '18-31') {
            matchAge = user.age >= 18 && user.age <= 31;
        } else if (filters.age === '32-45') {
            matchAge = user.age >= 32 && user.age <= 45;
        } else if (filters.age === '46+') {
            matchAge = user.age >= 46;
        }

        const matchGender = !filters.gender ||
            user.gender?.toLowerCase() === filters.gender;

        const matchFavorite = !filters.favorite ||
            favorites.has(user.email);

        const matchPhoto = !filters.photo ||
            Boolean(user.picture_large);

        return matchCountry &&
               matchAge &&
               matchGender &&
               matchFavorite &&
               matchPhoto;
    });
}

// завдання 4
export function sortUsers(users, sortBy, order = 'asc') {
  return users.toSorted((a, b) => {
    if(typeof a [sortBy] === 'number'){
      return order === 'asc' ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy];
    } else {
      const valueA = String(a[sortBy]).toLowerCase();
      const valueB = String(b[sortBy]).toLowerCase();
      return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }
  })
}

// завдання 5
export function searchUsers(users, searchCategory, searchValue) {
  return users.filter((user) => {
    const value = user[searchCategory];
    if (typeof value === 'string') {
      return value.toLowerCase().includes(searchValue.toLowerCase());
    }
    return value === parseInt(searchValue);
  });
}

// завдання 6
function getSearchPercentage(users, predicate) {
  const totalUsers = users.length;
  if (totalUsers === 0) {
    return 0;
  }

  const matchingUsers = users.filter(user => predicate(user)).length;
  return (matchingUsers / totalUsers) * 100;
}

// тестування функцій
///const rl = readline.createInterface({
///  input: process.stdin,
///  output: process.stdout
///});

function showMenu() {
  console.log('\n--- SELECT AN ACTION ---');
  console.log('1.1. Show total number of unique users');
  console.log('1.2. Show all users');
  console.log('2. Validate user');
  console.log('3. Filter users by country, age, gender, and favorite status');
  console.log('4. Sort users by a specific field');
  console.log('5. Search users by specific field');
  console.log('6. Get percentage of users matching a specific condition');
  console.log('0. Exit');

  rl.question('\nEnter option number: ', (choice) => {
    switch (choice.trim()) {
      case '1.1':
        console.log(`\nTotal unique users: ${uniqueUsers.length}`);
        showMenu();
        break;
      case '1.2':
        console.log('\nAll users:');
        uniqueUsers.forEach((user, index) => {
          console.log(`${index + 1}. ${user.full_name}, ${user.gender}, ${user.country}, ${user.age} years (${user.email})`);
        });
        showMenu();
        break;
      case '2':
        rl.question('Enter user email to validate: ', (email) => {
          const result = validateUser(uniqueUsers.find(u => u.email === email.trim()));
          console.log(`\nUser is valid: ${result}`);
          showMenu();
        });
        break;
      case '3':
        rl.question('Enter country to filter by (or leave blank): ', (country) => {
          rl.question('Enter age to filter by (or leave blank): ', (ageInput) => {
            rl.question('Enter gender to filter by (or leave blank): ', (gender) => {
              rl.question('Enter favorite status to filter by (true/false or leave blank): ', (favoriteInput) => {
                const filters = {
                  country: country || undefined,
                  age: ageInput ? parseInt(ageInput) : undefined,
                  gender: gender || undefined,
                  favorite: favoriteInput ? favoriteInput === 'true' : undefined
                };
                const result = filterUsers(uniqueUsers, filters);
                result.forEach((user, index) => {
                  console.log(`${index + 1}. ${user.full_name}, ${user.gender}, ${user.country}, ${user.age} years (${user.email})`);
                });
                showMenu();
              });
            });
          });
        });
        break;
      case '4':
        rl.question('Enter field to sort by (full_name, email, age, gender, country, b_day...): ', (field) => {
          const result = sortUsers(uniqueUsers, field);
          console.log(`\nSorted users:`);
          result.forEach((user, index) => {
            console.log(`${index + 1}. ${user.full_name}, ${user.gender}, ${user.country}, ${user.age} years (${user.email})`);
          });
          showMenu();
        });
        break;
      case '5':
        rl.question('Enter field to search by (full_name, email, age, gender, country, b_day...): ', (field) => {
          rl.question('Enter search query: ', (query) => {
            const result = searchUsers(uniqueUsers, field, query);
            result.forEach((user, index) => {
              console.log(`${index + 1}. ${user.full_name}, ${user.gender}, ${user.country}, ${user.age} years (${user.email})`);
            });
            showMenu();
          });
        });
        break;
      case '6':
        rl.question('Enter function to evaluate (e.g., "user => user.age > 25"): ', (func) => {
          const result = uniqueUsers.filter(func);
          console.log(`\nPercentage of users matching condition: ${(result.length / uniqueUsers.length * 100).toFixed(2)}%`);
          showMenu();
        });
        break;
      case '0':
        console.log('\nExiting application...');
        rl.close();
        break;
      default:
        console.log('\nInvalid choice, please try again.');
        showMenu();
    }
  });
}

//showMenu();