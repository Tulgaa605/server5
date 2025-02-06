const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Хавтас үүсгэх (хэрэв байхгүй бол)
const uploadDir = "./file";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {recursive: true});
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Тохиромжтой зам
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Дахин нэрлэх
  },
});

const file = multer({storage: storage});

module.exports = file;