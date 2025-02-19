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