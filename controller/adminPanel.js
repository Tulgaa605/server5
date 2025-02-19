const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "Токен байхгүй!" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "ADMIN") {
      return res.status(403).json({ error: "Админ эрх шаардлагатай!" });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Буруу токен!" });
  }
};

exports.registerAdmin = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: "ADMIN",
      },
    });
    res.status(201).json({ message: "Админ амжилттай үүсгэлээ", admin });
  } catch (err) {
    res.status(500).json({ error: "Админ бүртгэхэд алдаа гарлаа" });
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await prisma.user.findUnique({ where: { email } });
    if (!admin || admin.role !== "ADMIN") {
      return res.status(401).json({ error: "Админ олдсонгүй!" });
    }
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ error: "Нууц үг буруу!" });
    }
    const token = jwt.sign({ userId: admin.id, role: "ADMIN" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Амжилттай нэвтэрлээ", token, admin });
  } catch (err) {
    res.status(500).json({ error: "Нэвтрэх явцад алдаа гарлаа" });
  }
};

exports.getAdminList = async (req, res) => {
  try {
    const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: "Админуудын мэдээлэл авахад алдаа гарлаа" });
  }
};

exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Админ устгагдлаа" });
  } catch (err) {
    res.status(500).json({ error: "Админ устгахад алдаа гарлаа" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Хэрэглэгч устгагдлаа" });
  } catch (err) {
    res.status(500).json({ error: "Хэрэглэгч устгахад алдаа гарлаа" });
  } 
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({ where: { id: parseInt(id) } });    
    res.json({ message: "Категори устгагдлаа" });
  } catch (err) {    
    res.status(500).json({ error: "Категори устгахад алдаа гарлаа" });
  }
};

exports.updateGategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name },
    });
    res.json({ message: "Категори шинэчлэгдлээ" });
  } catch (err) {
    res.status(500).json({ error: "Категори шинэчлэхэд алдаа гарлаа" });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, quantity, description, category } = req.body;
  try {
    await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, price, quantity, description, category },
    });
    res.json({ message: "Бүтээгдэхүүн шинэчлэгдлээ" });
  } catch (err) {
    res.status(500).json({ error: "Бүтээгдэхүүн шинэчлэхэд алдаа гарлаа" });
  }
};


exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id: parseInt(id) } });    
    res.json({ message: "Бүтээгдэхүүн устгагдлаа" });
  } catch (err) {    
    res.status(500).json({ error: "Бүтээгдэхүүн устгахад алдаа гарлаа" });
  }
};

exports.authenticateAdmin = authenticateAdmin;
