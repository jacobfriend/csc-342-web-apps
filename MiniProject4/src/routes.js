const express = require('express');
const router = express.Router();

const frontendRouter = require('./frontend/FrontendRoutes');
const apiRouter = require('./api/APIRoutes');

router.use(frontendRouter);

// mounted under the /api base route to avoid
// it colliding with frontend routes or static resources
router.use('/api', apiRouter);

module.exports = router;