
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate fields
    if (!username || !email || !password) {
      return res.status(400).json({
        msg: "Please fill all fields"
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(409).json({
        msg: "Email already registered"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await newUser.save();

    return res.status(201).json({
      msg: "User registered successfully"
    });

  } catch (err) {
    return res.status(500).json({
      msg: "Server error",
      error: err.message
    });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Please fill all fields"
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials"
      });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Success response
    return res.status(200).json({
      success: true,
      msg: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Server error",
      error: err.message
    });
  }
};