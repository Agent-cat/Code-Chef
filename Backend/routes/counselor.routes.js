const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const Student = require("../models/students.model");

router.get("/counselors", async (req, res) => {
    try {
        const counselors = await User.find({ role: "counselor" }).lean();
        const counselorData = await Promise.all(counselors.map(async (counselor) => {
            const students = await Student.find({ counselorName: counselor._id });
            return {
                ...counselor,
                studentCount: counselor.counselingStudents.length,
                students
            };
        }));
        res.json(counselorData);
    } catch (error) {
        console.error("Error fetching counselors:", error);
        res.status(500).json({ message: "Error fetching counselors", error: error.message });
    }
});

module.exports = router; 