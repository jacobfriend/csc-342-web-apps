const db = require("./DBConnection");
const Plant = require("./models/Plant");

module.exports = {
  getPlantById: (user_id, plant_id) => {
    return db
      .query(
        "SELECT Plants.id AS plant_id, Plants.profile_id AS profile_id, Plants.created_at, Plants.last_watered, Profiles.name, Profiles.image, Profiles.water, Profiles.sun, Profiles.soil, Profiles.temp, Profiles.info, Profiles.tags FROM Plants JOIN Profiles ON Profiles.id = Plants.profile_id WHERE Plants.user_id=? AND Plants.id=?",
        [user_id, plant_id]
      )
      .then((rows) => {
        if (rows.length === 1) {
          return new Plant(rows[0]);
        }
        throw new Error("Too many rows returned.");
      });
  },

  getPlants: (user_id) => {
    return db
      .query(
        "SELECT Plants.id AS plant_id, Plants.profile_id AS profile_id, Plants.created_at, Plants.last_watered, Profiles.name, Profiles.image, Profiles.water, Profiles.sun, Profiles.soil, Profiles.temp, Profiles.tags FROM Plants JOIN Profiles ON Profiles.id = Plants.profile_id WHERE Plants.user_id=? ORDER BY Profiles.name ASC",
        [user_id]
      )
      .then((rows) => {
        if (rows.length > 0) {
          const plants = rows.map((row) => new Plant(row));
          return plants;
        }
        throw new Error("No plants found.");
      });
  },

  waterPlant: (user_id, plant_id) => {
    return db
      .query(
        "UPDATE Plants SET last_watered = CURRENT_TIMESTAMP WHERE user_id = ? AND id = ?",
        [user_id, plant_id]
      )
      .then((response) => {
        console.log(response);
      });
  },

  getPlantJournal: (plant_id) => {
    return db
      .query(
        "SELECT * FROM JournalEntries WHERE JournalEntries.plant_id=? ORDER BY time DESC",
        [plant_id]
      )
      .then((rows) => {
        return rows;
      });
  },

  getAllPlantMeasurements: (plant_id) => {
    return Promise.all([
      db.query(
        "SELECT value, time FROM HeightMeasurements WHERE plant_id=? ORDER BY time DESC",
        [plant_id]
      ),
      db.query(
        "SELECT value, time FROM SoilMeasurements WHERE plant_id=? ORDER BY time DESC",
        [plant_id]
      ),
      db.query(
        "SELECT value, time FROM FruitMeasurements WHERE plant_id=? ORDER BY time DESC",
        [plant_id]
      ),
      db.query(
        "SELECT value, time FROM LeafMeasurements WHERE plant_id=? ORDER BY time DESC",
        [plant_id]
      ),
    ]).then((results) => {
      if (results.length === 4) {
        [heightData, soilData, fruitData, leafData] = results;
        return {
          heightData: heightData,
          soilData: soilData,
          fruitData: fruitData,
          leafData: leafData,
        };
      }
      throw new Error("Measurement data not found.");
    });
  },

  getPlantInfo: (plant_id) => {
    return db
      .query(
        "SELECT Profiles.info as info FROM Plants JOIN Profiles ON Plants.profile_id=Profiles.id WHERE Plants.id=?",
        [plant_id]
      )
      .then((rows) => {
        if (rows.length === 1) {
          return rows[0];
        }
        throw new Error("Too many rows returned.");
      });
  },

  saveJournalEntry: (plant_id, content) => {
    return db.query(
      "INSERT INTO JournalEntries (plant_id, content) VALUES (?, ?)",
      [plant_id, content]
    );
  },

  getPlantsPerMonth: (user_id) => {
    return Promise.all([
      db.query(
        "SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count FROM Plants WHERE user_id = ? GROUP BY DATE_FORMAT(created_at, '%Y-%m') ORDER BY DATE_FORMAT(created_at, '%Y-%m')",
        [user_id]
      ),
      db.query(
        "SELECT DATE_FORMAT(time, '%Y-%m') AS month, COUNT(*) AS count FROM JournalEntries JOIN Plants ON Plants.id=JournalEntries.plant_id WHERE Plants.user_id=? GROUP BY DATE_FORMAT(time, '%Y-%m') ORDER BY DATE_FORMAT(time, '%Y-%m')",
        [user_id]
      ),
      db.query(
        "SELECT DATE_FORMAT(measurements.time, '%Y-%m') AS month, COUNT(*) AS count FROM (SELECT time FROM SoilMeasurements JOIN Plants ON Plants.id = SoilMeasurements.plant_id WHERE Plants.user_id = ? UNION ALL SELECT time FROM HeightMeasurements JOIN Plants ON Plants.id = HeightMeasurements.plant_id WHERE Plants.user_id = ? UNION ALL SELECT time FROM FruitMeasurements JOIN Plants ON Plants.id = FruitMeasurements.plant_id WHERE Plants.user_id = ? UNION ALL SELECT time FROM LeafMeasurements JOIN Plants ON Plants.id = LeafMeasurements.plant_id WHERE Plants.user_id = ?) AS measurements GROUP BY DATE_FORMAT(measurements.time, '%Y-%m') ORDER BY DATE_FORMAT(measurements.time, '%Y-%m');",
        [user_id, user_id, user_id, user_id]
      ),
      // MORE DB QUERIES
    ]).then((results) => {
      if (results.length === 3) {
        [newPlants, journals, measurements] = results;
        return {
          Plants: newPlants,
          Journals: journals,
          Measurements: measurements,
        };
      }
      throw new Error("Summary data not found.");
    });
  },

  addPlant: (user_id, name, image, water, sun, soil, temp, info, tags) => {
    // Convert tags to a JSON string
    const tagsJson = JSON.stringify(tags);

    // Check if the plant profile already exists
    db.query(`SELECT id FROM Profiles WHERE name = ?`, [name])
      .then((rows) => {
        if (rows.length > 0) {
          // Plant profile exists, get its ID
          const profileId = rows[0].id;
          console.log("Plant profile already exists with ID:", profileId);
          return profileId; // Pass profileId to the next step
        } else {
          // Plant profile does not exist, create a new one
          return db
            .query(
              `INSERT INTO Profiles (name, image, water, sun, soil, temp, info, tags) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [name, image, water, sun, soil, temp, info, tagsJson]
            )
            .then((result) => {
              const newProfileId = result.insertId;
              console.log("New plant profile created with ID:", newProfileId);
              return newProfileId; // Pass newProfileId to the next step
            });
        }
      })
      .then((profileId) => {
        // Link the plant profile to the user
        return db.query(
          `INSERT INTO Plants (user_id, profile_id, created_at) 
             VALUES (?, ?, NOW())`,
          [user_id, profileId]
        );
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.error("Error adding plant:", err);
      });
  },

  removePlant: (user_id, plant_id) => {
    return db
      .query(
        "DELETE FROM Plants WHERE user_id = ? AND id = ?",
        [user_id, plant_id]
      )
      .then((result) => {
        if (result.affectedRows === 1) {
          return { message: "Plant removed successfully" };
        }
        throw new Error("Plant not found or already deleted.");
      });
  },

};
