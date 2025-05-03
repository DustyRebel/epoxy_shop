const Router = require("express");
const router = new Router();
const controller = require("../controllers/bAttributeValController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), controller.create);
router.get("/all", controller.getAll);
router.get("/by-attribute/:attributeId", controller.getByAttribute);
router.patch('/:id/availability', checkRole("ADMIN"), controller.updateAvailability);


module.exports = router;
