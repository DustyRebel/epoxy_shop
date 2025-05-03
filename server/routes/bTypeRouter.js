const Router = require('express');
const router = new Router();
const bTypeController = require('../controllers/bTypeController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', checkRole('ADMIN'), bTypeController.create);
router.get('/', bTypeController.getAll);

module.exports = router;
