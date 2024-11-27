const express = require('express');
const router = express.Router();
const APIRoutes = require('./api/APIRoutes');

const frontendRouter = require('./frontend/FrontendRoutes');
router.use(frontendRouter);

router.use('/api', APIRoutes);

module.exports = router;