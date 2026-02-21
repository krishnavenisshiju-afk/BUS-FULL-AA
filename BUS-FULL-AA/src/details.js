const busList = document.getElementById("busList");

// 📌 Get values from URL
const params = new URLSearchParams(window.location.search);
const from = params.get("from");
const to = params.get("to");

// safety check
if (!from || !to) {
  busList.innerHTML = "<p>Invalid search ❌</p>";
  throw new Error("Missing from/to");
}

// convert to uppercase
const FROM = from.trim().toUpperCase();
const TO = to.trim().toUpperCase();

// 📌 Fetch buses from backend
fetch(`http://localhost:5000/buses?from=${FROM}&to=${TO}`)
  .then(res => res.json())
  .then(data => {

    if (data.length === 0) {
      busList.innerHTML = "<p>No buses available for this route ❌</p>";
      return;
    }

    busList.innerHTML = "";

    data.forEach(bus => {
      const div = document.createElement("div");
      div.className = "bus-card";

      div.innerHTML = `
        <h3>${bus.id}</h3>
        <p>🛣 Route: ${bus.from} ➝ ${bus.to}</p>
        <p>⏱ Arrival: ${bus.arrivalTime}</p>
        <p>👥 Passengers: <strong>${bus.passengers}</strong></p>
      `;

      busList.appendChild(div);
    });

  })
  .catch(err => {
    busList.innerHTML = "⚠ Error connecting to server";
    console.error(err);
  });