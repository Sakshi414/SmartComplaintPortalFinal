const express = require("express");
const router = express.Router();
const adminAuth = require("../../middleware/adminAuth");
const ctrl = require("../../controllers/admin/adminUserController");

router.get("/users", adminAuth, ctrl.getUsers);
router.delete("/users/:id", adminAuth, ctrl.deleteUser);

module.exports = router;