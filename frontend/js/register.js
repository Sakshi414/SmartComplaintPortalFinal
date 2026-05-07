function register() {
  const btn = document.getElementById('registerBtn');
  const msg = document.getElementById('msg');
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  // Clear previous message
  msg.className = '';
  msg.textContent = '';

  // Validation
  if (!name || !email || !password) {
    showMsg('All fields are required', 'error');
    return;
  }

  if (password.length < 6) {
    showMsg('Password must be at least 6 characters', 'error');
    return;
  }

  // Loading state
  btn.textContent = 'Creating...';
  btn.classList.add('loading');
  btn.disabled = true;

  fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })
  .then(res => res.json())
  .then(data => {
    btn.textContent = 'Get Started';
    btn.classList.remove('loading');
    btn.disabled = false;

    showMsg(data.message, data.message.includes('success') ? 'success' : 'error');

    if (data.message === 'User registered successfully') {
      setTimeout(() => location.href = 'login.html', 1500);
    }
  })
  .catch(err => {
    btn.textContent = 'Get Started';
    btn.classList.remove('loading');
    btn.disabled = false;
    showMsg('Network error. Please try again.', 'error');
    console.error('Register error:', err);
  });
}

function showMsg(text, type) {
  const msg = document.getElementById('msg');
  msg.textContent = text;
  msg.className = `show ${type}`;
  
  // Auto hide after 5s
  setTimeout(() => {
    msg.className = '';
  }, 5000);
}

// Real-time validation
document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      if (!this.value.trim()) {
        this.style.borderColor = 'rgba(239,68,68,0.6)';
      } else {
        this.style.borderColor = 'rgba(168,85,247,0.6)';
      }
    });
  });
});
