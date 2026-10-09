const express = require("express");
const authMiddleware = require("../middleware/auth");
const { getAllPermissions } = require("../controllers/permissionController");

const router = express.Router();

// addPermission is done by hand (see scripts/seedPermissions.js)
router.get("/", authMiddleware, getAllPermissions);

module.exports = router;
