const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let passengerCount = 0;

// GET count
app.get("/count", (req, res) => {
  res.json({ count: passengerCount });
});

// IN → +1
app.post("/enter", (req, res) => {
  passengerCount++;
  res.json({ count: passengerCount });
});

// OUT → -1
app.post("/exit", (req, res) => {
  if (passengerCount > 0) passengerCount--;
  res.json({ count: passengerCount });
});

app.listen(5000, "0.0.0.0", () => console.log("Server running on port 5000"));