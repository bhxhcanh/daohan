const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbwupeI_-uhLqsnv1HiHAnQvjEojHpXra-tZoxJt_Md8-WesJxz8Eif3Vz9WpmOv3sXs/exec'
};

let currentEmail = '';

function logout() {
  localStorage.removeItem('bhyt_user');
  window.location.href = './index.html';
}

async function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const body = `action=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

  const res = await fetch(CONFIG.API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body
  });
  const data = await res.json();
  if (data.success) {
    localStorage.setItem('bhyt_user', JSON.stringify(data.data));
    window.location.href = './main.html';
  } else {
    document.getElementById('loginMessage').innerText = data.error;
  }
}

async function handleRegister() {
  const email = document.getElementById('regEmail').value.trim();
  const fullName = document.getElementById('regName').value.trim();
  const cccd = document.getElementById('regCCCD').value.trim();
  const password = document.getElementById('regPassword').value.trim();

  const body = `action=signup&email=${encodeURIComponent(email)}&fullName=${encodeURIComponent(fullName)}&cccd=${encodeURIComponent(cccd)}&password=${encodeURIComponent(password)}`;

  const res = await fetch(CONFIG.API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body
  });
  const data = await res.json();
  if (data.success) {
    alert(data.message || 'Đăng ký thành công!');
    showLogin();
  } else {
    document.getElementById('registerMessage').innerText = data.error || 'Đăng ký thất bại.';
  }
}

async function handleForgot() {
  const email = document.getElementById('forgotEmail').value.trim();
  currentEmail = email;
  const body = `action=requestPasswordOtp&email=${encodeURIComponent(email)}`;

  const res = await fetch(CONFIG.API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body
  });
  const data = await res.json();
  document.getElementById('forgotMessage').innerText = data.message || data.error;
  if (data.success) {
    document.getElementById('forgotForm').classList.add('hidden');
    document.getElementById('resetForm').classList.remove('hidden');
  }
}

async function handleResetPassword() {
  const otp = document.getElementById('otpCode').value.trim();
  const newPassword = document.getElementById('newPassword').value.trim();
  const body = `action=verifyOtpAndResetPassword&email=${encodeURIComponent(currentEmail)}&otp=${encodeURIComponent(otp)}&newPassword=${encodeURIComponent(newPassword)}`;

  const res = await fetch(CONFIG.API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body
  });
  const data = await res.json();
  document.getElementById('resetMessage').innerText = data.message || data.error;
}
