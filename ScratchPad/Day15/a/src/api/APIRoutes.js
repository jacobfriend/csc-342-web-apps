const CountyDAO = require('./db/CountyDAO');
const ParkDAO = require('./db/ParkDAO');
const express = require('express');

const router = express.Router();

router.get('/counties', (req, res) => {
	CountyDAO.getCounties().then((counties) => {
		res.json(counties);
	});
});

router.get('/counties/:countyId', function(req, res) {
	CountyDAO.getCountyById(req.params.countyId).then((county) => {
		res.json(county);
  }).catch((err) => {
		res.status(404).json({error: 'County not found'});
	});;
});

router.get('/counties/:countyId/parks', function(req, res) {
	ParkDAO.getParksByCountyId(req.params.countyId).then((parks) => {
		res.json(parks);
	}).catch((err) => {
		res.status(404).json({error: 'Error, county id may be invalid'});
	});
});

router.get('/parks', function(req, res) {
	ParkDAO.getParksByCountyId(null).then((parks) => {
		res.json(parks);
	});
});

router.get('/parks/:parkId', function(req, res) {
	ParkDAO.getParkById(req.params.parkId).then((park) => {
		res.json(park);
	}).catch((err) => {
		res.status(404).json({error: 'Error park not found'});
	});
});

module.exports = router;