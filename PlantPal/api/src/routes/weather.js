const express = require("express");
const router = express.Router();

// GET /weather
// Retrieves Raleigh, NC local weather report
router.get("/weather", async (req, res) => {
  res.status(200).json({
		temperature: 72,
    humidity: "53%",
    co2: 673,
	});
});

module.exports = router;

// TODO: Fetch request to weather.gov API

// fetch('https://api.weather.gov/gridpoints/RAH/50,70/forecast')
//   .then(response => {
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return response.json();
//   })
//   .then(data => {
//     console.log(data);
//   })
//   .catch(error => {
//     console.error('Error fetching weather data:', error);
//   });
