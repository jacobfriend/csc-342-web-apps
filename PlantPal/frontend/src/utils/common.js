export const WATER_THRESHOLD = 5;

// TODO: Expensive -> think about chaching, storing in state, or computing at SQL query level
export function getCountTuple(plants, plant) {
  // Filter plants based on the name
  const filteredPlants = plants.filter((p) => p.name === plant.name);

  // Sort the filtered plants by age (ascending)
  filteredPlants.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  // Get the total number of filtered plants
  const total = filteredPlants.length;

  // Find the index of the current plant in the sorted list (1-based index)
  const index =
    filteredPlants.findIndex((p) => p.plant_id === plant.plant_id) + 1;

  // Return the index and total as a string
  return [index, total];
}

export function getCountString(plants, plant) {
  const [index, total] = getCountTuple(plants, plant);
  return `${index} / ${total}`;
}

export function getOptionalCountString(plants, plant) {
  const [index, total] = getCountTuple(plants, plant);
  return total > 1 ? ` - ${index}/${total}` : "";
}

export function getAge(timestamp) {
  const plantDate = new Date(timestamp);
  const currentDate = new Date();
  const differenceInTime = currentDate - plantDate;
  const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
  return differenceInDays;
}

export function getLastWatered(plant) {
  return plant.last_watered
    ? getAge(plant.last_watered)
    : getAge(plant.created_at);
}

export function formatDate(timestamp) {
  const date = new Date(timestamp);

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return formattedDate;
}

export function formatMonth(dateString) {
  const [year, month] = dateString.split("-"); // Split '2024-09'
  const date = new Date(year, month - 1); // Month is zero-indexed
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}
