function trackComplaint() {
  const id = document.getElementById("complaintId").value.trim();
  const result = document.getElementById("result");
  
  if (!id) {
    alert("Please enter Complaint ID");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login first! Redirecting...");
    window.location.href = "login.html";
    return;
  }

  const headers = {
    "Authorization": `Bearer ${token}`
  };

  fetch(`http://localhost:5000/api/complaints/track/${id}`, { headers })
    .then(res => {
      if (!res.ok) return res.json().then(err => { throw err });
      return res.json();
    })
    .then(data => {
      document.getElementById("status").innerText = data.status;
      document.getElementById("category").innerText = data.category || data.title || "N/A";
      document.getElementById("description").innerText = data.description;
      document.getElementById("updated").innerText =
        new Date(data.createdAt).toLocaleDateString();

      const statusEl = document.getElementById("status");
      statusEl.className = "";
      if (data.status === "Pending") statusEl.classList.add("pending");
      if (data.status === "In Progress") statusEl.classList.add("in-progress");
      if (data.status === "Resolved") statusEl.classList.add("resolved");

      result.classList.remove("hidden");
    })
    .catch(err => {
      console.error("Track error:", err);
      alert(err.message || "Failed to track complaint");
    });
}
