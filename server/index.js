require("dotenv").config();
require("./strategies/googlee");
require("./strategies/facebook");
const cookieParser = require("cookie-parser");

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

const productRoutes = require("./routes/productRoutes");
const productRoutesC = require("./routes/productRoutesC");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reportRoutes = require("./routes/reportRoutes");
const contactRoutes = require("./routes/contactRoutes");
const orderRoutesAdmin = require("./routes/orderRoutesAdmin");
const { authMiddleware, requireRole } = require("./middlewares/authMiddleware");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // frontend React
    credentials: true, // cho phép gửi cookie
  })
);
app.use(cookieParser());
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use("/api/products", productRoutesC);
app.use("/auth/user", authRoutes);

app.use("/api/admin", authMiddleware, requireRole("ADMIN"));
app.use("/api/admin/products", productRoutes);
app.use("/api/admin/users", userRoutes);
app.use("/api/admin/orders", orderRoutesAdmin);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/report", reportRoutes);
app.use("/api/contact", contactRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server chạy http://localhost:${PORT}`));
