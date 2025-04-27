const { Checkout, CheckoutItem, CartItem, Item, User, Shipping } = require('../models/models');
const ApiError = require('../error/ApiError');
const axios = require('axios');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

class CheckoutController {
    async create(req, res, next) {
        try {
            const { name, phone, tg, address, price, userId, shippingId, cartId } = req.body;
            
            const cartItems = await CartItem.findAll({ where: { cartId }, include: [Item] });
            if (!cartItems.length) {
                return next(ApiError.badRequest('Корзина пуста. Добавьте товары перед оформлением заказа.'));
            }
            
            // Создаем заказ
            const checkout = await Checkout.create({ name, phone, tg, address, price, cartId, userId, shippingId });

            for (const cartItem of cartItems) {
                await CheckoutItem.create({
                    checkoutId: checkout.id,
                    itemId: cartItem.itemId,
                    quantity: cartItem.quantity
                });
            }

            // Очищаем корзину
            await CartItem.destroy({ where: { cartId } });

            // Получаем дополнительные данные
            const user = await User.findOne({ where: { id: userId } });
            const shipping = await Shipping.findOne({ where: { id: shippingId } }); // <-- находим название доставки
            const checkoutItems = await CheckoutItem.findAll({
                where: { checkoutId: checkout.id },
                include: [Item]
            });

            // Формируем сообщение
            let message = `🛒 Новый заказ №${checkout.id}\n\n`;
            message += `👤 Покупатель: ${name}\n`;
            message += `📧 Email: ${user.email}\n`;
            message += `📞 Телефон: ${phone}\n`;
            message += `✈️ Telegram: ${tg}\n`;
            message += `🏡 Адрес: ${address}\n`;
            message += `🚚 Способ доставки: ${shipping.name}\n\n`; // <-- используем shipping.name
            message += `🛍 Товары:\n`;

            checkoutItems.forEach((item, index) => {
                message += `${index + 1}. ${item.item.name} × ${item.quantity}\n`;
            });

            message += `\n💰 Итого: ${price} руб.`;

            // Отправляем сообщение в Telegram
            await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Ответить в Telegram",
                                url: `https://t.me/${tg.replace('@', '')}`
                            }
                        ]
                    ]
                }
            });

            return res.json(checkout);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new CheckoutController();
