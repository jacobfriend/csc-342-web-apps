module.exports = class Plant {
  id = null;
  name = null;
  image = null;
  water = null;
  sun = null;
  soil = null;
  temp = null;
  info = null;
  tags = null;

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.image = data.image;
    this.water = data.water;
    this.sun = data.sun;
    this.soil = data.soil;
    this.temp = data.temp;
    this.info = data.info;
    this.tags = data.tags;
  }
};
