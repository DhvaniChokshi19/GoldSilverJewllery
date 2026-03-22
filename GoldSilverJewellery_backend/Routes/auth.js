import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { username, mobile, password } = req.body;

    if (!username || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a 10 digit number",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ mobile }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.mobile === mobile
            ? "Mobile number already exists"
            : "Username already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      mobile,
      password: hashedPassword,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        mobile: newUser.mobile,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    console.error("Error occurred at stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: {
        message: error.message,
        name: error.name,
      },
    });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    // Validation
    if (!mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and password are required",
      });
    }

    // Validate mobile number format
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number",
      });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found. Please sign up first.",
      });
    }

    if (user.authProvider === "google") {
  return res.status(400).json({
    success: false,
    message: "Please login using Google",
  });
}

    const isPasswordValid = bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    res.status(500).json({
      success:false,
      message: "Login error",
      error: {
        message: error.message,
        name: error.name,
      },
    });
  }
});

router.post("/google",async(req,res) =>{
  const {credential} = req.body;
  try{
    //verify token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { sub:googleId, name, email, picture} = ticket.getPayload();

    //find or create user
    let user= await User.findOne({ $or: [{ googleId }, { email }] });
    if(!user){
      user = await User.create({
        googleId,
        name,
        email,  
        picture,
        authProvider:'google',
      })
    } else if (!user.googleId) {
  // Link Google account to existing local account
  user.googleId = googleId;
  user.authProvider = 'google';
  user.picture = picture || user.picture;
  await user.save();
}
    //issue JWT
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{
      expiresIn: "1d",
    });
    res.json({
      success:true,
      token,
      user: {id: user._id, name: user.name, email:user.email, picture: user.picture},
    });
  }catch(error){
    res.status(401).json({
      message:"Google Auth Failed",
      error: error.message,
    })
  }
});
export default router;
