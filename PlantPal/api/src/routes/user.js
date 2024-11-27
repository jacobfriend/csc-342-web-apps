const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { TokenMiddleware } = require("../middleware/TokenMiddleware");

router.post("/login", userController.loginUser);

router.get("/logout", userController.logoutUser); // Add logout route

//register user endpoint
router.post("/register", userController.registerUser);

module.exports = router;
