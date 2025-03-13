// visaRoutes.js
const express = require("express");
const router = express.Router();
const { MongoClient, ObjectId } = require("mongodb");

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2lkiq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri);

// Delete a visa by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await client.connect();
    const database = client.db("visaNavigatorDB");
    const visasCollection = database.collection("visas");

    const result = await visasCollection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.json({ success: true, message: "Visa deleted successfully!" });
    } else {
      res.status(404).json({ success: false, message: "Visa not found." });
    }
  } catch (error) {
    console.error("Error deleting visa:", error);
    res.status(500).json({ success: false, message: "Failed to delete visa." });
  } finally {
    await client.close();
  }
});

module.exports = router;
