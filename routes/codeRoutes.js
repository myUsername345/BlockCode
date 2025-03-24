const express = require("express");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

const router = express.Router();

router.post("/execute", async (req, res) => {
    const { code, language } = req.body;

    if (!code || !language) {
        return res.status(400).json({ message: "Missing code or language." });
    }

    const extMap = {
        python: "py",
        javascript: "js",
        cpp: "cpp"
    };

    const filename = `temp.${extMap[language.toLowerCase()]}`;
    const filepath = path.join(__dirname, filename);
    fs.writeFileSync(filepath, code);

    let command;

    switch (language.toLowerCase()) {
        case "python":
            command = `py "${filepath}"`;
            break;
        case "javascript":
            command = `node "${filepath}"`;
            break;
        case "cpp":
            const exeFile = path.join(__dirname, "temp.exe");
            command = `g++ "${filepath}" -o "${exeFile}" && "${exeFile}"`;
            break;
        default:
            return res.status(400).json({ message: "Unsupported language." });
    }

    exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
        // Clean up temp files
        fs.unlinkSync(filepath);
        if (language.toLowerCase() === "cpp" && fs.existsSync("temp.exe")) {
            fs.unlinkSync("temp.exe");
        }

        if (error) {
            return res.json({ output: stderr || error.message });
        }

        res.json({ output: stdout.trim() });
    });
});

module.exports = router;
