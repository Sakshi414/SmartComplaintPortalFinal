// 🔐 CHECK LOGIN
const token = localStorage.getItem("token");

if (!token) {
  alert("Please login first");
  window.location.href = "../login.html";
}

// 🔥 FETCH USER DATA
async function loadProfile() {
  try {
    const res = await fetch("http://localhost:5000/api/user/profile", {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const data = await res.json();

    // Fill UI
    document.getElementById("name").innerText = data.name;
    document.getElementById("email").innerText = data.email;

    document.getElementById("userName").innerText = data.name;
    document.getElementById("userEmail").innerText = data.email;
    document.getElementById("userPhone").innerText = data.phone;
    document.getElementById("userArea").innerText = data.area;
    document.getElementById("userCity").innerText = data.city;
    document.getElementById("userPincode").innerText = data.pincode;

  } catch (err) {
    console.error(err);
    alert("Failed to load profile");
  }
}

loadProfile();


// 🔄 NAVIGATION
function goTo(page) {
  window.location.href = page;
}


// 🚪 LOGOUT
function logout() {
  localStorage.removeItem("token");
  alert("Logged out successfully");
  window.location.href = "../login.html";
}