const { BCheckout, BCheckoutItem, User, Shipping } = require("../models/models");
const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require('form-data'); 

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

class BCheckoutController {
  async create(req, res, next) {
    try {
      const { name, phone, tg, address, price, shippingId, json } = req.body;

      if (!name || !phone || !address || !price || !shippingId || !json) {
        return next(ApiError.badRequest("Не все обязательные поля заполнены"));
      }

      const token = req.headers.authorization.split(' ')[1];
      const userId = jwt.verify(token, process.env.SECRET_KEY).id;

      // Создание записи в таблице заказов
      const checkout = await BCheckout.create({
        name,
        phone,
        tg,
        address,
        price,
        shippingId,
        userId,
        cartId: null
      });

      // Создание записи с JSON состояния конструктора
      const checkoutItem = await BCheckoutItem.create({
        bCheckoutId: checkout.id,
        json
      });

      // Получение дополнительных данных
      const user = await User.findByPk(userId);
      const shipping = await Shipping.findByPk(shippingId);

      // Формирование сообщения
      let message = `🧩 Новый заказ из конструктора №${checkout.id}\n\n`;
      message += `👤 Покупатель: ${name}\n`;
      message += `📧 Email: ${user.email}\n`;
      message += `📞 Телефон: ${phone}\n`;
      message += `✈️ Telegram: ${tg}\n`;
      message += `🏡 Адрес: ${address}\n`;
      message += `🚚 Способ доставки: ${shipping?.name || 'Не указан'}\n`;
      message += `\n💰 Итого: ${price} руб.\n`;

    
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

      return res.json({
        success: true,
        bCheckoutId: checkout.id,
        itemId: checkoutItem.id
      });

    } catch (e) {
      console.error("Ошибка при создании конструктора-заказа:", e);
      return next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new BCheckoutController();
