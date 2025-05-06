const {
    Checkout,
    CheckoutItem,
    BCheckout,
    BCheckoutItem,
    Shipping,
    Item,
    User
  } = require('../models/models');
  const ApiError = require('../error/ApiError');
  
  class AdminOrderController {
    async getAllOrders(req, res, next) {
      try {
        const orders = await Checkout.findAll({
          where: { done: false },
          include: [
            { model: Shipping },
            { model: User },
            {
              model: CheckoutItem,
              include: [Item]
            }
          ],
          order: [['createdAt', 'DESC']]
        });
        return res.json(orders);
      } catch (e) {
        return next(ApiError.badRequest(e.message));
      }
    }
  
    async getAllConstructorOrders(req, res, next) {
        try {
          const orders = await BCheckout.findAll({
            where: { done: false },
            include: [
              { model: BCheckoutItem },
              { model: User },
              { model: Shipping }
            ],
            order: [['createdAt', 'DESC']]
          });
          return res.json(orders);
        } catch (e) {
          return next(ApiError.badRequest(e.message));
        }
      }
      
  
    async markDone(req, res, next) {
      try {
        const { id } = req.params;
        const order = await Checkout.findByPk(id);
        if (!order) return next(ApiError.notFound("Заказ не найден"));
  
        order.done = true;
        await order.save();
        return res.json({ success: true });
      } catch (e) {
        return next(ApiError.badRequest(e.message));
      }
    }
  
    async markBCheckoutDone(req, res, next) {
      try {
        const { id } = req.params;
        const order = await BCheckout.findByPk(id);
        if (!order) return next(ApiError.notFound("Конструктор-заказ не найден"));
  
        order.done = true;
        await order.save();
        return res.json({ success: true });
      } catch (e) {
        return next(ApiError.badRequest(e.message));
      }
    }
  }
  
  module.exports = new AdminOrderController();
  