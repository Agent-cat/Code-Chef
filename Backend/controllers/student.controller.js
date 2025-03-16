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

const getStudents = async (req, res) => {
    try {
        const counselorId = req.user.id;
        const students = await Student.find({ counselorName: counselorId });
        res.json({ students });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({
            message: "Error fetching students",
            error: error.message
        });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const counselorId = req.user.id;
        const studentId = req.params.id;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        if (student.counselorName.toString() !== counselorId) {
            return res.status(403).json({ message: "Not authorized to delete this student" });
        }

        await Student.findByIdAndDelete(studentId);


        await User.findByIdAndUpdate(
            counselorId,
            { $pull: { counselingStudents: studentId } }
        );

        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({
            message: "Error deleting student",
            error: error.message
        });
    }
};

const updateStudent = async (req, res) => {
    try {
        const counselorId = req.user.id;
        const studentId = req.params.id;
        const { codechefId, studentId: newStudentId, studentName } = req.body;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        if (student.counselorName.toString() !== counselorId) {
            return res.status(403).json({ message: "Not authorized to update this student" });
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            { codechefId, studentId: newStudentId, studentName },
            { new: true }
        );

        res.json({
            message: "Student updated successfully",
            student: updatedStudent
        });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({
            message: "Error updating student",
            error: error.message
        });
    }
};

module.exports = {
    addStudentToCounselor,
    getStudents,
    deleteStudent,
    updateStudent
};
