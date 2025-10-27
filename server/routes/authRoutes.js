const express = require("express");
const authController = require("../controllers/authController");
const passport = require("passport");
const {
  googleCallback,
  facebookCallback,
} = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();
const upload = require("../middlewares/upload");

router.post("/loginUser", authController.login);
router.post("/createUser", authController.register);
router.post("/logoutUser", authController.logout);
// Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login-failed" }),
  googleCallback
);

// Facebook login
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["profile", "email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login-failed" }),
  facebookCallback
);

router.get("/me", authMiddleware, authController.getUserInfo);
router.put(
  "/update",
  authMiddleware,
  upload.single("avatarFile"),
  authController.updateProfile
);

router.post("/forgot-password", authController.forgotPassword);

router.put("/reset-password", authController.resetPassword);

// router.put();

module.exports = router;
