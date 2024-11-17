const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
(async () => {
  try {
    // Connect to MongoDB (removed deprecated options)
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit the application if the database connection fails
  }
})();

// Routes
try {
  app.use("/api/tasks", require("./routes/tasks"));
} catch (error) {
  console.error("Error loading routes:", error.message);
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
