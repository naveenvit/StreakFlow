const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const testRoutes = require("./routes/test");
const taskRoutes = require("./routes/tasks");
const goalRoutes = require("./routes/goals");
const reportRoutes = require("./routes/reports");

const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/reports", reportRoutes);

// Connect DB
connectDB();
app.use(cors({
  origin: "*", // for now (safe for small project)
  credentials: true
}));
// Test route
app.get("/", (req, res) => {
    res.send("StreakFlow Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
