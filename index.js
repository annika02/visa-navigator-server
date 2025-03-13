const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { router: visaRoutes, connectDB } = require("./visaRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/visas", visaRoutes);

// Start Server After DB Connection
connectDB()
  .then(() => {
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  })
  .catch((error) => {
    console.error("❌ Failed to connect to DB. Exiting...");
    process.exit(1);
  });
