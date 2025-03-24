const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");

const router = express.Router();

console.log("📌 Registering auth routes...");

// Utility functions to generate tokens
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "15m" } // Short expiration time for security
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username },
        process.env.REFRESH_SECRET, // Different secret for refresh tokens
        { expiresIn: "7d" } // Refresh token lasts 7 days
    );
};

//let refreshTokens = []; Temporary storage for refresh tokens (use a DB in production)

// ✅ Register User
router.post("/register", async (req, res) => {
    console.log("🔥 /register HIT!");

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        console.log("❌ Missing fields:", { username, email, password });
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        // Check if user already exists by email or username
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user in MongoDB
        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();

        console.log("✅ Successfully Saved User in MongoDB:", savedUser);
        res.status(201).json({ message: "User registered successfully", user: savedUser });
    } catch (error) {
        console.error("❌ Error Saving User in MongoDB:", error.message);
        res.status(500).json({ message: "Database error", error: error.message });
    }
});

// ✅ Login User (Returns Access & Refresh Tokens)
router.post("/login", async (req, res) => {
    console.log("🔥 /login HIT!");
    
    const { username, email, password } = req.body;

    if (!password || (!username && !email)) {
        return res.status(400).json({ message: "Please provide either a username or an email along with a password." });
    }

    try {
        let user;
        
        if (email) {
            user = await User.findOne({ email });
        } else if (username) {
            user = await User.findOne({ username });
        }

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Store refresh token in database
        await RefreshToken.create({
            token: refreshToken,
            userId: user._id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          });          

        res.json({ accessToken, refreshToken, userId: user._id, username: user.username });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Refresh Token Route (Generates New Access Token)
router.post("/refresh", async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
    }

    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }


    try {
        const verified = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const newAccessToken = generateAccessToken(verified);

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
});

// ✅ Logout (Invalidate Refresh Token)
router.post("/logout", async (req, res) => {
    const { refreshToken } = req.body;

    await RefreshToken.deleteOne({ token: refreshToken });

    res.json({ message: "User logged out successfully" });
});

// ✅ Test Route
router.get("/test", (req, res) => {
    res.send("Auth route is working!");
});

console.log("✅ Auth routes registered:", router.stack.map(layer => layer.route?.path));

const authMiddleware = require("./authMiddleware");

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user profile", error: error.message });
  }
});

module.exports = router;
