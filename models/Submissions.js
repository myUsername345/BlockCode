const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },
  code: String,
  language: String,
  passed: Boolean,
  output: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Submission", submissionSchema);
