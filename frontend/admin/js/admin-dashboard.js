let pieChartInstance = null;
let barChartInstance = null;

const token = localStorage.getItem("adminToken");

console.log("Token:", token);

if (!token) {
  window.location.href = "admin-login.html";
}

console.log("Fetching complaints from http://localhost:5000/api/admin/complaints");

fetch("http://localhost:5000/api/admin/complaints", {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  }
})
.then(res => {
  console.log("Response status:", res.status);
  if (!res.ok) {
    return res.text().then(text => {
      console.error("Error response:", text);
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("adminToken");
        window.location.href = "admin-login.html";
      }
      throw new Error("Server error: " + res.status + " - " + text);
    });
  }
  return res.json();
})
.then(data => {
  console.log("Complaints:", data);
  displayStats(data);
})
.catch(err => {
  console.error("Dashboard Error:", err);
  alert("Failed to load admin dashboard data: " + err.message);
});

function displayStats(complaints) {
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "pending").length;
  const resolved = complaints.filter(c => c.status === "resolved").length;

  document.getElementById("users").textContent = "0";
  document.getElementById("complaints").textContent = total;
  document.getElementById("pending").textContent = pending;
  document.getElementById("resolved").textContent = resolved;
}
