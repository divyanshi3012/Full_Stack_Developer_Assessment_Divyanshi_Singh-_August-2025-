// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err));

// Schemas
const Driver = mongoose.model("Driver", new mongoose.Schema({
  name: String, currentShiftHours: Number, pastWeekHours: Number
}));
const Route = mongoose.model("Route", new mongoose.Schema({
  routeId: String, distance: Number, traffic: String, baseTime: Number
}));
const Order = mongoose.model("Order", new mongoose.Schema({
  orderId: String, value_rs: Number, routeId: String, deliveryTime: Number
}));
const User = mongoose.model("User", new mongoose.Schema({
  username: String, password: String
}));

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

// Register/Login
app.post("/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  await User.create({ username: req.body.username, password: hashed });
  res.json({ message: "User registered" });
});
app.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
  res.json({ token });
});

// CRUD
app.get("/drivers", auth, async (_, res) => res.json(await Driver.find()));
app.post("/drivers", auth, async (req, res) => res.json(await Driver.create(req.body)));
app.get("/routes", auth, async (_, res) => res.json(await Route.find()));
app.post("/routes", auth, async (req, res) => res.json(await Route.create(req.body)));
app.get("/orders", auth, async (_, res) => res.json(await Order.find()));
app.post("/orders", auth, async (req, res) => res.json(await Order.create(req.body)));

// Simulation
app.post("/simulate", auth, async (req, res) => {
  const { availableDrivers, startTime, maxHours } = req.body;
  if (!availableDrivers || !startTime || !maxHours) {
    return res.status(400).json({ error: "Missing parameters" });
  }
  const orders = await Order.find();
  let totalProfit = 0, onTime = 0;

  orders.forEach(order => {
    let penalty = 0, bonus = 0;
    const route = { distance: 10, traffic: "Low", baseTime: 30 }; // mock route
    const fuelCost = route.distance * (route.traffic === "High" ? 7 : 5);
    if (order.deliveryTime > (route.baseTime + 10)) penalty = 50;
    if (order.value_rs > 1000 && penalty === 0) bonus = order.value_rs * 0.1;
    if (penalty === 0) onTime++;
    totalProfit += order.value_rs + bonus - penalty - fuelCost;
  });

  res.json({
    totalProfit,
    efficiency: (onTime / orders.length) * 100,
    onTime,
    late: orders.length - onTime
  });
});

app.listen(5000, () => console.log("🚀 Backend running on port 5000"));

