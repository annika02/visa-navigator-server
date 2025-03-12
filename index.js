const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Replace with your actual MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2lkiq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient instance
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect to MongoDB once and keep the connection open
async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    // Access the database and collections
    const database = client.db("visaNavigatorDB");
    const visasCollection = database.collection("visas");

    // Create a Visa (POST)
    app.post("/add-visa", async (req, res) => {
      const visa = req.body;
      try {
        const result = await visasCollection.insertOne(visa);
        res.status(201).send({ message: "Visa added successfully", result });
      } catch (error) {
        res.status(500).send({ message: "Error adding visa", error });
      }
    });

    // Get All Visas (GET)
    app.get("/visas", async (req, res) => {
      try {
        const visas = await visasCollection.find().toArray();
        res.status(200).send(visas);
      } catch (error) {
        res.status(500).send({ message: "Error fetching visas", error });
      }
    });

    // Update Visa (PUT)
    app.put("/update-visa/:id", async (req, res) => {
      const { id } = req.params;
      const updatedVisa = req.body;
      try {
        const result = await visasCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedVisa }
        );
        res.status(200).send({ message: "Visa updated successfully", result });
      } catch (error) {
        res.status(500).send({ message: "Error updating visa", error });
      }
    });

    // Delete Visa (DELETE)
    app.delete("/delete-visa/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const result = await visasCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.status(200).send({ message: "Visa deleted successfully", result });
      } catch (error) {
        res.status(500).send({ message: "Error deleting visa", error });
      }
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Run the MongoDB connection
run();

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
