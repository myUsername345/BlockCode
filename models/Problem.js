const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: String,
  expectedOutput: String,
});

const problemSchema = new mongoose.Schema({
  title: String,
  description: String,
  language: String, // python, javascript, etc.
  difficulty: String, // easy, medium, hard
  starterCode: String,
  testCases: [testCaseSchema]
});

module.exports = mongoose.model("Problem", problemSchema);
