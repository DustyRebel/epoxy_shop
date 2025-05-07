const Router = require('express')
const router = new Router()
const itemController = require('../controllers/itemController')
const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware');


router.post('/', checkRole('ADMIN'), itemController.create)

router.get('/', itemController.getAll)

router.get('/:id', itemController.getOne)

router.delete('/:id', authMiddleware, checkRole('ADMIN'), itemController.delete)

router.patch('/:id/availability', authMiddleware, checkRole('ADMIN'), itemController.toggleAvailability);


module.exports = router