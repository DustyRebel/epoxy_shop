const Router = require('express');
const router = new Router();
const bCheckoutController = require('../controllers/bCheckoutController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, bCheckoutController.create);

module.exports = router;
