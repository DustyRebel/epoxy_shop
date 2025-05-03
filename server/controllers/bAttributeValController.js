const { BAttributeVal, BAttributeValImg, BAttribute } = require("../models/models");
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
        const values = await BAttributeVal.findAll({
          where: { bAttributeId: attributeId, availability: true },
          include: [{ model: BAttributeValImg }]
        });
        return res.json(values);
      }

    async updateAvailability(req, res, next) {
      try {
        const { id } = req.params;
        const { availability } = req.body;
      
        const value = await BAttributeVal.findByPk(id);
        if (!value) return next(ApiError.notFound("Значение не найдено"));
      
        value.availability = availability;
        await value.save();
      
        return res.json(value);
      } catch (e) {
        next(ApiError.badRequest(e.message));
      }
      }

    async getAll(req, res) {
      const vals = await BAttributeVal.findAll({
        include: [
          { model: BAttributeValImg },
          { model: BAttribute } 
        ],
        order: [['id', 'ASC']]
      });
      return res.json(vals);
    }

      
}

module.exports = new BAttributeValController();
