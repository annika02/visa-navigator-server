// visaRoutes.js
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const router = express.Router();

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2lkiq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

// Reuse a single collection reference
let visasCollection;

// Connect to MongoDB (only once)
async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB!");
    visasCollection = client.db("visaNavigatorDB").collection("visas");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1); // Exit the application on DB connection failure
  }
}

// ➤ Add a new visa
router.post("/add-visa", async (req, res) => {
  try {
    const visaData = req.body;
    const result = await visasCollection.insertOne(visaData);
    res.status(201).json({
      success: true,
      message: "Visa added successfully!",
      visa: result,
    });
  } catch (error) {
    console.error("❌ Error adding visa:", error);
    res.status(500).json({ success: false, message: "Failed to add visa." });
  }
});

// ➤ Get all visas
router.get("/", async (req, res) => {
  try {
    const visas = await visasCollection.find().toArray();
    res.json(visas);
  } catch (error) {
    console.error("❌ Error fetching visas:", error);
    res.status(500).json({ success: false, message: "Failed to fetch visas." });
  }
});

// ➤ Get visa details by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const visa = await visasCollection.findOne({ _id: new ObjectId(id) });

    if (!visa) {
      return res
        .status(404)
        .json({ success: false, message: "Visa not found." });
    }

    res.status(200).json({ success: true, visa });
  } catch (error) {
    console.error("❌ Error fetching visa details:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch visa details." });
  }
});

// ➤ Get visa applications by email
router.get("/applications/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const applications = await visasCollection.find({ email: email }).toArray();

    if (applications.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No applications found for this email.",
        });
    }

    res.status(200).json(applications);
  } catch (error) {
    console.error("❌ Error fetching applications by email:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch applications." });
  }
});

// ➤ Delete a visa by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await visasCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      res.json({ success: true, message: "Visa deleted successfully!" });
    } else {
      res.status(404).json({ success: false, message: "Visa not found." });
    }
  } catch (error) {
    console.error("❌ Error deleting visa:", error);
    res.status(500).json({ success: false, message: "Failed to delete visa." });
  }
});

module.exports = { router, connectDB };
