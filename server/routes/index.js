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
const ratingRouter = require('./ratingRouter');
const bVariantRouter = require('./bVariantRouter');
const bTypeRouter = require('./bTypeRouter');
const bAttributeRouter = require('./bAttributeRouter');
const bAttributeValRouter = require('./bAttributeValRouter');
const bAttributeValImgRouter = require('./bAttributeValImgRouter');
const bCheckoutRouter = require('./bCheckoutRouter');
const adminOrderRouter = require('./adminOrderRouter');



router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/color', colorRouter)
router.use('/item', itemRouter)
router.use('/gitem', gitemRouter)
router.use('/cart_item', cartItemRouter)
router.use('/shipping', shippingRouter)
router.use('/checkout', checkoutRouter)
router.use('/rating', ratingRouter)
router.use('/bvariant', bVariantRouter);
router.use('/btype', bTypeRouter);
router.use('/battribute', bAttributeRouter);
router.use('/battributeval', bAttributeValRouter);
router.use('/battributevalimg', bAttributeValImgRouter);
router.use('/bcheckout', bCheckoutRouter);
router.use('/admin/orders', adminOrderRouter);

module.exports = router