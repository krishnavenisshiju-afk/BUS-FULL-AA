import './style.css'

const searchBtn = document.getElementById("searchBtn");
const result = document.getElementById("result");

searchBtn.addEventListener("click", () => {
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;

  if (!start || !end) {
    result.innerHTML = "⚠️ Please enter both locations";
    return;
  }

  const buses = [
    {
      busNo: "KL 15 1234",
      route: `${start} ➝ ${end}`,
      passengers: 32,
      eta: "10 mins"
    },
    {
      busNo: "KL 15 5678",
      route: `${start} ➝ ${end}`,
      passengers: 18,
      eta: "18 mins"
    }
  ];

  displayBuses(buses);
});

function displayBuses(buses) {
  result.innerHTML = "";

  buses.forEach(bus => {
    result.innerHTML += `
      <div class="bus-card">
        <h3>🚌 ${bus.busNo}</h3>
        <p><strong>Route:</strong> ${bus.route}</p>
        <p><strong>Passengers:</strong> ${bus.passengers}</p>
        <p><strong>ETA:</strong> ${bus.eta}</p>
      </div>
    `;
  });
}