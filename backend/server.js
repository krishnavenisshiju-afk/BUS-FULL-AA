const express = require("express");
const cors = require("cors");
const QRCode = require("qrcode");

const app = express();
app.use(cors());
app.use(express.json());

/* 🚌 Dummy Bus Data */
let buses = [
  {
    id: "BUS1001",
    from: "ALUVA",
    to: "VYTILA",
    arrivalTime: "10:15 AM",
    passengers: 0,
  },
  {
    id: "BUS1002",
    from: "ERNAKULAM",
    to: "POOKATUPADY",
    arrivalTime: "10:45 AM",
    passengers: 0,
  },
];

/* 🔐 Scan Log */
let scanLog = {};

/* 🧪 Test */
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

/* 🔍 Get buses */
app.get("/buses", (req, res) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ message: "Enter from & to" });
  }

  const filtered = buses.filter(
    bus =>
      bus.from.toLowerCase() === from.toLowerCase() &&
      bus.to.toLowerCase() === to.toLowerCase()
  );

  res.json(filtered);
});

/* 🆔 Get single bus */
app.get("/bus/:id", (req, res) => {
  const bus = buses.find(b => b.id === req.params.id);
  if (!bus) return res.status(404).json({ message: "Bus not found" });

  res.json(bus);
});

/* 📲 Scan QR */
app.post("/scan", (req, res) => {
  const { busId, userId } = req.body;

  const bus = buses.find(b => b.id === busId);
  if (!bus) return res.status(404).json({ message: "Bus not found" });

  if (!scanLog[userId]) scanLog[userId] = {};

  const alreadyInside = scanLog[userId][busId];

  if (!alreadyInside) {
    bus.passengers++;
    scanLog[userId][busId] = true;

    return res.json({
      message: "Checked IN ✅",
      passengers: bus.passengers,
    });
  } else {
    if (bus.passengers > 0) bus.passengers--;
    scanLog[userId][busId] = false;

    return res.json({
      message: "Checked OUT ❌",
      passengers: bus.passengers,
    });
  }
});

/* 🧾 QR GENERATOR ROUTE */
app.get("/generate-qr/:busId", async (req, res) => {
  const { busId } = req.params;

  const bus = buses.find(b => b.id === busId);
  if (!bus) return res.send("Bus not found");

  try {
    const qr = await QRCode.toDataURL(busId);

    res.send(`
      <h2>QR for ${busId}</h2>
      <img src="${qr}" />
      <p>Scan this in your scanner page</p>
    `);
  } catch (err) {
    res.send("Error generating QR");
  }
});

/* ▶ Start */
const os = require("os");

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

const PORT = 5000;
const HOST = "0.0.0.0";
const localIP = getLocalIP();

app.listen(PORT, HOST, () =>
  console.log(`✅ Backend running at:
  - Local: http://localhost:${PORT}
  - Network: http://${localIP}:${PORT}`)
);