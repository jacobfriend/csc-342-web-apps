const validateAddPlants = require("../validation/plantValidation");

const PlantDAO = require("../db/PlantDAO");
const MetricDAO = require("../db/MetricDAO");
const { sendPushNotification } = require("../routes/NotificationRoutes");

const metricMap = new Map([
  ["height", MetricDAO.insertHeight],
  ["soil", MetricDAO.insertSoil],
  ["leaves", MetricDAO.insertLeaf],
  ["fruit", MetricDAO.insertFruit],
]);

module.exports = {
  getPlants: (req, res) => {
    PlantDAO.getPlants(req.user.id)
      .then((plants) => {
        res.status(200).json(plants);
      })
      .catch((error) => res.status(404).json({ message: "Plants not found." }));
  },

  getPlant: (req, res) => {
    // Get the plant ID from the request parameters
    const plantId = parseInt(req.params.plantId);

    PlantDAO.getPlantById(req.user.id, plantId)
      .then((plant) => {
        res.status(200).json(plant);
      })
      .catch((error) => res.status(404).json({ message: "Plant not found." }));
  },

  waterPlant: (req, res) => {
    // Get the plant ID from the request parameters
    const plantId = parseInt(req.params.plantId);

    PlantDAO.waterPlant(req.user.id, plantId)
      .then(() => {
        res.status(200).json({ message: "Successfully watered plant." });
      })
      .catch((error) => res.status(404).json({ message: "Plant not found." }));
  },

  // Adds a new data point to the appropriate tables for this plant's metric tracking (ie. Height, Soil, ...)
  trackPlant: async (req, res) => {
    // Get the plant ID and metric type from the request parameters
    const plantId = parseInt(req.params.plantId);
    const metricName = req.params.metricName;

    try {
      const plant = await PlantDAO.getPlantById(req.user.id, plantId);
      const insertQuery = metricMap.get(metricName.toLowerCase());
      if (!insertQuery) {
        throw new Error("Invalid metric name");
      }
      const value = req.body.value;
      await insertQuery(plant.plant_id, value);
      return res.json({ message: "Successfully added metric." });
    } catch (error) {
      return res
        .status(404)
        .json({ message: "Failed to add metric for this plant" });
    }
  },

  addJournalEntry: async (req, res) => {
    // Get the plant ID and metric type from the request parameters
    const plantId = parseInt(req.params.plantId);

    try {
      const plant = await PlantDAO.getPlantById(req.user.id, plantId);
      const content = req.body.content;
      await PlantDAO.saveJournalEntry(plant.plant_id, content.trim());
      return res.json({ message: "Successfully added journal entry." });
    } catch (error) {
      return res
        .status(404)
        .json({ message: "Failed to add journal entry for this plant" });
    }
  },

  // Create and add new plant to database
  addPlant: (req, res) => {
    // Extract fields from the plant object
    const { plant } = req.body;
    const { id, name, image, water, sun, soil, temp, info, tags } = plant;

    try {
      PlantDAO.addPlant(
        req.user.id,
        name,
        image,
        water,
        sun,
        soil,
        temp,
        info,
        tags
      );
      return res.status(201).json({ message: "Successfully added new plant." });
    } catch (error) {
      return res.status(404).json({ message: "Failed to add new plant." });
    }
  },

  // Remove existing plant from the database
  removePlant: async (req, res) => {
    // Get the plant ID from the request parameters
    const plantId = parseInt(req.params.plantId);

    try {
      console.log("Deleting plant: " + plantId);
      await PlantDAO.removePlant(req.user.id, plantId);
      return res.json({ message: "Successfully removed plant." });
    } catch (err) {
      return res.status(404).json({ message: "Plant could not be deleted." });
    }
  },

  getPlantJournal: (req, res) => {
    const plantId = parseInt(req.params.plantId); // Get the plant ID from the request parameters

    PlantDAO.getPlantJournal(plantId)
      .then((journal) => {
        res.status(200).json(journal);
      })
      .catch((error) =>
        res.status(404).json({ message: "Journal entries not found." })
      );
  },

  getPlantMeasurements: (req, res) => {
    const plantId = parseInt(req.params.plantId);

    PlantDAO.getAllPlantMeasurements(plantId)
      .then((measurements) => {
        res.status(200).json(measurements);
      })
      .catch((error) => res.status(404).json({ message: "Plant not found." }));
  },

  getPlantInfo: (req, res) => {
    const plantId = parseInt(req.params.plantId);

    PlantDAO.getPlantInfo(plantId)
      .then((info) => {
        res.status(200).json(info);
      })
      .catch((error) => {
        console.log(error);
        res.status(404).json({ message: "Plant not found." });
      });
  },

  getPlantsPerMonth: (req, res) => {
    PlantDAO.getPlantsPerMonth(req.user.id)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => {
        console.log(error);
        res.status(404).json({ message: "No plants created." });
      });
  },
};
