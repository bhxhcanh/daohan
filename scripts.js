// scripts.js
const CONFIG = {
  API_URL: '___REPLACE_WITH_YOUR_WEB_APP_URL___' // <-- Bạn cần thay bằng URL Web App thật
};

let user = null;
if (localStorage.getItem('bhyt_user')) {
  user = JSON.parse(localStorage.getItem('bhyt_user'));
}

function logout() {
  localStorage.removeItem('bhyt_user');
  window.location.href = './index.html';
}

// ========== ĐĂNG NHẬP ==========
async function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const res = await fetch(CONFIG.API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'login', payload: { email, password } }),
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();
  if (data.success) {
    localStorage.setItem('bhyt_user', JSON.stringify(data.data));
    window.location.href = './main.html';
  } else {
    document.getElementById('loginMessage').innerText = data.error;
  }
}

// ========== ĐĂNG KÝ ==========
async function handleRegister() {
  const email = document.getElementById('regEmail').value.trim();
  const fullName = document.getElementById('regName').value.trim();
  const cccd = document.getElementById('regCCCD').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const res = await fetch(CONFIG.API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'signup', payload: { email, fullName, cccd, password } }),
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();
  document.getElementById('registerMessage').innerText = data.message || data.error;
}

// ========== QUÊN MẬT KHẨU ==========
let currentEmail = '';
async function handleForgot() {
  const email = document.getElementById('forgotEmail').value.trim();
  currentEmail = email;
  const res = await fetch(CONFIG.API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'requestPasswordOtp', payload: { email } }),
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();
  document.getElementById('forgotMessage').innerText = data.message || data.error;
  if (data.success) {
    document.getElementById('forgotForm').classList.add('hidden');
    document.getElementById('resetForm').classList.remove('hidden');
  }
}

// ========== ĐẶT LẠI MẬT KHẨU ==========
async function handleResetPassword() {
  const otp = document.getElementById('otpCode').value.trim();
  const newPassword = document.getElementById('newPassword').value.trim();
  const res = await fetch(CONFIG.API_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'verifyOtpAndResetPassword', payload: { email: currentEmail, otp, newPassword } }),
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();
  document.getElementById('resetMessage').innerText = data.message || data.error;
}

// ========== HIỂN THỊ FORM ==========
function showRegister() {
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('registerForm').classList.remove('hidden');
}
function showLogin() {
  document.querySelectorAll('.hidden').forEach(el => el.classList.add('hidden'));
  document.getElementById('loginForm').classList.remove('hidden');
}
function showForgotPassword() {
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('forgotForm').classList.remove('hidden');
}

// ========== TẢI DỮ LIỆU PHÂN TRANG ==========
async function loadData(type) {
  document.getElementById('loading').innerText = 'Đang tải dữ liệu...';
  document.getElementById('dataBody').innerHTML = '';
  if (!user || !user.cccd) return logout();

  const payload = {
    action: 'fetchBHYTData',
    payload: {
      filterType: type,
      userCCCD: user.cccd
    }
  };
  if (type === 'byMonth') {
    const month = document.getElementById('monthSelect').value;
    if (!month) return;
    payload.payload.month = month;
    payload.payload.year = new Date().getFullYear();
  }

  try {
    const res = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      const rows = data.data.map(row => `
        <tr>
          <td>${row.hoTen}</td>
          <td>${row.ngaySinh}</td>
          <td>${row.hanTheTu}</td>
          <td>${row.hanTheDen}</td>
          <td>${row.soDienThoai}</td>
          <td>${row.diaChiLh}</td>
          <td>${row.maPb}</td>
          <td>${row.maBv}</td>
        </tr>
      `).join('');
      document.getElementById('dataBody').innerHTML = rows || '<tr><td colspan="8">Không có dữ liệu</td></tr>';
    } else {
      document.getElementById('dataBody').innerHTML = `<tr><td colspan="8">${data.error}</td></tr>`;
    }
  } catch (err) {
    document.getElementById('dataBody').innerHTML = `<tr><td colspan="8">Lỗi hệ thống</td></tr>`;
  }
  document.getElementById('loading').innerText = '';
}
