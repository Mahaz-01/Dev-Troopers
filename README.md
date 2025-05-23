﻿# Dev-Troopers
Team Dev Trooper
Team Dev Trooper is a web-based team collaboration tool that provides features like chat, tasks, reminders, and team management. Built with React for the frontend, Express.js and PostgreSQL for the backend, and Socket.io for real-time communication, this project aims to streamline team workflows.
Table of Contents

Features
Prerequisites
Installation
Directory Structure
Database Setup
Table Creation SQL Commands


Running the Project
Usage
API Endpoints
Contributing
License

Features

Authentication: Register and log in with email and password.
Chat: Real-time group chat with multiple rooms.
Tasks: Create, assign, and manage tasks with status tracking.
Reminders: Set and manage reminders with due dates.
Teams: Create teams, add/remove members, and link to chat rooms.
Dashboard: Overview of tasks, reminders, and teams.

Prerequisites

Node.js (v20.x or later)
npm (v10.x or later)
PostgreSQL (v15.x or later)
Git (optional, for cloning the repository)

Installation
1. Clone the Repository
git clone https://github.com/your-username/team-dev-trooper.git
cd team-dev-trooper

2. Set Up the Backend

Navigate to the backend directory:cd backend


Install dependencies:npm install


Create a .env file in the backend directory with the following content:PORT=5000
DATABASE_URL=postgres://your_username:your_password@localhost:5432/team_dev_trooper_db
JWT_SECRET=your-secret-key


Replace your_username and your_password with your PostgreSQL credentials.
Replace your-secret-key with a secure random string (e.g., generated with openssl rand -base64 32).



3. Set Up the Frontend

Navigate to the frontend directory:cd ../frontend


Install dependencies:npm install



Directory Structure
team-dev-trooper/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── reminderController.js
│   │   ├── taskController.js
│   │   ├── userController.js
│   │   └── teamController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── ChatRoom.js
│   │   ├── Reminder.js
│   │   ├── Task.js
│   │   └── Team.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── reminderRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── userRoutes.js
│   │   └── teamRoutes.js
│   ├── src/
│   │   └── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── components/
│   │   └── common/
│   │       ├── Header.js
│   │       ├── Sidebar.js
│   │       ├── Login.js
│   │       └── Signup.js
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── SocketContext.js
│   ├── pages/
│   │   ├── DashboardPage.js
│   │   ├── ChatPage.js
│   │   ├── TasksPage.js
│   │   ├── RemindersPage.js
│   │   └── TeamPage.js
│   ├── services/
│   │   ├── api.js
│   │   ├── chatService.js
│   │   ├── reminderService.js
│   │   ├── taskService.js
│   │   └── teamService.js
│   ├── App.js
│   ├── index.js
│   └── package.json
├── README.md
└── .gitignore

Database Setup
1. Create the Database

Connect to PostgreSQL and create the database:CREATE DATABASE team_dev_trooper_db;



2. Table Creation SQL Commands
Run the following SQL commands in pgAdmin or your preferred SQL client to set up the required tables:
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy user data
INSERT INTO users (name, email, password) VALUES
('Syed Saf', 'syedsaf@gmail.com', '$2b$10$...hashed_password...'), -- Use bcrypt to hash password
('User2', 'user2@example.com', '$2b$10$...hashed_password...');

-- Chat rooms table
CREATE TABLE chat_rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  team_id INT,
  creator_id INT,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Chat room members table
CREATE TABLE chat_room_members (
  chat_room_id INT NOT NULL,
  user_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (chat_room_id, user_id),
  FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Messages table
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  chat_room_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert dummy chat data
INSERT INTO chat_rooms (name, creator_id) VALUES
('General Chat', 1);
INSERT INTO chat_room_members (chat_room_id, user_id) VALUES
(1, 1), (1, 2);
INSERT INTO messages (chat_room_id, user_id, content) VALUES
(1, 1, 'Hello team!'), (1, 2, 'Hi!');

-- Reminders table
CREATE TABLE reminders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMP NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert dummy reminder data
INSERT INTO reminders (user_id, title, description, due_date, is_completed) VALUES
(1, 'Team Meeting', 'Discuss project progress', '2025-05-19 10:00:00', FALSE),
(1, 'Task Review', 'Review task assignments', '2025-05-20 14:00:00', FALSE);

-- Tasks table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  creator_id INT NOT NULL,
  assignee_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert dummy task data
INSERT INTO tasks (creator_id, assignee_id, title, description, due_date, status) VALUES
(1, 1, 'Design Homepage', 'Create wireframes for the homepage', '2025-05-20 10:00:00', 'Pending'),
(1, 2, 'Backend API', 'Develop API endpoints for tasks', '2025-05-21 14:00:00', 'In Progress');

-- Teams table
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  creator_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Team members table
CREATE TABLE team_members (
  team_id INT NOT NULL,
  user_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (team_id, user_id),
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert dummy team data
INSERT INTO teams (name, creator_id) VALUES
('Development Team', 1),
('QA Team', 2);
INSERT INTO team_members (team_id, user_id) VALUES
(1, 1), (1, 2),
(2, 2), (2, 1);

-- Update chat rooms with team_id and creator_id
UPDATE chat_rooms cr
SET team_id = t.id, creator_id = t.creator_id
FROM teams t
WHERE t.name = cr.name;


Notes:
Replace ...hashed_password... with bcrypt-hashed passwords (e.g., use bcrypt.hashSync('password', 10) in Node.js).
Adjust chat_room_id values in dummy data based on your database state.
The final UPDATE links existing chat rooms to teams based on matching names.



Running the Project
1. Start the Backend

Navigate to the backend directory:cd backend


Start the server:npm run dev


The server will run on http://localhost:5000.



2. Start the Frontend

Open a new terminal and navigate to the frontend directory:cd frontend


Start the development server:npm start


The app will run on http://localhost:3000.



3. Access the Application

Open your browser and go to http://localhost:3000/login.
Log in with syedsaf@gmail.com and a password (set during user creation).
Explore the dashboard, tasks, chat, reminders, and team pages.

Usage

Login/Signup: Use the login or signup page to access the app.
Dashboard: View an overview of your tasks, reminders, and teams.
Chat: Join or create chat rooms to communicate with team members.
Tasks: Create and manage tasks, assign them to users.
Reminders: Set reminders with due dates and mark them as completed.
Teams: Create teams, add/remove members, and access team chat rooms.

API Endpoints

Authentication:

POST /auth/register: Register a new user.
POST /auth/login: Log in and get a JWT token.


Chat:

GET /chat/rooms: Get all chat rooms for the user.
POST /chat/rooms: Create a new chat room.
POST /chat/messages: Send a message.


Tasks:

GET /tasks: Get tasks for the user.
POST /tasks: Create a task.
PUT /tasks/:id: Update a task.
DELETE /tasks/:id: Delete a task.


Reminders:

GET /reminders: Get reminders for the user.
POST /reminders: Create a reminder.
PUT /reminders/:id: Update a reminder.
DELETE /reminders/:id: Delete a reminder.


Teams:

GET /teams: Get teams for the user.
POST /teams: Create a team.
POST /teams/members: Add a member to a team.
DELETE /teams/members: Remove a member from a team.


Authorization: All endpoints (except /auth/*) require a Bearer token in the Authorization header.


Contributing

Fork the repository.
Create a new branch: git checkout -b feature-branch.
Make changes and commit: git commit -m "Add new feature".
Push to the branch: git push origin feature-branch.
Submit a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.
