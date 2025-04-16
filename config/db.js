const mongoose = require("mongoose");
require("dotenv").config(); // Ensure environment variables are loaded

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI; // Read URI from environment variables

    if (!mongoURI) {
      throw new Error("MongoDB connection string is undefined. Check .env file.");
    }

    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected 🟢`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;








// const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: "localhost", // Or your database host
//   user: "root", // MySQL username
//   password: "Alliswell@12", // MySQL password
//   database: "nodeprojects", // Your database name
// });

// db.connect((err) => {
//   if (err) {
//     console.error("❌ Error connecting to MySQL:", err);
//   } else {
//     console.log("✅ Connected to MySQL database");
//   }
// });

// module.exports = db;