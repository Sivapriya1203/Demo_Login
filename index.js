const express = require("express");
const db = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const EmailRoutes = require("./routes/EmailRoutes")
const StudentRoutes =require("./routes/StudentRoutes");
const connectDB = require("./config/db");



const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB()




// Routes
app.use("/auth", authRoutes);
app.use('/forget',EmailRoutes)
app.use("/students",StudentRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(2002, () => {
  console.log("Server running on port 2002");
});
