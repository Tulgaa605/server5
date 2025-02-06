const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");
const upload = require("../middleware/multer");

const router = express.Router();

// Define the routes
router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.post("/products", upload.array("file"), createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

module.exports = router;
