const keys = ['firstName', 'lastName', 'email', 'isStudent'];

const values = [
  ['Stuart', 'Dent', 'student@ncsu.edu', true],
  ['Grace', 'Duate', 'graduate@ncsu.edu', false],
  ['Facundo', 'Ulty', 'faculty@ncsu.edu', false],
];

// Write code to convert the above arrays into an array of objects
const result = values.map((item) => {
    let user = {};
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        user[key] = item[i]; // how is item mapped to the values array?
    }
    return user;
});

// Print the array of objects to the console
console.log(result);

/* Expected output:
[
  {
    firstName: 'Stuart',
    lastName: 'Dent',
    email: 'student@ncsu.edu',
    isStudent: true
  },
  {
    firstName: 'Grace',
    lastName: 'Duate',
    email: 'graduate@ncsu.edu',
    isStudent: false
  },
  {
    firstName: 'Facundo',
    lastName: 'Ulty',
    email: 'faculty@ncsu.edu',
    isStudent: false
  }
]
*/