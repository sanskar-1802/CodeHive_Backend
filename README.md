# 🚀 CodeHive Backend

> A scalable real-time collaborative code editor backend built using Node.js, Express.js, MongoDB, and Socket.io.

CodeHive Backend powers real-time room-based collaboration, authentication, live code synchronization, chat messaging, cursor tracking, and multi-language code execution.

---

# 🌟 Features

## 🔐 Authentication System

- User Signup
- OTP Verification via Email
- Secure Login using JWT
- Password Hashing using bcrypt
- Protected Authentication Flow

---

## 🏠 Room Management

- Create coding rooms
- Join existing rooms
- Real-time participant tracking
- Room persistence using MongoDB

---

## 👨‍💻 Real-Time Collaboration

- Live code synchronization
- Real-time socket communication
- Multi-user collaborative editing
- Instant updates across clients

---

## 💬 Real-Time Chat

- Room-based chat system
- Live message broadcasting
- Persistent chat storage

---

## 🎯 Cursor Tracking

- Real-time cursor position sharing
- Live collaborative editing experience

---

## ⚡ Code Execution

Supports multiple programming languages:

- Python
- C++
- C
- Java

Code execution powered using Judge0 API.

---

## 📧 OTP Email System

- OTP generation
- Email verification
- OTP expiry handling
- Nodemailer integration with Gmail SMTP

---

# 🛠️ Tech Stack

## Backend Technologies

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Socket.io
- JWT Authentication
- bcryptjs
- Nodemailer
- Axios
- dotenv
- nanoid

---

# 📁 Folder Structure

```bash
server/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── roomController.js
│   └── codeController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Room.js
│   ├── ChatMessage.js
│   └── CodeHistory.js
│
├── routes/
│   ├── authRoutes.js
│   ├── roomRoutes.js
│   └── codeRoutes.js
│
├── services/
│   └── emailService.js
│
├── socket/
│   └── socketHandler.js
│
├── utils/
│   └── generateId.js
│
├── .env
├── package.json
├── server.js
└── README.md
```

---

# ⚙️ Installation Guide

## 1️⃣ Clone Repository

```bash
git clone <backend-repo-url>
```

---

## 2️⃣ Navigate to Backend Directory

```bash
cd server
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

# ▶️ Run Backend

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# 🌐 Environment Variables

Create a `.env` file inside root directory:

```env
PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_google_app_password

RAPIDAPI_KEY=your_judge0_api_key
```

---

# 🗄️ Database Models

## User Model

```js
{
  username: String,
  email: String,
  password: String,
  isVerified: Boolean,
  otp: String,
  otpExpiry: Date
}
```

---

## Room Model

```js
{
  roomId: String,
  host: String,
  participants: [
    {
      socketId: String,
      username: String
    }
  ],
  language: String,
  currentCode: String,
  createdAt: Date
}
```

---

## ChatMessage Model

```js
{
  roomId: String,
  sender: String,
  message: String,
  timestamp: Date
}
```

---

## CodeHistory Model

```js
{
  roomId: String,
  code: String,
  timestamp: Date
}
```

---

# 🔗 REST API Endpoints

# 🔐 Authentication APIs

## Signup

```http
POST /api/auth/signup
```

Request Body:

```json
{
  "username": "user",
  "email": "user@gmail.com",
  "password": "123456"
}
```

---

## Verify OTP

```http
POST /api/auth/verify
```

Request Body:

```json
{
  "email": "user@gmail.com",
  "otp": "123456"
}
```

---

## Login

```http
POST /api/auth/login
```

Request Body:

```json
{
  "email": "user@gmail.com",
  "password": "123456"
}
```

Response:

```json
{
  "token": "JWT_TOKEN",
  "user": {}
}
```

---

# 🏠 Room APIs

## Create Room

```http
POST /api/rooms/create
```

---

## Join Room

```http
POST /api/rooms/join
```

---

## Get Room

```http
GET /api/rooms/:roomId
```

---

## Get User Rooms

```http
GET /api/rooms/user
```

---

# ⚡ Code APIs

## Execute Code

```http
POST /api/code/execute
```

Request Body:

```json
{
  "code": "print('Hello')",
  "language": 71
}
```

---

# 🔌 Socket.io Events

# Room Events

```text
join-room
user-joined
user-left
```

---

# Code Events

```text
code-change
code-update
```

---

# Chat Events

```text
chat-message
chat-update
```

---

# Cursor Events

```text
cursor-move
cursor-update
```

---

# Voice Signaling

```text
voice-signal
```

---

# 🔄 Socket Workflow

## User Joins Room

```text
Client emits → join-room
↓
Backend joins socket room
↓
Participants updated
↓
Broadcast user-joined
```

---

## Code Collaboration

```text
User types code
↓
Emit code-change
↓
Broadcast code-update
↓
All users receive updated code
```

---

## Chat Workflow

```text
User sends message
↓
Emit chat-message
↓
Store message in DB
↓
Broadcast chat-update
```

---

# 📧 Email Verification Workflow

```text
Signup
↓
Generate OTP
↓
Send OTP Email
↓
Verify OTP
↓
Enable Login Access
```

---

# ⚡ Code Execution Workflow

```text
Frontend sends code
↓
Backend calls Judge0 API
↓
Judge0 executes code
↓
Backend returns output
```

---

# 🔥 Security Features

- JWT Authentication
- Password Hashing
- OTP Expiry
- Protected Routes
- Environment Variables
- Secure Email Authentication

---

# 🧠 Architecture Overview

```text
Frontend (React)
        ↓
REST APIs + Socket.io
        ↓
Backend (Node.js + Express)
        ↓
MongoDB Atlas
        ↓
Judge0 API / Gmail SMTP
```

---

# 🔥 Future Improvements

- Docker Deployment
- AI Code Assistant
- Voice & Video Collaboration
- File Explorer System
- Code Versioning
- Redis Caching
- Kubernetes Deployment
- WebRTC Integration

---

# 👨‍💻 Developer

### Sanskar Mishra

---

# 📜 License

This project is created for educational, portfolio, and learning purposes.
