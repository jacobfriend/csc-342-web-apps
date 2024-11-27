module.exports = class Plant {
  plant_id = null;
  profile_id = null;
  created_at = null;
  last_watered = null;
  name = null;
  image = null;
  water = null;
  sun = null;
  soil = null;
  temp = null;
  tags = null;

  constructor(data) {
    this.plant_id = data.plant_id;
    this.profile_id = data.profile_id;
    this.created_at = data.created_at;
    this.last_watered = data.last_watered;
    this.name = data.name;
    this.image = data.image;
    this.water = data.water;
    this.sun = data.sun;
    this.soil = data.soil;
    this.temp = data.temp;
    this.tags = data.tags;
  }
};
