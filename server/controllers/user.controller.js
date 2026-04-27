
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import User from "../models/user.models.js";

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