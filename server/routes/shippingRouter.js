const Router = require('express');
const router = new Router();
const shippingController = require('../controllers/shippingController');

router.get('/', shippingController.getAll);

module.exports = router;
