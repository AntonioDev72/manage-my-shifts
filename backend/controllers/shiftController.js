const mongoose = require("mongoose");
const Shift = require("../models/Shift");
const { isAdmin } = require("../middleware/auth");

function calculateHours(start, end) {
  const [startHour, startMin] = start.split(":").map(Number);
  const [endHour, endMin] = end.split(":").map(Number);

  const startTotalMinutes = startHour * 60 + startMin;
  const endTotalMinutes = endHour * 60 + endMin;

  return (endTotalMinutes - startTotalMinutes) / 60;
}

// Admin can access any shift; a worker can only access their own
function canAccess(req, shift) {
  return isAdmin({ role: req.userRole }) || String(shift.worker) === String(req.userId);
}

// GET api/shifts/ - shifts of the logged-in user
const getMyShifts = async (req, res) => {
  try {
    const shifts = await Shift.find({ worker: req.userId });
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET api/shifts/all - getAllShifts (admin only)
const getAllShifts = async (req, res) => {
  try {
    const shifts = await Shift.find().populate("worker", "firstName lastName email");
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET api/shifts/worker/:id - shifts of one worker (admin only)
const getWorkerShifts = async (req, res) => {
  try {
    const shifts = await Shift.find({ worker: req.params.id });
    res.status(200).json(shifts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET api/shifts/:id - getShiftById
const getShiftById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Shift not found" });
    }

    const shift = await Shift.findById(req.params.id);
    if (!shift || !canAccess(req, shift)) {
      return res.status(404).json({ message: "Shift not found" });
    }

    res.status(200).json(shift);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST api/shifts/ - addShift
const addShift = async (req, res) => {
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
};

// PATCH api/shifts/:id - updateShiftById
const updateShiftById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Shift not found" });
    }

    const shift = await Shift.findById(req.params.id);
    if (!shift || !canAccess(req, shift)) {
      return res.status(404).json({ message: "Shift not found" });
    }

    const { date, startTime, endTime, hourlyWage, workplace, slug, comments } = req.body;

    if (slug !== undefined && slug !== shift.slug) {
      const existingShift = await Shift.findOne({ worker: shift.worker, slug });
      if (existingShift) {
        return res.status(400).json({ message: "This slug is already taken. Please choose another one." });
      }
      shift.slug = slug;
    }

    if (date !== undefined) shift.date = date;
    if (startTime !== undefined) shift.startTime = startTime;
    if (endTime !== undefined) shift.endTime = endTime;
    if (hourlyWage !== undefined) shift.hourlyWage = hourlyWage;
    if (workplace !== undefined) shift.workplace = workplace;
    if (comments !== undefined) shift.comments = comments;

    const hoursWorked = calculateHours(shift.startTime, shift.endTime);
    if (hoursWorked <= 0) {
      return res.status(400).json({ message: "End time must be after start time." });
    }
    shift.totalEarning = hoursWorked * parseFloat(shift.hourlyWage);

    await shift.save();
    res.status(200).json(shift);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE api/shifts/:id - deleteShift (admin only)
const deleteShift = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Shift not found" });
    }

    const shift = await Shift.findByIdAndDelete(req.params.id);
    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    res.status(200).json({ message: "Shift deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getMyShifts,
  getAllShifts,
  getWorkerShifts,
  getShiftById,
  addShift,
  updateShiftById,
  deleteShift,
};
