const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET not configured" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        counselorId: user.counselorId,
        counselingStudents: user.counselingStudents,
        role: user.role
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Signup = async (req, res) => {
  try {
    const { name, email, password, counselorId, role } = req.body;
    
    if (!name || !email || !password || !counselorId) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    
    const existingCounselor = await User.findOne({ counselorId });
    if (existingCounselor) {
      return res.status(400).json({ message: "User with this counselor ID already exists" });
    }

 
    const validRoles = ["Dean", "HOD", "counselor"];
    const userRole = role && validRoles.includes(role) ? role : "counselor";

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      counselorId,
      role: userRole
    });

    await newUser.save();

   
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET not configured" });
    }
    
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        counselorId: newUser.counselorId,
        counselingStudents: newUser.counselingStudents,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  Signin,
  Signup,
};
