require("dotenv").config();
require("./strategies/googlee");
require("./strategies/facebook");

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const { authMiddleware, requireRole } = require("./middlewares/authMiddleware");

const productRoutes = require("./routes/productRoutes");
const productRoutesC = require("./routes/productRoutesC");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reportRoutes = require("./routes/reportRoutes");
const contactRoutes = require("./routes/contactRoutes");
const orderRoutesAdmin = require("./routes/orderRoutesAdmin");

const app = express();

// ⚠️ Bật CORS TRƯỚC tất cả middleware khác
app.use(
  cors({
    origin: [
      "https://ecommerce-deploy-73ifrv36n-dinhs-projects-e150df4e.vercel.app",
      "https://ecommerce-deploy-virid.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ⚙️ Cấu hình session — cần thiết nếu dùng passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // bật true khi deploy HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// 🧩 Các route
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

// 🧠 Kiểm tra server
app.get("/", (req, res) => {
  res.send("✅ Backend is running on Render!");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
