# Student Department Management System

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)](https://www.mongodb.com/mern-stack)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v14+-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-v17+-blue)](https://reactjs.org)

A MERN stack **Student Department Management System**. A *department* in this system is the existing **Branch** concept (`branchId` + `name`, e.g. `CSE` → Computer Science and Engineering): subjects, students and faculty all belong to a branch, and every dashboard is organised around departments.

The system gives administrators, faculty and students a single platform to manage department rosters, subjects, notices, timetables, study materials, exams and marks.

## Features by Role

### Admin

- Manage departments (branches) — create, edit, delete (`CSE`, `ECE`, `MECH`, `IT`, …)
- Manage faculty accounts with detailed profiles and emergency contacts
- Manage student accounts with enrollment numbers, semester and department
- Manage subjects by department and semester
- Publish notices for students and faculty
- Upload and manage timetables by department and semester
- Manage exams and view exam schedules
- Department statistics dashboard via `GET /api/branch/stats`
- Profile management and password updates

### Faculty

- View and manage personal profile with emergency contacts
- Upload and manage study materials (notes, assignments, syllabus)
- Filter and organise materials by subject, semester, department and type
- Upload and manage timetables for their department
- Search students by enrollment number, name or semester
- Enter and submit marks (single and bulk entry)
- View notices
- Password management and reset functionality

### Student

- View personal profile and academic details
- Access study materials filtered by subject and type
- View department/semester timetables with download option
- View exam schedule and personal marks (per semester)
- Access notices and announcements
- Password management and reset functionality

## Tech Stack

- **Frontend:** React.js (Create React App), Redux, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (Bearer tokens)
- **File uploads:** Multer (stored in `backend/media`, served at `/media`)

## Prerequisites

- Node.js (v18+) and npm
- MongoDB 6.0+ (a local `mongod` is enough — no Docker or root required)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd iemcrp
```

### 2. Start MongoDB (no root required)

Download and extract the official server build for your platform, then run it with a plain user-owned data directory:

```bash
mkdir -p ~/mongodb && cd ~/mongodb
curl -fL -o mongo.tgz https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2204-6.0.16.tgz
tar -xzf mongo.tgz

mkdir -p /tmp/mongodb-data
~/mongodb/mongodb-linux-x86_64-ubuntu2204-6.0.16/bin/mongod \
  --dbpath /tmp/mongodb-data --port 27017 \
  --fork --logpath /tmp/mongodb-data/mongod.log
```

To restart it later:

```bash
~/mongodb/mongodb-linux-x86_64-ubuntu2204-6.0.16/bin/mongod \
  --dbpath /tmp/mongodb-data --port 27017 \
  --fork --logpath /tmp/mongodb-data/mongod.log
```

(If the tarball URL 404s for your platform, pick the matching one from <https://fastdl.mongodb.org/linux/> — e.g. `ubuntu2004`, `debian12` or a newer major version.)

### 3. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Environment files

**`backend/.env`** (copy from `backend/.env.sample`):

```env
MONGODB_URI =mongodb://127.0.0.1:27017/DeptEase
PORT = 4000
FRONTEND_API_LINK = http://localhost:3000
JWT_SECRET = THISISSECRET

NODEMAILER_EMAIL =
NODEMAILER_PASS =
```

> `NODEMAILER_*` may be left empty. The password-reset flow degrades gracefully: the API returns a 500 for `POST /api/{admin,faculty,student}/forget-password` and the server keeps running (the reset token is still created in the database), instead of crashing.

**`frontend/.env`** (already present in this repo):

```env
REACT_APP_APILINK=http://localhost:4000/api
REACT_APP_MEDIA_LINK=http://localhost:4000/media
```

### 5. Seed the demo data

```bash
cd backend
npm run seed
```

This clears the database and inserts a complete working demo: 4 departments, 16 subjects, 12 students, 4 faculty, 2 notices, 12 timetables, 4 exams, 16 marks records and 4 study materials — plus the demo admin.

### 6. Start the servers

```bash
# Backend (from backend/)
npm start        # or: npm run dev (nodemon) → http://localhost:4000

# Frontend (from frontend/)
npm start        # → http://localhost:3000
```

## Demo Credentials

| Role    | Identifier                     | Employee/Enrollment No | Password    |
| ------- | ------------------------------ | ---------------------- | ----------- |
| Admin   | `admin@gmail.com`              | `123456`               | `admin123`  |
| Faculty | `ritu.sharma.faculty@example.com` | `2001`              | `faculty123`|
| Student | `aarav.mehta@example.com`      | `100001`               | `student123`|

Additional demo logins: `suresh.iyer.faculty@example.com`, `anita.desai.faculty@example.com`, `vikram.nair.faculty@example.com` (password `faculty123`); `diya.sharma@example.com`, `rohan.patel@example.com` and the remaining students (password `student123`).

## API

### `GET /api/branch/stats` — department statistics (authenticated)

Requires `Authorization: Bearer <token>` (any role — admin, faculty or student).

**Success response (exact contract):**

```json
{
  "success": true,
  "data": {
    "totalBranches": 4,
    "totalStudents": 12,
    "branches": [
      { "branchId": "CSE", "name": "Computer Science and Engineering", "students": 3, "subjects": 4 },
      { "branchId": "ECE", "name": "Electronics and Communication Engineering", "students": 3, "subjects": 4 },
      { "branchId": "IT",  "name": "Information Technology", "students": 3, "subjects": 4 },
      { "branchId": "MECH","name": "Mechanical Engineering", "students": 3, "subjects": 4 }
    ]
  }
}
```

- `branchId` / `name` come from the `Branch` collection (the department)
- `students` = number of students whose `branchId` references that department
- `subjects` = number of subjects whose `branch` references that department

**Error responses:** `401 {"success":false,"message":"Authentication token required","data":null}` without a token, `401 {"success":false,"message":"Invalid or expired token","data":null}` with a bad token.

### Other API groups

All under `/api`: `/api/admin`, `/api/faculty`, `/api/student` (login/register/profile), `/api/branch`, `/api/subject`, `/api/notice`, `/api/timetable`, `/api/material`, `/api/exam`, `/api/marks`. Protected routes take `Authorization: Bearer <token>`; most responses use `{ success, message, data }`.

## Project Structure

```
dept-easeflower/
├── backend/
│   ├── controllers/          # route handlers
│   ├── models/               # Mongoose schemas (details/, branch, subject, …)
│   ├── routes/               # Express routers (auth-protected)
│   ├── middlewares/          # auth (JWT) + multer upload
│   ├── utils/                # ApiResponse helper, mailer
│   ├── Database/db.js        # Mongo connection
│   ├── media/                # uploaded/static files served at /media
│   ├── admin-seeder.js       # npm run seed
│   └── index.js              # Express entry point (port 4000)
├── frontend/                 # React app (port 3000)
└── README.md
```


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
