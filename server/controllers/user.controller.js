
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import "dotenv/config";

import cloudinary from "../config/claudinary.js";


export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Please fill all fields"
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
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
      success: true,
      msg: "User registered successfully"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
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

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
   


    return res.status(200).json({
      success: true,
      msg: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile
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

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  });

  return res.status(200).json({
    success: true,
    msg: "Logged out successfully"
  });
};
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;

    if (!profilePic) {
      return res.status(400).json({
        message: "Profile pic is required"
      });
    }

    const userId = req.user.id; // from JWT payload

    // Upload image to Cloudinary
    const uploadResponse =
      await cloudinary.uploader.upload(profilePic);

    // Update user in DB
    const updatedUser =
      await User.findByIdAndUpdate(
        userId,
        {
          profilePic: uploadResponse.secure_url
        },
        {
          returnDocument: "after"
        }
      );

    return res.status(200).json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.log("FULL ERROR:", error);

    return res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, msg: "User not found" });
    }
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};
