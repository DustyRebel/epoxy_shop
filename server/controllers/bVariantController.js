const { BVariant, BVariantImg, BType, BAttribute, BAttributeVariant } = require("../models/models");
const uuid = require("uuid");
const path = require("path");
const ApiError = require("../error/ApiError");

class BVariantController {
    
async create(req, res, next) {
    try {
        const { name, price, availability, bTypeId } = req.body;
        const { imgFront, imgBack, imgSide } = req.files;

        const variant = await BVariant.create({
            name, price, availability, bTypeId, img: "placeholder.jpg"
        });

        const uploadImage = async (file, view) => {
            const fileName = uuid.v4() + ".svg";
            await file.mv(path.resolve(__dirname, "..", "static", fileName));
            await BVariantImg.create({ link: fileName, view, bVariantId: variant.id });
        };

        if (imgFront) await uploadImage(imgFront, "front");
        if (imgBack) await uploadImage(imgBack, "back");
        if (imgSide) await uploadImage(imgSide, "side");

        if (req.body.attributeIds) {
          const attrIds = JSON.parse(req.body.attributeIds); // ← получаем как массив
          const links = attrIds.map((attrId) => ({
            bVariantId: variant.id,
            bAttributeId: attrId
          }));
          await BAttributeVariant.bulkCreate(links);
        }      

        return res.json(variant);
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}

async getAll(req, res) {
  const variants = await BVariant.findAll({
    include: [
      { model: BVariantImg },
      { model: BType } // ← добавили связанный тип
    ]
  });
  return res.json(variants);
}

  async updateAvailability(req, res, next) {
    try {
      const { id } = req.params;
      const { availability } = req.body;
  
      const variant = await BVariant.findByPk(id);
      if (!variant) return next(ApiError.notFound("Форма не найдена"));
  
      variant.availability = availability;
      await variant.save();
  
      return res.json(variant);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAllUnfiltered(req, res) {
    const variants = await BVariant.findAll({
      include: [
        { model: BVariantImg },
        { model: BType } // ← добавляем тип
      ],
      order: [['id', 'ASC']]
    });
    
    return res.json(variants);
  }
}

module.exports = new BVariantController();
