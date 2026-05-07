const router = require("express").Router();
const { getServices, applyService } = require("../controllers/serviceController");

router.get("/", getServices);
router.post("/apply", applyService);

module.exports = router;
    