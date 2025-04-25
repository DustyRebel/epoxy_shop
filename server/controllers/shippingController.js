const { Shipping } = require('../models/models');

class ShippingController {
    async getAll(req, res) {
        const shippings = await Shipping.findAll();
        return res.json(shippings);
    }
}

module.exports = new ShippingController();
