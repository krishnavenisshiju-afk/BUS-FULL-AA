let bus = {
  name: "Bus 101",
  capacity: 40,
  count: 5
};

function updateUI() {
  document.getElementById("count").innerText = bus.count;

  let percent = (bus.count / bus.capacity) * 100;
  let status = "Low";

  if (percent > 75) status = "High";
  else if (percent > 40) status = "Medium";

  document.getElementById("status").innerText = status;
}

window.enterBus = function () {
  if (bus.count < bus.capacity) {
    bus.count++;
    updateUI();
  }
};

window.exitBus = function () {
  if (bus.count > 0) {
    bus.count--;
    updateUI();
  }
};

updateUI();