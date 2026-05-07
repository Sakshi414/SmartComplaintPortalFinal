const BASE_URL = "http://localhost:5000/api";

document.addEventListener('DOMContentLoaded', checkAuth);

function checkAuth() {
  const token = localStorage.getItem('token');
  const profileLink = document.getElementById('profileLink');
  const loginLink = document.getElementById('loginLink');
  
  if (token && profileLink && loginLink) {
    profileLink.style.display = 'inline-block';
    loginLink.style.display = 'none';
  }
}

/* ================= REGISTER ================= */
const registerForm = document.querySelector("#registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  try {
    const res = await axios.post("http://localhost:5000/api/auth/register", {
      name,
      email,
      password
    });

    alert(res.data.message); // show success
  } catch (error) {
    alert(error.response.data.message || "Something went wrong");
  }
});

/* ================= LOGIN ================= */
function login() {
  fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    } else {
      alert(data.message);
    }
  });
}


/* ================= COMPLAINT SUBMIT ================= */
const complaintForm = document.getElementById("complaintForm");

if (complaintForm) {
  complaintForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const complaintData = {
      category: document.getElementById("category").value,
      description: document.getElementById("description").value
    };

    const res = await fetch(`${BASE_URL}/complaints`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(complaintData)
    });

    const data = await res.json();
    alert("Complaint submitted. ID: " + data.complaintId);
  });
}

/* ================= TRACK COMPLAINT ================= */
async function trackComplaint() {
  const id = document.getElementById("complaintId").value;

  const res = await fetch(`${BASE_URL}/complaints/${id}`);
  const data = await res.json();

  document.getElementById("status").innerText =
    "Status: " + data.status;
}

/* ================= LOAD SERVICES ================= */
const servicesDiv = document.getElementById("servicesList");

if (servicesDiv) {
  fetch(`${BASE_URL}/services`)
    .then(res => res.json())
    .then(services => {
      services.forEach(service => {
        servicesDiv.innerHTML += `
          <div class="service-item">
            <h3>${service.name}</h3>
            <button onclick="applyService('${service.name}')">Apply</button>
          </div>
        `;
      });
    });
}

/* ================= APPLY SERVICE ================= */
async function applyService(serviceName) {
  const res = await fetch(`${BASE_URL}/services/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ service: serviceName })
  });

  const data = await res.json();
  alert(data.message);
}
