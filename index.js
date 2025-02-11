const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const User = require("./routes/user");
const categoryRoutes = require("./routes/categoryRoutes");
const product = require("./routes/productRoutes");
const cors = require("cors")

app.use(cors())
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "file")));

app.use("/user", User);
app.use("/categories", categoryRoutes);
app.use("/products", product);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
