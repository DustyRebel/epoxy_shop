const Router = require("express");
const router = new Router();
const controller = require("../controllers/bAttributeController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), controller.create);
router.get("/", controller.getAll);
router.get("/by-variant/:variantId", controller.getByVariant); // для конструктора

module.exports = router;
