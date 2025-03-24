# 🧱 BlockCode — LeetCode but with Blocks!

BlockCode is an interview practice platform where users solve coding problems by writing or dragging block-based solutions (coming soon). Code is auto-validated against test cases just like LeetCode.

## 🔐 Features
- JWT Authentication (access + refresh tokens)
- MongoDB-backed problem + test case storage
- Submit code in Python, JavaScript, or C++
- Real-time execution with file-based test I/O
- Track user progress (problems passed)
- View submission history
- `/me`, `/user/stats`, `/user/submissions` routes
- Refresh token stored in MongoDB

## 📦 Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT for Auth
- Postman for testing
- Native file I/O for embedded code execution

## 🚀 Getting Started

### Install dependencies:
```bash
npm install express cors dotenv mongoose bcryptjs jsonwebtoken
