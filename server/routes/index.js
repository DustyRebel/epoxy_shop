const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const colorRouter = require('./colorRouter')
const typeRouter = require('./typeRouter')
const gitemRouter = require('./gitemRouter')
const itemRouter = require('./itemRouter')
const cartItemRouter = require('./cartItemRouter')
const shippingRouter = require('./shippingRouter');
const checkoutRouter = require('./checkoutRouter');


router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/color', colorRouter)
router.use('/item', itemRouter)
router.use('/gitem', gitemRouter)
router.use('/cart_item', cartItemRouter)
router.use('/shipping', shippingRouter)
router.use('/checkout', checkoutRouter)


module.exports = router