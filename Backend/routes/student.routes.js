const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { addStudentToCounselor } = require("../controllers/student.controller");


router.post("/add-student", authMiddleware, addStudentToCounselor);

module.exports = router;
