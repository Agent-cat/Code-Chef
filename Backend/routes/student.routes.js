const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
    addStudentToCounselor,
    getStudents,
    deleteStudent,
    updateStudent
} = require("../controllers/student.controller");

router.get("/", authMiddleware, getStudents);
router.post("/add-student", authMiddleware, addStudentToCounselor);
router.delete("/:id", authMiddleware, deleteStudent);
router.put("/:id", authMiddleware, updateStudent);

module.exports = router;
