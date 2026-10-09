const express = require("express");
const authMiddleware = require("../middleware/auth");
const { adminMiddleware } = require("../middleware/auth");
const {
  getMyShifts,
  getAllShifts,
  getWorkerShifts,
  getShiftById,
  addShift,
  updateShiftById,
  deleteShift,
} = require("../controllers/shiftController");

const router = express.Router();

// Fixed paths ("/all", "/worker/:id") must be defined before "/:id"
router.get("/", authMiddleware, getMyShifts);
router.get("/all", authMiddleware, adminMiddleware, getAllShifts);
router.get("/worker/:id", authMiddleware, adminMiddleware, getWorkerShifts);
router.get("/:id", authMiddleware, getShiftById);
router.post("/", authMiddleware, addShift);
router.patch("/:id", authMiddleware, updateShiftById);
router.delete("/:id", authMiddleware, adminMiddleware, deleteShift);

module.exports = router;
