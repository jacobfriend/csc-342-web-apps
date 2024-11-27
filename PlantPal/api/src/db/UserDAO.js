const db = require("./DBConnection");
const User = require("./models/User");
const crypto = require("crypto");

module.exports = {
  getUserByCredentials: (username, password) => {
    return db
      .query("SELECT * FROM Users WHERE username=?", [username])
      .then((rows) => {
        if (rows.length === 1) {
          // we found our user
          const user = new User(rows[0]);
          return user.validatePassword(password);
        }
        // if no user with provided username
        throw new Error("No such user");
      });
  },

  addNewUser: async (username, password) => {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = await User.generatePrivateFields(password, salt);
    const first_name = "First";
    const last_name = "Last";
    return db
      .query(
        "INSERT INTO Users (first_name, last_name, username, hash, salt) VALUES (?, ?, ?, ?, ?)",
        [first_name, last_name, username, hash, salt]
      )
      .then((response) => {
        console.log(response);
      });
  },
};
