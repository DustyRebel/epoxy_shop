const { Rating, CheckoutItem, Checkout } = require('../models/models');
const ApiError = require('../error/ApiError');

class RatingController {
    async create(req, res, next) {
        try {
            const { itemId, rate, review } = req.body;
            const userId = req.user.id;

            // Проверка: покупал ли пользователь этот товар
            const hasPurchased = await Checkout.findOne({
                where: { userId },
                include: {
                    model: CheckoutItem,
                    where: { itemId }
                }
            });

            if (!hasPurchased) {
                return next(ApiError.forbidden('Вы не можете оставить отзыв на товар, который не покупали'));
            }

            const rating = await Rating.create({ userId, itemId, rate, review });
            return res.json(rating);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res) {
        const { itemId } = req.query;
        const ratings = await Rating.findAll({ where: { itemId } });
        return res.json(ratings);
    }

    async getUserRating(req, res, next) {
        try {
            const { userId, itemId } = req.query;

            const rating = await Rating.findOne({ where: { userId, itemId } });

            return res.json(rating); // если нет, то вернет null
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { rate, review } = req.body;

            const rating = await Rating.findByPk(id);
            if (!rating) {
                return next(ApiError.badRequest('Отзыв не найден'));
            }

            rating.rate = rate;
            rating.review = review;
            await rating.save();

            return res.json(rating);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;

            const rating = await Rating.findByPk(id);
            if (!rating) {
                return next(ApiError.badRequest('Отзыв не найден'));
            }

            await rating.destroy();

            return res.json({ message: 'Отзыв успешно удалён' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new RatingController();
