const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const authMiddleware = require("./authMiddleware");
const Problem = require("../models/Problem");
const Submission = require("../models/Submissions");

const router = express.Router();

console.log("✅ Loaded problemRoutes.js");

router.get("/test", (req, res) => {
    res.send("✅ Problem route is working!");
});

router.post("/:id/submit", async (req, res) => {
    console.log("🔥 /submit HIT!");
    const { code, language } = req.body;
    const problemId = req.params.id;

    if (!code || !language) {
        return res.status(400).json({ message: "Missing code or language." });
    }

    const extMap = { python: "py", javascript: "js", cpp: "cpp" };
    const filename = `submission.${extMap[language]}`;
    const filepath = path.join(__dirname, filename);

    try {
        const problem = await Problem.findById(problemId);
        if (!problem) return res.status(404).json({ message: "Problem not found" });

        fs.writeFileSync(filepath, code);
        const results = [];

        for (const testCase of problem.testCases) {
            const { input, expectedOutput } = testCase;

            // Write input to a temporary file
            fs.writeFileSync("input.txt", input);

            let command;
            if (language === "python") {
                command = `py "${filepath}" < input.txt`;
            } else if (language === "javascript") {
                command = `node "${filepath}" < input.txt`;
            } else if (language === "cpp") {
                const exePath = path.join(__dirname, "submission.exe");
                command = `g++ "${filepath}" -o "${exePath}" && "${exePath}" < input.txt`;
            } else {
                return res.status(400).json({ message: "Unsupported language." });
            }

            const output = await new Promise((resolve) => {
                exec(command, { timeout: 5000 }, (err, stdout, stderr) => {
                    if (err) resolve({ passed: false, output: stderr || err.message });
                    else resolve({
                        passed: stdout.trim() === expectedOutput.trim(),
                        output: stdout.trim()
                    });
                });
            });

            results.push({ input, expectedOutput, ...output });
        }

        // Cleanup
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        if (fs.existsSync("input.txt")) fs.unlinkSync("input.txt");
        if (language === "cpp" && fs.existsSync("submission.exe")) fs.unlinkSync("submission.exe");

        await Submission.create({
            userId: "65e4f4fa1234567890abcdef", // 🔐 Replace with real user from JWT later
            problemId,
            code,
            language,
            passed: results.every(r => r.passed),
            output: JSON.stringify(results)
        });

        res.json({ passedAll: results.every(r => r.passed), results });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

console.log("✅ Routes registered in problemRoutes.js");

router.get("/user/submissions", authMiddleware, async (req, res) => {
    try {
      const submissions = await Submission.find({ userId: req.user.id })
        .populate("problemId", "title");
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching submissions", error: error.message });
    }
  });

  router.get("/user/stats", authMiddleware, async (req, res) => {
    try {
      const submissions = await Submission.find({
        userId: req.user.id,
        passed: true
      });
  
      // Use a Set to get unique problem IDs
      const passedProblems = new Set(submissions.map(sub => sub.problemId.toString()));
  
      res.json({
        totalPassed: passedProblems.size,
        problems: Array.from(passedProblems)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate stats", error: error.message });
    }
  });
  
  
module.exports = router;
