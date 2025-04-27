const Router = require('express');
const router = new Router();
const shippingController = require('../controllers/shippingController');
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), shippingController.create);

router.get('/', shippingController.getAll);

module.exports = router;
