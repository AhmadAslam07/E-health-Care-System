# PulseConnect – E-Healthcare Management System

PulseConnect is a comprehensive healthcare platform that connects patients with doctors, offering appointment scheduling, video consultations, lab report uploads, and testimonials.


# Getting Started


# Prerequisites

- Node.js
  
- npm
  
- XAMPP (for MySQL and phpMyAdmin)


# Project Structure
Ahmad Fyp/

├── backend/

├── frontend/

└── pulseconnect.sql


# Backend Setup

cd backend

npm install

npx nodemon app.js


# Frontend Setup

cd frontend

npm install

npm start

Open: http://localhost:----


# Import MySQL Database (Using XAMPP)

Open XAMPP and start Apache and MySQL.

Go to http://localhost/phpmyadmin.

Click new to create a new database and name it " "and then click go.

Click Import.

Choose pulseconnect.sql from the database folder.

Click Go to import.


# To start video call
node peer-server.js


# Features

Doctor & Patient Registration/Login

Dynamic Doctor Profiles

Appointment Booking System

Video Call Integration

Lab Report Uploads

Testimonials System (CRUD)

Role-based Navbar

Chat bot  -- "Our intelligent patient assistant helps users navigate healthcare services through platform tutorials, AI-driven symptom evaluation, and personalized doctor recommendations."


# Developer Info

Database Used: MySQL

ORM: Sequelize

Backend: Node.js, Express

Frontend: React.js
