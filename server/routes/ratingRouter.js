const Router = require('express');
const router = new Router();
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, ratingController.create);  // оставить отзыв
router.get('/', ratingController.getAll);                   // получить отзывы по itemId
router.get('/user', authMiddleware, ratingController.getUserRating); // Получение отзыва пользователя по товару
router.put('/:id', authMiddleware, ratingController.update); // Обновление отзыва
router.delete('/:id', authMiddleware, ratingController.delete); // Обновление отзыва

module.exports = router;
