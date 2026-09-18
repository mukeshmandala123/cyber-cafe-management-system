require("dotenv").config({
  path: require("path").join(__dirname, ".env"),
});

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

const terminalRoutes = require("./routes/terminalRoutes");
const customerRoutes = require("./routes/customerRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const serviceUsageRoutes = require("./routes/serviceUsageRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/terminals", terminalRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/service-usage", serviceUsageRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Cyber Cafe Management API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});