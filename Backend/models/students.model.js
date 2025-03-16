const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    codechefId: {
        type: String,
        required: "CodeChef is required"
    },
    studentId: {
        type: String,
        required: "StudentId is required",
        unique: true
    },
    studentName: {
        type: String,
        required: "StudentName is required"
    },
    counselorName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",

    },

}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;