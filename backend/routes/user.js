const express = require("express");
const authMiddleware = require("../middleware/auth");
const { adminMiddleware } = require("../middleware/auth");
const {
  getAllUsers,
  getMe,
  getUserById,
  updateMe,
  updateUserById,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// "/me" routes must be defined before "/:id"
router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.get("/me", authMiddleware, getMe);
router.patch("/me", authMiddleware, updateMe);
router.get("/:id", authMiddleware, adminMiddleware, getUserById);
router.patch("/:id", authMiddleware, adminMiddleware, updateUserById);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

module.exports = router;
