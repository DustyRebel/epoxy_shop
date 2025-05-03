const { BAttributeVal, BAttributeValImg } = require("../models/models");
const ApiError = require("../error/ApiError");

class BAttributeValController {
    async create(req, res, next) {
        try {
            const { name, price, availability, bAttributeId, hexColor } = req.body;

            const value = await BAttributeVal.create({
              name,
              price,
              availability,
              bAttributeId,
              hexColor 
            });

            return res.json(value);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        const vals = await BAttributeVal.findAll({
            include: ["b_attribute_val_imgs"] 
        });
        return res.json(vals);
    }

    async getByAttribute(req, res) {
        const { attributeId } = req.params;
        const values = await BAttributeVal.findAll({ where: { bAttributeId: attributeId }, include: [{ model: BAttributeValImg }] });
        return res.json(values);
      }
}

module.exports = new BAttributeValController();
