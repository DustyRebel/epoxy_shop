const Router = require('express');
const router = new Router();
const cartItemController = require('../controllers/cartItemController');
const checkAuth = require('../middleware/authMiddleware');

// Добавить товар в корзину пользователя
router.post('/', checkAuth, cartItemController.create);

// Получить все товары в корзине пользователя
router.get('/', checkAuth, cartItemController.getAll);

// Получить конкретную запись cartItem по id
router.get('/:id', checkAuth, cartItemController.getOne);

// Удалить товар из корзины (по id записи cartItem)
router.delete('/:id', checkAuth, cartItemController.delete);

module.exports = router;
