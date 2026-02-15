  import express from "express";
  import bcrypt from "bcrypt";
  import jwt from "jsonwebtoken";
  import User from "../models/userModel.js";

  const router = express.Router();

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
      console.log("5. Existing user check completed:", existingUser);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message:
            existingUser.mobile === mobile
              ? "Mobile number already exists"
              : "Username already taken",
        });
      }
      console.log("6. About to hash password");
      const hashedPassword = await bcrypt.hash(password, 10);
   console.log("7. Password hashed");

    console.log("8. About to create new user");
      const newUser = new User({
        username,
        mobile,
        password: hashedPassword,
      });
 console.log("9. User object created:", { username, mobile });

    console.log("10. About to save user");
      await newUser.save();
  console.log("11. User saved successfully");
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

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: "Login error", error });
    }
  });

  export default router;
