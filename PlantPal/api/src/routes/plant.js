const express = require("express");
const router = express.Router();
const plantController = require("../controllers/plantController");
const { TokenMiddleware } = require("../middleware/TokenMiddleware");

// ================ PLANT ROUTES ====================

// Retrieves an array of all the user's plants
// JOINs together plant and profile tables (data needed: name, image, and age)
router.get("/plants", TokenMiddleware, plantController.getPlants);

// Retrieves the specific user's plants
// JOINs together plant and profile tables
router.get("/plants/:plantId", TokenMiddleware, plantController.getPlant);

// Adds a new data point for this plant's metric tracking (ie. Height, Soil, ...)
router.post(
  "/plants/:plantId/tracking/:metricName",
  TokenMiddleware,
  plantController.trackPlant
);

// Adds a new journal entry for this plant
router.post(
  "/plants/:plantId/journal",
  TokenMiddleware,
  plantController.addJournalEntry
);

// Retrieves the specific user's plants -> journal entries
router.get(
  "/plants/:plantId/journal",
  TokenMiddleware,
  plantController.getPlantJournal
);

// Retrieves the specific user's plants -> measurements
router.get(
  "/plants/:plantId/measurements",
  TokenMiddleware,
  plantController.getPlantMeasurements
);

// Retrieves the specific user's plants -> info
router.get(
  "/plants/:plantId/info",
  TokenMiddleware,
  plantController.getPlantInfo
);

// Waters the specified plant
router.get(
  "/plants/:plantId/water",
  TokenMiddleware,
  plantController.waterPlant
);

// Creates a user's plant
// INSERT INTO plant table
router.post("/plants", TokenMiddleware, plantController.addPlant);

router.get(
  "/plants/totals/monthly",
  TokenMiddleware,
  plantController.getPlantsPerMonth
);

router.delete("/plants/:plantId", TokenMiddleware, plantController.removePlant);

// ================ PROFILE ROUTES ====================

// Retrieves an array of all the plant profiles
router.get("/profiles", TokenMiddleware, plantController.getPlants);

// Retrieves a specific plant profile
// INSERT INTO profile table, then call POST /plants
router.get("/profiles/:profileId", TokenMiddleware, plantController.getPlants);

module.exports = router;
