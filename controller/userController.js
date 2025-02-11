const {PrismaClient} = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

exports.createUser = async (req, res) => {
  const {email, password, name, phone} = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    console.error("Error creating user:", err.message);
    res.status(500).json({error: "Error creating user!"});
  }
};

exports.loginUser = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      console.log("Хэрэглэгчийн мэдээлэл олдсонгүй: ", email);
      return res.status(401).json({error: "Хэрэглэгч олдсонгүй!"});
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("Нууц үг буруу: ", email);
      return res.status(401).json({error: "Нууц үг буруу!"});
    }
    const token = jwt.sign(
      {userId: user.id, email: user.email},
      process.env.JWT_SECRET,
      {expiresIn: "1h"}
    );

    res.status(200).json({
      message: "Амжилттай нэвтэрлээ!",
      token,
    });
  } catch (err) {
    console.error("Логинд алдаа гарлаа:", err.message);
    res.status(500).json({error: "Логин хийхэд алдаа гарлаа!"});
  }
};
