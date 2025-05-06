const { BAttribute, BVariant, BAttributeVariant } = require("../models/models");
const ApiError = require("../error/ApiError");

class BAttributeController {
  async create(req, res, next) {
    try {
      const { name, variantIds, renderRole } = req.body;
  
      if (!Array.isArray(variantIds) || variantIds.length === 0) {
        return next(ApiError.badRequest("Нужно указать хотя бы одну форму"));
      }
  
      // Создаём сам атрибут с учётом роли
      const attr = await BAttribute.create({ name, renderRole });
  
      // Создаём вручную связи в промежуточной таблице
      const links = variantIds.map((variantId) => ({
        bAttributeId: attr.id,
        bVariantId: variantId
      }));
  
      await BAttributeVariant.bulkCreate(links);
  
      return res.json(attr);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  

  async getAll(req, res) {
    const attrs = await BAttribute.findAll();
    return res.json(attrs);
  }

  async getByVariant(req, res) {
    const { variantId } = req.params;
    const variant = await BVariant.findByPk(variantId, {
      include: [{ model: BAttribute }]
    });
    return res.json(variant.b_attributes);
  }
}

module.exports = new BAttributeController();
