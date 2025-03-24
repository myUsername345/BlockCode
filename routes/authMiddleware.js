const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        console.log("❌ No token provided");
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Extract token without "Bearer " prefix
        const token = authHeader.split(" ")[1];

        console.log("🔍 Extracted Token:", token);

        const verified = jwt.verify(token, process.env.JWT_SECRET);

        console.log("✅ Token Verified:", verified);

        req.user = verified; // Store user info in request object
        next();
    } catch (error) {
        console.log("❌ JWT Verification Error:", error.message);
        res.status(400).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
