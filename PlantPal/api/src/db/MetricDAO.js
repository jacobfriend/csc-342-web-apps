const db = require("./DBConnection");

module.exports = {
  insertHeight: (plant_id, value) => {
    return db.query(
      "INSERT INTO HeightMeasurements (plant_id, value) VALUES (?, ?)",
      [plant_id, value]
    );
  },
  insertSoil: (plant_id, value) => {
    return db.query(
      "INSERT INTO SoilMeasurements (plant_id, value) VALUES (?, ?)",
      [plant_id, value]
    );
  },
  insertLeaf: (plant_id, value) => {
    return db.query(
      "INSERT INTO LeafMeasurements (plant_id, value) VALUES (?, ?)",
      [plant_id, value]
    );
  },
  insertFruit: (plant_id, value) => {
    return db.query(
      "INSERT INTO FruitMeasurements (plant_id, value) VALUES (?, ?)",
      [plant_id, value]
    );
  },
};
