require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const adminRoutes = require("./routes/admin.routes");
const campRoutes = require("./routes/camp.routes");
const centerRoutes = require("./routes/centers.routes");
const volunteerRoutes = require("./routes/volunteer.routes");
const authRoutes = require("./routes/auth.routes")

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/Admin", adminRoutes);
app.use("/camp", campRoutes);
app.use("/center",centerRoutes);
app.use("/volunteer", volunteerRoutes);
app.use("/auth",authRoutes);
app.use("/uploads", express.static("uploads"));
module.exports = app;
