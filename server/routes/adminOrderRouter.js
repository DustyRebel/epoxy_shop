const Router = require('express');
const router = new Router();
const adminOrderController = require('../controllers/adminOrderController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require("../middleware/checkRoleMiddleware");

// Только для админов
router.get('/', authMiddleware, checkRole("ADMIN"), adminOrderController.getAllOrders);
router.get('/constructor_orders', authMiddleware, checkRole("ADMIN"), adminOrderController.getAllConstructorOrders);
router.patch('/:id/done', authMiddleware, checkRole("ADMIN"), adminOrderController.markDone);
router.patch('/constructor_orders/:id/done', authMiddleware, checkRole("ADMIN"), adminOrderController.markBCheckoutDone);

module.exports = router;
