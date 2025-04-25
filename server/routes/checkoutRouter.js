const Router = require('express');
const router = new Router();
const checkoutController = require('../controllers/checkoutController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, checkoutController.create);

module.exports = router;
