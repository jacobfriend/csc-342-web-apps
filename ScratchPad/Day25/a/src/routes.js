const express = require('express');
const router = express.Router();

const frontendRouter = require('./frontend/FrontendRoutes');
const websocketRouter = require('./websocket/websocketRoutes');

router.use(frontendRouter);
router.use(websocketRouter);

module.exports = router;