function updateClock() {
  const now = new Date();
  document.getElementById("clock").innerText =
    now.toLocaleTimeString() + " | " + now.toDateString();
}

setInterval(updateClock, 1000);
updateClock();
