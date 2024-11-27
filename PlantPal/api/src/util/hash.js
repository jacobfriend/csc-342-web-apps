const crypto = require("crypto");

let users = {
  1: {
    id: 1,
    username: "maricha6",
  },
  2: {
    id: 2,
    username: "jsfriend",
  },
  3: {
    id: 3,
    username: "ledupug",
  },
  4: {
    id: 4,
    username: "student",
  },
};

function hashPassword(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString("hex"));
    });
  });
}

async function generateHashedPasswords(users) {
  for (const userId in users) {
    const user = users[userId];
    const password = "password";
    console.log(password);
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = await hashPassword(password, salt);

    user.salt = salt;
    user.hashedPassword = hashedPassword;
  }
  return users;
}

// Main function to generate hashes for all users
(async () => {
  const updatedUsers = await generateHashedPasswords(users);

  // Output the result as JSON
  console.log(JSON.stringify(updatedUsers, null, 2));
})();
