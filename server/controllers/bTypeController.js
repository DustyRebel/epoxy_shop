const { BType } = require('../models/models');
const ApiError = require('../error/ApiError');

class BTypeController {
    async create(req, res, next) {
        try {
            const { name } = req.body;
            const type = await BType.create({ name });
            return res.json(type);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        const types = await BType.findAll();
        return res.json(types);
    }
}

module.exports = new BTypeController();