const { Cart, CartItem, Item, ShopImg } = require('../models/models');
const ApiError = require('../error/ApiError');

class CartItemController {
    async create(req, res, next) {
        try {
            const userId = req.user.id;
            const { itemId, quantity } = req.body;

            const cart = await Cart.findOne({ where: { userId } });
            if (!cart) return next(ApiError.internal('Корзина не найдена'));

            const existing = await CartItem.findOne({
                where: { cartId: cart.id, itemId }
            });

            if (existing) {
                existing.quantity += quantity;
                await existing.save();
                return res.json(existing);
            }

            const cartItem = await CartItem.create({
                cartId: cart.id,
                itemId,
                quantity
            });

            return res.json(cartItem);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const userId = req.user.id;
            const cart = await Cart.findOne({ where: { userId } });
            if (!cart) return next(ApiError.internal('Корзина не найдена'));

            const items = await CartItem.findAll({
                where: { cartId: cart.id },
                include: [{
                    model: Item,
                    include: [{ model: ShopImg }],
                order: [['createdAt', 'ASC']]
                }]
            });

            return res.json(items);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const item = await CartItem.findOne({
                where: { id },
                include: [{
                    model: Item,
                    include: [{ model: ShopImg }] // <<< и сюда тоже!
                }]
            });
            if (!item) return next(ApiError.notFound('Товар в корзине не найден'));
            return res.json(item);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await CartItem.destroy({ where: { id } });
            if (!deleted) return next(ApiError.notFound('Товар в корзине не найден'));
            return res.json({ message: 'Товар удален из корзины' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async deleteByCartId(req, res, next) {
        try {
            const { cartId } = req.params;
            const deleted = await CartItem.destroy({ where: { cartId } });
            return res.json({ message: `${deleted} товаров удалено из корзины` });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
    
            const cartItem = await CartItem.findByPk(id);
            if (!cartItem) return next(ApiError.notFound('Товар в корзине не найден'));
    
            cartItem.quantity = quantity;
            await cartItem.save();
    
            return res.json(cartItem);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new CartItemController();
