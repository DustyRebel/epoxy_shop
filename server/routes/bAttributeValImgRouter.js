const Router = require("express");
const router = new Router();
const controller = require("../controllers/bAttributeValImgController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), controller.create);
router.get("/:attributeValId", controller.getByVal);

module.exports = router;
