const { BAttributeValImg } = require("../models/models");
const uuid = require("uuid");
const path = require("path");
const ApiError = require("../error/ApiError");

class BAttributeValImgController {
    async create(req, res, next) {
        try {
            const { attributeValId, view } = req.body;
            const { img } = req.files;

            if (!attributeValId || !view || !img) {
                return next(ApiError.badRequest("Недостаточно данных"));
            }

            const fileName = uuid.v4() + ".png";
            await img.mv(path.resolve(__dirname, "..", "static", fileName));

            const created = await BAttributeValImg.create({
                link: fileName,
                view,
                bAttributeValId: attributeValId
            });

            return res.json(created);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getByVal(req, res) {
        const { attributeValId } = req.params;
        const imgs = await BAttributeValImg.findAll({ where: { bAttributeValId: attributeValId } });
        return res.json(imgs);
    }
}

module.exports = new BAttributeValImgController();
