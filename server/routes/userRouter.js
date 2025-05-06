const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.get('/:userId', authMiddleware, userController.getUserOrders);
router.get('/constructor/:userId', authMiddleware, userController.getUserConstructorOrders);


module.exports = router