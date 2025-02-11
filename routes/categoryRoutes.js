const express = require("express");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/categoryController");

const router = express.Router();

router.get("/categories", getCategories);
router.get("/:id", getCategories);
router.get("/:id/:name", getCategories);

router.post("/", createCategory);

router.put("/:identifier", updateCategory);
router.delete("/:identifier", deleteCategory);

module.exports = router;
