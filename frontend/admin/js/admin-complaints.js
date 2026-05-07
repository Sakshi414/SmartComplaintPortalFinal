const token = localStorage.getItem("adminToken");

if (!token) {
  window.location.href = "admin-login.html";
}

fetch("http://localhost:5000/api/admin/complaints", {
  headers: {
    "Authorization": `Bearer ${token}`
  }
})
.then(res => {
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("adminToken");
      window.location.href = "admin-login.html";
    }
    throw new Error("Unauthorized or server error");
  }
  return res.json();
})
.then(data => {
  console.log("Complaints:", data);
  displayComplaints(data);
})
.catch(err => {
  console.error("Complaints Error:", err);
  alert("Failed to load complaints data");
});

function displayComplaints(complaints) {
  const container = document.getElementById("complaints-container");
  if (container) {
    container.innerHTML = complaints.map(complaint => `
      <div class="complaint-card">
        <p><strong>Title:</strong> ${complaint.title}</p>
        <p><strong>Description:</strong> ${complaint.description}</p>
        <p><strong>Status:</strong> ${complaint.status}</p>
        <p><strong>Date:</strong> ${new Date(complaint.createdAt).toLocaleDateString()}</p>
        <select onchange="updateStatus('${complaint._id}', this.value)">
          <option value="pending" ${complaint.status.toLowerCase() === "pending" ? "selected" : ""}>Pending</option>
          <option value="resolved" ${complaint.status.toLowerCase() === "resolved" ? "selected" : ""}>Resolved</option>
          <option value="rejected" ${complaint.status.toLowerCase() === "rejected" ? "selected" : ""}>Rejected</option>
        </select>
      </div>
    `).join("");
  }
}

function updateStatus(complaintId, newStatus) {
  console.log('Updating complaint', complaintId, 'to status', newStatus);
  fetch(`http://localhost:5000/api/admin/complaints/${complaintId}/status`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status: newStatus })
  })
  .then(async res => {
    const data = await res.json();
    if (!res.ok) {
      console.error('Server response:', data);
      throw new Error(data.message || `HTTP ${res.status}`);
    }
    alert("Status updated successfully!");
    // Refresh list
    location.reload();
  })
  .catch(err => {
    console.error("Update error:", err);
    alert("Failed: " + err.message);
  });
}
