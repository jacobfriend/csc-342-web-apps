const express = require('express');
const cookieParser = require('cookie-parser');

const apiRouter = express.Router();

apiRouter.use(cookieParser());
apiRouter.use(express.json());

const { generateToken, removeToken, TokenMiddleware } = require('../middleware/TokenMiddleware');


const CountyDAO = require('./db/CountyDAO');
const ParkDAO = require('./db/ParkDAO');
const UserDAO = require('./db/UserDAO');


/************\
* API ROUTES *
\************/


//Get all counties
apiRouter.get('/counties', TokenMiddleware, (req,  res) => {
  CountyDAO.getCounties().then(counties => {
    res.json(counties);
  })
  .catch(err => {
    res.status(500).json({error: 'Internal server error'});
  });
});

//Get all parks
apiRouter.get('/parks', TokenMiddleware, (req,  res) => {
  ParkDAO.getParks().then(parks => {
    res.json(parks);
  })
  .catch(err => {
    res.status(500).json({error: 'Internal server error'});
  });
});


//Get specific park
apiRouter.get('/parks/:parkId', TokenMiddleware, (req,  res) => {
  const parkId = req.params.parkId;
  ParkDAO.getParkById(parkId).then(park => {
    res.json(park);
  })
  .catch(err => {
    res.status(404).json({error: 'Park not found'});
  });
});

//Get all parks in specific county
apiRouter.get('/counties/:countyId/parks', TokenMiddleware, (req,  res) => {
  const countyId = parseInt(req.params.countyId);
  ParkDAO.getParksByCountyId(countyId).then(parks => {
    res.json(parks);
  })
  .catch(err => {
    res.status(500).json({error: err});
  });
});

//Get specific county
apiRouter.get('/counties/:countyId', TokenMiddleware, (req,  res) => {
  const countyId = req.params.countyId;
  CountyDAO.getCountyById(countyId).then(county => {
    res.json(county);
  })
  .catch(err => {
    res.status(404).json({error: 'County not found'});
  });
});


//Create a park
apiRouter.post('/parks', TokenMiddleware, (req,  res) => {
  let newPark = req.body;
  ParkDAO.createPark(newPark).then(park => {
    res.json(park);
  })
  .catch(err => {
    res.status(500).json({error: 'Internal server error'});
  });
});

//Create a county
apiRouter.post('/counties', TokenMiddleware, (req,  res) => {
  let newCounty = req.body;
  CountyDAO.createCounty(newCounty).then(county => {
    res.json(county);
  })
  .catch(err => {
    res.status(500).json({error: 'Internal server error'});
  });
});


//Update a county
apiRouter.put('/counties/:county', TokenMiddleware, (req,  res) => {
  res.status(501).json({error: 'Not implemented'});
});
//Update a park
apiRouter.put('/parks/:parkId', TokenMiddleware, (req,  res) => {
  res.status(501).json({error: 'Not implemented'});
});

//Delete a county
apiRouter.delete('/counties/:county', TokenMiddleware, (req,  res) => {
  res.status(501).json({error: 'Not implemented'});
});
//Delete a park
apiRouter.delete('/parks/:parkId', TokenMiddleware, (req,  res) => {
  res.status(501).json({error: 'Not implemented'});
});




/* USER ROUTES */


apiRouter.get('/users/current/parks', TokenMiddleware, (req,  res) => {
  res.status(501).json({error: 'Not implemented'});
});

apiRouter.post('/users/login', (req,  res) => {
  if (req.body.username && req.body.password) {
    UserDAO.getUserByCredentials(req.body.username, req.body.password).then((user) => {
      generateToken(req, res, user);
      res.json({user: user});
    }).catch(error => {
      res.status(error.code || 500).json({error: error.message});
    });
  }
  else {
    res.status(400).json({error: 'Credentials not provided'});
  }
});

apiRouter.post('/users/logout', (req,  res) => {
  removeToken(req, res);
  res.json({success: true});
});

apiRouter.get('/users/current', TokenMiddleware, (req,  res) => {
  res.json(req.user);
});

module.exports = apiRouter;
