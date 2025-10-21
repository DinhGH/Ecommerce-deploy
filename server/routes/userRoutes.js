const express = require("express");
const userController = require("../controllers/userController");
const upload = require("../middlewares/upload");

const router = express.Router();

// GET users?page=1&limit=10
router.get("/", userController.getAllUsers);

// POST new user (multipart/form-data)
router.post("/", upload.single("avatar"), userController.createNewUser);

// // PUT update user
router.put("/:id", upload.single("avatar"), userController.updateUserById);

// // DELETE
router.delete("/:id", userController.deleteUserById);

module.exports = router;
