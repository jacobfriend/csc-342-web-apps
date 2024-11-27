const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/app/frontend/public/plants/"); // Path to images
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// File type validation
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 800 * 1024 }, // Limit to 800 KB
});

module.exports = upload;
