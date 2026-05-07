const token = localStorage.getItem("adminToken");

if (!token) {
  window.location.href = "admin-login.html";
}

fetch("http://localhost:5000/api/admin/users", {
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
  console.log("Users:", data);
  displayUsers(data);
})
.catch(err => {
  console.error("Users Error:", err);
  alert("Failed to load users data");
});

function displayUsers(users) {
  const container = document.getElementById("users-container");
  if (container) {
    container.innerHTML = users.map(user => `
      <div class="user-card">
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Role:</strong> ${user.role}</p>
        <button onclick="deleteUser('${user._id}')" class="delete-btn">Delete</button>
      </div>
    `).join("");
  }
}

function deleteUser(userId) {
  if (!confirm("Are you sure you want to delete this user?")) return;
  
  fetch(`http://localhost:5000/api/admin/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(res => {
    if (!res.ok) throw new Error("Failed to delete user");
    alert("User deleted successfully");
    location.reload();
  })
  .catch(err => {
    console.error("Delete error:", err);
    alert("Failed to delete user");
  });
}
