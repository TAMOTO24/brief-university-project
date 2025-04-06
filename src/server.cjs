const mongoose = require("mongoose");
const express = require("express");
const dotenv = require("dotenv");
const Brief = require("./briedSchema.cjs");

dotenv.config();
const app = express();

mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connecting to MongoDB"))
  .catch((err) => console.error("❌ Connection error:", err));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});
app.post("/api/add/brief", async (req, res) => {
  try {
    const brief = new Brief(req.body);
    await brief.save();
    res.status(201).json(brief);
  } catch (error) {
    console.error("Error saving brief:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.put("/api/briefs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "ID не предоставлен" });
    }

    const updatedData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Неверный формат ID" });
    }

    const brief = await Brief.findByIdAndUpdate(id, updatedData, { new: true });

    if (!brief) {
      return res.status(404).json({ message: "Brief not found" });
    }

    res.status(200).json(brief);
  } catch (error) {
    console.error("Error updating brief:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/briefs", async (req, res) => {
  try {
    const briefs = await Brief.find();
    res.status(200).json(briefs);
  } catch (error) {
    console.error("Error fetching briefs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
