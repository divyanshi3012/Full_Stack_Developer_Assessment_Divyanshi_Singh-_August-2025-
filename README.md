# GreenCart Logistics Simulation Tool
A full-stack web application to simulate delivery operations and calculate key performance indicators (KPIs) such as profit, efficiency, on-time vs late deliveries, and fuel costs.

🚀 Tech Stack
Frontend: React (Hooks)

Backend: Node.js, Express, MongoDB

Authentication: JWT

Charts: Chart.js / Recharts

⚡ Features
Manager login with JWT authentication

CRUD operations for Drivers, Routes, and Orders

Delivery simulation with custom company KPI rules

Real-time dashboard with charts

Responsive UI for desktop and mobile

🛠 Setup
Backend
bash
Copy
Edit
cd backend
npm install
cp .env.example .env
npm start
Frontend
bash
Copy
Edit
cd frontend
npm install
cp .env.example .env
npm start
📌 Environment Variables
Backend:

MONGO_URI – MongoDB connection string

JWT_SECRET – JWT signing key

Frontend:

REACT_APP_API_URL – Backend API base URL

🌐 Deployment
Frontend: Vercel / Netlify

Backend: Render / Railway

Database: MongoDB Atlas

