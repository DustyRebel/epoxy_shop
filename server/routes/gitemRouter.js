const Router = require('express')
const router = new Router()
const gitemController = require('../controllers/gitemController')
const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', checkRole('ADMIN'), gitemController.create)

router.get('/', gitemController.getAll)

router.get('/:id', gitemController.getOne)

router.delete('/:id', checkRole('ADMIN'), gitemController.delete)

router.patch('/:id/availability', authMiddleware, checkRole("ADMIN"), gitemController.toggleAvailability);

router.get('/name/:name', gitemController.findByName); 


module.exports = router