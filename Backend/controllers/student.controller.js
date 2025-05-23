const Student = require("../models/students.model");
const User = require("../models/user.model");


const addStudentToCounselor = async (req, res) => {
    try {
        const counselorId = req.user.id;
        const { codechefId, studentId, studentName, leetcodeId, codeforcesId } = req.body;

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
            leetcodeId,
            codeforcesId,
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
        const { codechefId, studentId: newStudentId, studentName, leetcodeId, codeforcesId } = req.body;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        if (student.counselorName.toString() !== counselorId) {
            return res.status(403).json({ message: "Not authorized to update this student" });
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            { 
                codechefId, 
                studentId: newStudentId, 
                studentName,
                leetcodeId,
                codeforcesId
            },
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

const batchImportStudents = async (req, res) => {
    try {
        const counselorId = req.user.id;
        const { students } = req.body;

        if (!Array.isArray(students) || students.length === 0) {
            return res.status(400).json({
                message: "Please provide an array of students"
            });
        }

        const results = {
            imported: 0,
            duplicates: 0,
            errors: []
        };

        
        for (const student of students) {
            const { codechefId, studentId, studentName, leetcodeId, codeforcesId } = student;

            if (!codechefId || !studentId || !studentName) {
                results.errors.push({
                    student,
                    error: "Missing required fields"
                });
                continue;
            }

            
            const existingStudent = await Student.findOne({ studentId });
            if (existingStudent) {
                results.duplicates++;
                continue;
            }
           
            const newStudent = await Student.create({
                codechefId,
                studentId,
                studentName,
                leetcodeId,
                codeforcesId,
                counselorName: counselorId
            });

            
            await User.findByIdAndUpdate(
                counselorId,
                { $push: { counselingStudents: newStudent._id } },
                { new: true }
            );

            results.imported++;
        }

        res.status(201).json({
            message: "Batch import completed",
            imported: results.imported,
            duplicates: results.duplicates,
            errors: results.errors.length > 0 ? results.errors : undefined
        });

    } catch (error) {
        console.error("Error in batch import:", error);
        res.status(500).json({
            message: "Error importing students",
            error: error.message
        });
    }
};

const getStudentById = async (req, res) => {
    try {
        const counselorId = req.user.id;
        const studentId = req.params.id;

        const student = await Student.findById(studentId);
        
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        if (student.counselorName.toString() !== counselorId) {
            return res.status(403).json({ message: "Not authorized to view this student" });
        }

        res.json({ student });
    } catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({
            message: "Error fetching student",
            error: error.message
        });
    }
};

module.exports = {
    addStudentToCounselor,
    getStudents,
    deleteStudent,
    updateStudent,
    batchImportStudents,
    getStudentById
};
