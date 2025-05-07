const uuid = require('uuid')
const path = require('path')
const {GalleryItem, GalleryImg} = require('../models/models')
const ApiError = require('../error/ApiError')
const { title } = require('process')

class GItemController{

    async create(req, res, next) {
    try {
        const { name, description, typeId, colorId } = req.body
        const { img } = req.files

        const gallery_item = await GalleryItem.create({ name, description, typeId, colorId })

        // обработка изображений
        const images = Array.isArray(img) ? img : [img]
        for (const file of images) {
            let fileName = uuid.v4() + ".jpg"
            await file.mv(path.resolve(__dirname, '..', 'static', fileName))
            await GalleryImg.create({ galleryItemId: gallery_item.id, link: fileName })
        }

        return res.json(gallery_item)
    } catch (e) {
        next(ApiError.badRequest(e.message))
    }
}

    async getAll(req, res) {
        let {colorId, typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let gallery_items;

        const commonOptions = {
            limit,
            offset,
            include: [{ model: GalleryImg }],
            distinct: true  
        }

        if (!colorId && !typeId) {
            gallery_items = await GalleryItem.findAndCountAll(commonOptions)
        }
    
        if (colorId && !typeId) {
            gallery_items = await GalleryItem.findAndCountAll({
                ...commonOptions,
                where: { colorId }
            })
        }
    
        if (!colorId && typeId) {
            gallery_items = await GalleryItem.findAndCountAll({
                ...commonOptions,
                where: { typeId }
            })
        }
    
        if (colorId && typeId) {
            gallery_items = await GalleryItem.findAndCountAll({
                ...commonOptions,
                where: { colorId, typeId }
            })
        }
    
        return res.json(gallery_items)
    }

    async getOne(req, res) {
        const {id} = req.params
        const gallery_item = await GalleryItem.findOne({
            where: {id},
            include: [
                { model: GalleryImg, as: 'gallery_imgs' }
            ]
            
        },
    )
    return res.json(gallery_item)
    }

    async delete(req, res, next){
        try {
            const {id} = req.params
            await GalleryImg.destroy({ where: { galleryItemId: id } })
            const deleted = await GalleryItem.destroy({ where: { id } })
            if (!deleted){ 
                return next(ApiError.internal('Товар с таким id не существует'))
            }

            return res.json({message: `Товар с id ${id} удален`})

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async toggleAvailability(req, res, next) {
        try {
            const { id } = req.params;
            const { availability } = req.body;
            const item = await GalleryItem.findByPk(id);
            if (!item) return next(ApiError.internal('Галерейный предмет не найден'));
            item.availability = availability;
            await item.save();
            return res.json(item);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async findByName(req, res, next) {
        try {
          const { name } = req.params;
          const item = await GalleryItem.findOne({ where: { name } });
          if (!item) {
            return next(ApiError.internal('Предмет галереи с таким названием не найден'));
          }
          return res.json(item);
        } catch (e) {
          return next(ApiError.badRequest(e.message));
        }
      }
    
}

module.exports = new GItemController()