require("dotenv").config();
console.log("🔍 Loaded ENV Variables:", process.env);
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Debugging
console.log("📌 Registering routes...");

try {
    const authRoutes = require("./routes/authRoutes");
    const problemRoutes = require("./routes/problemRoutes");
    const codeRoutes = require("./routes/codeRoutes");

    app.use("/api/auth", authRoutes);
    app.use("/api/problems", problemRoutes);
    app.use("/api/code", codeRoutes);

    console.log("✅ Routes Successfully Applied: /api/auth, /api/problems, /api/code");
} catch (error) {
    console.error("❌ Error loading routes:", error.message);
}

// Show all routes
setTimeout(() => {
    console.log("✅ Final Registered Routes:");
    app._router.stack.forEach((layer) => {
        if (layer.route) {
            console.log(`➡️ ${layer.route.path} (METHODS: ${Object.keys(layer.route.methods)})`);
        }
    });
}, 1000);

// Root route
app.get("/", (req, res) => {
    res.send("BlockCode Backend API Running...");
});

// Start server
app.listen(PORT, () => {
    console.log(`🔥 Server running on port ${PORT}`);
});
