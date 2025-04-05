const User = require("../models/user.model");
const Student = require("../models/students.model");

const getAdminStats = async (req, res) => {
  try {
    const totalCounselors = await User.countDocuments({ role: "counselor" });
    const totalStudents = await Student.countDocuments();
    
    const activeContests = 5; 

    res.json({
      totalCounselors,
      totalStudents,
      activeContests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -counselingStudents");
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, counselorId, role } = req.body;

   
    if (!["Dean", "HOD", "counselor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, counselorId, role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUser
}; 