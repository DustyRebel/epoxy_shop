const { BVariant, BVariantImg, BType } = require("../models/models");
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

        return res.json(variant);
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}

async getAll(req, res) {
    const variants = await BVariant.findAll({
      include: [{ model: BVariantImg }, { model: BType }]
    });
    return res.json(variants);
  }
}

module.exports = new BVariantController();
