function login() {
  const btn = document.getElementById('loginBtn') || document.querySelector('.btn-register');
  const msg = document.getElementById('msg');
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // Clear previous message
  msg.className = '';
  msg.textContent = '';

  // Validation
  if (!email || !password) {
    showMsg('All fields are required', 'error');
    return;
  }

  // Loading state
  if (btn) {
    btn.textContent = 'Signing In...';
    btn.classList.add('loading');
    btn.disabled = true;
  }

  fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (btn) {
      btn.textContent = 'Sign In';
      btn.classList.remove('loading');
      btn.disabled = false;
    }

    if (!data.token) {
      throw new Error(data.message || 'Login failed');
    }

    localStorage.setItem('token', data.token);
    showMsg('Login successful! Redirecting...', 'success');
    
    setTimeout(() => location.href = 'index.html', 1500);
  })
  .catch(err => {
    if (btn) {
      btn.textContent = 'Sign In';
      btn.classList.remove('loading');
      btn.disabled = false;
    }
    showMsg(err.message || 'Login failed', 'error');
  });
}

function showMsg(text, type) {
  const msg = document.getElementById('msg');
  msg.textContent = text;
  msg.className = `show ${type}`;
  
  setTimeout(() => msg.className = '', 5000);
}
