const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const upload = require("../middleware/multer");

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {category: true},
      orderBy: [{name: "asc"}, {id: "asc"}],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({error: "Бүтээгдэхүүн татахад алдаа гарлаа!"});
  }
};

// Get a product by id
const getProductById = async (req, res) => {
  const {id} = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: {id: Number(id)},
      include: {category: true},
    });
    if (!product)
      return res.status(404).json({error: "Бүтээгдэхүүн олдсонгүй!"});
    res.json(product);
  } catch (error) {
    res.status(500).json({error: "Алдаа гарлаа!"});
  }
};

// Create a new product
// Бүтээгдэхүүн үүсгэх
const createProduct = async (req, res) => {
  const {name, description, price, color, stock, categoryId} = req.body;

  // Зургийн файлуудыг хүлээн авах
  const imageURLs = req.files
    ? req.files.map((file) => "/file/" + file.filename)
    : [];

  try {
    // Category-г шалгах
    const category = await prisma.category.findUnique({
      where: {id: Number(categoryId)},
    });

    if (!category) {
      return res.status(404).json({error: "Category олдсонгүй!"});
    }

    // Бүтээгдэхүүн үүсгэх
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        color: color || "#FFFFFF",
        stock: parseInt(stock) || 0,
        category: {connect: {id: Number(categoryId)}},
      },
    });

    // Зургуудыг "Image" хүснэгтэд нэмэх
    if (imageURLs.length > 0) {
      try {
        await prisma.image.createMany({
          data: imageURLs.map((url) => ({
            imageURL: url,
            productId: product.id, // Бүтээгдэхүүний ID-г холбоно
          })),
        });
      } catch (error) {
        console.log("Зураг нэмэхэд алдаа гарлаа:", error);
        return res.status(500).json({ error: "Зургуудыг нэмэхэд алдаа гарлаа!" });
      }
    }

    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Бүтээгдэхүүн нэмэхэд алдаа гарлаа!"});
  }
};

// Update an existing product
const updateProduct = async (req, res) => {
  const {id} = req.params;
  const {name, description, price, color, imageURL, stock, categoryId} =
    req.body;
  try {
    const updatedProduct = await prisma.product.update({
      where: {id: Number(id)},
      data: {
        name,
        description,
        price: parseFloat(price),
        color,
        imageURL,
        stock,
        category: {connect: {id: Number(categoryId)}},
      },
    });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({error: "Шинэчлэхэд алдаа гарлаа!"});
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  const {id} = req.params;
  try {
    await prisma.product.delete({
      where: {id: Number(id)},
    });
    res.json({message: "Амжилттай устгагдлаа!"});
  } catch (error) {
    res.status(500).json({error: "Устгахад алдаа гарлаа!"});
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
