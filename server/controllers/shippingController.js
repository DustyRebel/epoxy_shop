const { Shipping } = require('../models/models');

class ShippingController {
    async getAll(req, res) {
        const shippings = await Shipping.findAll();
        return res.json(shippings);
    }

    async create(req, res) {
        const {name} = req.body
        const shipping = await Shipping.create({name})
        return res.json(shipping)

    }
}

module.exports = new ShippingController();
