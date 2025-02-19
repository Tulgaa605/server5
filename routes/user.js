const express = require("express");
const router = express.Router();
const {createUser, loginUser, recover} = require("../controller/userController");

router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/recover", recover);

module.exports = router;
