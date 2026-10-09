const express = require("express");
const authMiddleware = require("../middleware/auth");
const { adminMiddleware } = require("../middleware/auth");
const {
  getAllComments,
  getAllUserComments,
  getCommentById,
  createComment,
  updateCommentById,
  deleteComment,
} = require("../controllers/commentController");

const router = express.Router();

// "/user/:userId" must be defined before "/:id"
router.get("/", authMiddleware, adminMiddleware, getAllComments);
router.get("/user/:userId", authMiddleware, getAllUserComments);
router.get("/:id", authMiddleware, getCommentById);
router.post("/", authMiddleware, createComment);
router.patch("/:id", authMiddleware, updateCommentById);
router.delete("/:id", authMiddleware, adminMiddleware, deleteComment);

module.exports = router;
