const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const colorRouter = require('./colorRouter')
const typeRouter = require('./typeRouter')
const gitemRouter = require('./gitemRouter')
const itemRouter = require('./itemRouter')


router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/color', colorRouter)
router.use('/item', itemRouter)
router.use('/gitem', gitemRouter)

module.exports = router