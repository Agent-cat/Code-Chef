const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const { getAdminStats, getAllUsers, updateUser } = require("../controllers/admin.controller");

// Stats route - accessible to both Dean and HOD
router.get("/stats", authMiddleware, roleMiddleware(["Dean", "HOD"]), getAdminStats);

// User management routes - accessible only to Dean
router.get("/users", authMiddleware, roleMiddleware(["Dean"]), getAllUsers);
router.put("/users/:id", authMiddleware, roleMiddleware(["Dean"]), updateUser);

module.exports = router; 