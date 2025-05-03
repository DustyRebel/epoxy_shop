const Router = require("express");
const router = new Router();
const bVariantController = require("../controllers/bVariantController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), bVariantController.create);
router.get("/", bVariantController.getAll);
router.patch('/:id/availability', checkRole("ADMIN"), bVariantController.updateAvailability);
router.get('/all', checkRole("ADMIN"), bVariantController.getAllUnfiltered);

module.exports = router;
