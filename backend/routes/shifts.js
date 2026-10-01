const express = require("express");
const Shift = require("../models/Shift");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

function calculateHours(start, end) {
  const [startHour, startMin] = start.split(":").map(Number);
  const [endHour, endMin] = end.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMin;
  const endTotalMinutes = endHour * 60 + endMin;

  const diffMinutes = endTotalMinutes - startTotalMinutes;
  return diffMinutes / 60;
}

router.get("/", authMiddleware, async (req, res) => {
  try {
    const shifts = await Shift.find({ worker: req.userId });
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:slug", authMiddleware, async (req, res) => {
  try {
    const shift = await Shift.findOne({ worker: req.userId, slug: req.params.slug });

    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    res.status(200).json(shift);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { date, startTime, endTime, hourlyWage, workplace, slug, comments } = req.body;

    const existingShift = await Shift.findOne({ worker: req.userId, slug });
    if (existingShift) {
      return res.status(400).json({ message: "This slug is already taken. Please choose another one." });
    }

    const hoursWorked = calculateHours(startTime, endTime);
    if (hoursWorked <= 0) {
      return res.status(400).json({ message: "End time must be after start time." });
    }

    const totalEarning = hoursWorked * parseFloat(hourlyWage);

    const shift = new Shift({
      worker: req.userId,
      date,
      startTime,
      endTime,
      hourlyWage,
      workplace,
      slug,
      comments,
      totalEarning,
    });

    await shift.save();
    res.status(201).json(shift);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:slug", authMiddleware, async (req, res) => {
  try {
    const { date, startTime, endTime, hourlyWage, workplace, slug, comments } = req.body;

    const shiftToEdit = await Shift.findOne({ worker: req.userId, slug: req.params.slug });
    if (!shiftToEdit) {
      return res.status(404).json({ message: "Shift not found" });
    }

    if (slug !== shiftToEdit.slug) {
      const existingShift = await Shift.findOne({ worker: req.userId, slug });
      if (existingShift) {
        return res.status(400).json({ message: "This slug is already taken. Please choose another one." });
      }
    }

    const hoursWorked = calculateHours(startTime, endTime);
    if (hoursWorked <= 0) {
      return res.status(400).json({ message: "End time must be after start time." });
    }

    const totalEarning = hoursWorked * parseFloat(hourlyWage);

    shiftToEdit.date = date;
    shiftToEdit.startTime = startTime;
    shiftToEdit.endTime = endTime;
    shiftToEdit.hourlyWage = hourlyWage;
    shiftToEdit.workplace = workplace;
    shiftToEdit.slug = slug;
    shiftToEdit.comments = comments;
    shiftToEdit.totalEarning = totalEarning;

    await shiftToEdit.save();
    res.status(200).json(shiftToEdit);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
