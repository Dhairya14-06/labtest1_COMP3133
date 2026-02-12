📌 Project Overview

This project is a full-stack real-time chat application developed for COMP 3133 Lab Test 1. It includes user authentication, group chat rooms, private messaging, and MongoDB Atlas database integration.

🚀 Features

User Signup (unique username, password hashing with bcrypt)

User Login with validation

Session stored using localStorage

Join/Leave predefined chat rooms

Real-time group messaging

Private 1-to-1 messaging

Typing indicator

Logout functionality

All messages stored in MongoDB Atlas

🗄️ Database (MongoDB Atlas)

Database: comp3133_chat

Collections:

users

groupmessages

privatemessages

Messages include:

from_user

to_user (for private)

room (for group)

message

date_sent

🛠️ Technologies Used

Node.js

Express.js

MongoDB Atlas

Mongoose

Socket.io

bcryptjs

Bootstrap

jQuery

dotenv

📂 Project Structure
config/db.js
models/User.js
models/GroupMessage.js
models/PrivateMessage.js
routes/auth.js
public/js (chat, login, signup)
view (signup, login, chat)
server.js
.env

▶️ How to Run

Install dependencies:

npm install


Configure .env:

PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string


Start server:

npm run dev


Open:

http://localhost:3000/view/signup.html