const express = require("express");
const adminController = require("../controller/adminPanel");

const router = express.Router();

router.post("/register", adminController.registerAdmin);
router.post("/login", adminController.loginAdmin);
router.get("/list", adminController.authenticateAdmin, adminController.getAdminList);
router.delete("/:id", adminController.authenticateAdmin, adminController.deleteAdmin);

module.exports = router;
