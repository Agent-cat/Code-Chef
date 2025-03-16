const Student = require("../models/students.model");
const User = require("../models/user.model");


const addStudentToCounselor = async (req, res) => {
    try {
        const counselorId = req.user.id;
        const { codechefId, studentId, studentName } = req.body;

        if (!codechefId || !studentId || !studentName) {
            return res.status(400).json({
                message: "Please provide all required fields: codechefId, studentId, and studentName"
            });
        }

        const existingStudent = await Student.findOne({ studentId });
        if (existingStudent) {
            return res.status(400).json({
                message: "Student with this ID already exists"
            });
        }

        const newStudent = await Student.create({
            codechefId,
            studentId,
            studentName,
            counselorName: counselorId
        });


        await User.findByIdAndUpdate(
            counselorId,
            { $push: { counselingStudents: newStudent._id } },
            { new: true }
        );

        res.status(201).json({
            message: "Student added successfully",
            student: newStudent
        });

    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({
            message: "Error adding student to counselor",
            error: error.message
        });
    }
};

module.exports = {
    addStudentToCounselor,

};
