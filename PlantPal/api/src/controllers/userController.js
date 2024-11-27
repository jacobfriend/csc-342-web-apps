const {
  TokenMiddleware,
  generateToken,
  removeToken,
} = require("../middleware/TokenMiddleware");
const UserDAO = require("../db/UserDAO");

// This file manages user-related functionality
module.exports = {

  registerUser: (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    // Check if user already exists
    UserDAO.getUserByCredentials(username, password)
      .then(() => {
        return res.status(400).json({ error: "Username already taken." }); // Avoid duplicate username
      })
      .catch((err) => {
        console.error("Error during user check: ", err);
        // Call DAO to insert the new user into the database (no password hashing for now)
        UserDAO.addNewUser(username, password)
          .then(() => {
            UserDAO.getUserByCredentials(username, password).then((user) => {
              generateToken(req, res, user); // Generate token if login is successful
              return res.json({
                success: true,
                message: "Login successful",
                user,
              });
            });
          })
          .catch((error) => {
            console.error("Error during user registration: ", error);
            res
              .status(500)
              .json({ error: "An error occurred while registering the user." });
          });
      });
  },

  loginUser: (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Credientals are not provided" });
    }

    UserDAO.getUserByCredentials(username, password)
      .then((user) => {
        generateToken(req, res, user); // Generate token if login is successful
        return res.json({ success: true, message: "Login successful", user });
      })
      .catch((error) => {
        if (error.message === "No such user") {
          return res.status(400).json({ error: "Username not found." });
        } else if (error.message === "Invalid password") {
          return res.status(400).json({ error: "Incorrect password." });
        } else {
          return res.status(500).json({
            error: "An error occurred during login. Please try again.",
          });
        }
      });
  },

  logoutUser: (req, res) => {
    removeToken(req, res);
    res.status(200).json({ message: "Token removed successfully" });
  },
};
