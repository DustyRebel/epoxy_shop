const { Checkout } = require('../models/models');

class CheckoutController {
    async create(req, res) {
        const { name, phone, tg, address, price, cartId, shippingId } = req.body;
        const userId = req.user.id;

        const checkout = await Checkout.create({
            name,
            phone,
            tg,
            address,
            price,
            cartId,
            userId,
            shippingId
        });

        return res.json(checkout);
    }
}

module.exports = new CheckoutController();
