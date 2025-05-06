const path = require("path");
const uuid = require("uuid");
const fs = require("fs");

const { BAttributeVal, BAttributeValImg, BAttribute } = require("../models/models");
const ApiError = require("../error/ApiError");

class BAttributeValController {
  async create(req, res, next) {
    try {
      const { name, price, availability, bAttributeId, hexColor } = req.body;
      let imgFileName = null;

      // Если есть изображение-превью
      if (req.files && req.files.previewImg) {
        const file = req.files.previewImg;
        imgFileName = uuid.v4() + path.extname(file.name);
        await file.mv(path.resolve(__dirname, "..", "static", imgFileName));
      }

      const value = await BAttributeVal.create({
        name,
        price,
        availability,
        bAttributeId,
        hexColor,
        img: imgFileName // ← сохраняем путь
      });

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
}

module.exports = new BAttributeValController();
