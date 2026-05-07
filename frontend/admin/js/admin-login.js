function showRegister() {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("registerForm").classList.remove("hidden");
}

function showLogin() {
  document.getElementById("registerForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
}

function register() {
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const errorEl = document.getElementById("regError");
  const successEl = document.getElementById("regSuccess");

  // Clear previous messages
  if (errorEl) errorEl.textContent = "";
  if (successEl) successEl.textContent = "";

  if (!name || !email || !password) {
    if (errorEl) errorEl.textContent = "Please fill in all fields";
    return;
  }

  console.log("Attempting registration to http://localhost:5000/api/admin/auth/register");

  fetch("http://localhost:5000/api/admin/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password
    })
  })
  .then(res => {
    console.log("Response status:", res.status);
    if (!res.ok) {
      return res.json().then(err => {
        throw new Error(err.message || "Registration failed");
      });
    }
    return res.json();
  })
  .then(data => {
    console.log("Registration response:", data);
    if (successEl) successEl.textContent = "Registration successful! Please login.";
    // Clear form
    document.getElementById("regName").value = "";
    document.getElementById("regEmail").value = "";
    document.getElementById("regPassword").value = "";
    // Switch to login after 1.5 seconds
    setTimeout(() => {
      showLogin();
    }, 1500);
  })
  .catch(err => {
    console.error("Registration error:", err);
    if (errorEl) errorEl.textContent = err.message;
  });
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorEl = document.getElementById("error");

  // Clear previous errors
  if (errorEl) errorEl.textContent = "";

  if (!email || !password) {
    if (errorEl) errorEl.textContent = "Please enter email and password";
    return;
  }

  console.log("Attempting login to http://localhost:5000/api/admin/auth/login");

  fetch("http://localhost:5000/api/admin/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  .then(res => {
    console.log("Response status:", res.status);
    if (!res.ok) {
      return res.json().then(err => {
        throw new Error(err.message || "Login failed");
      });
    }
    return res.json();
  })
  .then(data => {
    console.log("Login response:", data);
    if (data.token) {
      localStorage.setItem("adminToken", data.token);
      window.location.href = "admin-dashboard.html";
    } else {
      if (errorEl) errorEl.textContent = "Login failed: No token received";
    }
  })
  .catch(err => {
    console.error("Login error:", err);
    if (errorEl) errorEl.textContent = "Login failed: " + err.message;
  });
}
