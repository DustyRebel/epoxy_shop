const uuid = require('uuid')
const path = require('path')
const {Item, ItemInfo, ShopImg} = require('../models/models')
const ApiError = require('../error/ApiError')
const { title } = require('process')

class ItemController{

    async create(req, res, next) {
    try {
        const { name, price, colorId, typeId, info } = req.body
        const { img } = req.files

        const item = await Item.create({ name, price, colorId, typeId })

        // обработка изображений
        const images = Array.isArray(img) ? img : [img]
        for (const file of images) {
            let fileName = uuid.v4() + ".jpg"
            await file.mv(path.resolve(__dirname, '..', 'static', fileName))
            await ShopImg.create({ itemId: item.id, link: fileName })
        }

        // обработка info
        if (info) {
            const parsedInfo = JSON.parse(info)
            for (const i of parsedInfo) {
                await ItemInfo.create({
                    title: i.title,
                    description: i.description,
                    itemId: item.id
                })
            }
        }

        return res.json(item)
    } catch (e) {
        next(ApiError.badRequest(e.message))
    }
}

    async getAll(req, res) {
        let {colorId, typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let items;

        const commonOptions = {
            limit,
            offset,
            include: [{ model: ShopImg }],
            distinct: true  // ← вот это ключ!
        }

        if (!colorId && !typeId) {
            items = await Item.findAndCountAll(commonOptions)
        }
    
        if (colorId && !typeId) {
            items = await Item.findAndCountAll({
                ...commonOptions,
                where: { colorId }
            })
        }
    
        if (!colorId && typeId) {
            items = await Item.findAndCountAll({
                ...commonOptions,
                where: { typeId }
            })
        }
    
        if (colorId && typeId) {
            items = await Item.findAndCountAll({
                ...commonOptions,
                where: { colorId, typeId }
            })
        }
    
        return res.json(items)
    }

    async getOne(req, res) {
        const {id} = req.params
        const item = await Item.findOne({
            where: {id},
            include: [
                { model: ItemInfo, as: 'info' },
                { model: ShopImg, as: 'shop_imgs' }
            ]
            
        },
    )
    return res.json(item)
    }

    async delete(req, res, next){
        try {
            const {id} = req.params
            await ShopImg.destroy({ where: { itemId: id } })
            await ItemInfo.destroy({ where: { itemId: id } });
            const deleted = await Item.destroy({ where: { id } })
            if (!deleted){ //if (!deleted || deletedInfo){
                return next(ApiError.internal('Товар с таким id не существует'))
            }

            return res.json({message: `Товар с id ${id} удален`})

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ItemController()