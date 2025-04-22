const Router = require('express')
const router = new Router()
const gitemController = require('../controllers/gitemController')
const checkRole = require('../middleware/checkRoleMiddleware')


router.post('/', checkRole('ADMIN'), gitemController.create)

router.get('/', gitemController.getAll)

router.get('/:id', gitemController.getOne)

router.delete('/:id', checkRole('ADMIN'), gitemController.delete)

module.exports = router