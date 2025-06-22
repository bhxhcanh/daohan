
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
  const loginMessage = document.getElementById('loginMessage');
  loginMessage.innerText = ''; // Clear previous messages

  if (!email || !password) {
    loginMessage.innerText = 'Vui lòng nhập email và mật khẩu.';
    return;
  }

  const body = `action=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

  try {
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
      loginMessage.innerText = data.error || 'Đăng nhập thất bại.';
    }
  } catch (error) {
    console.error("Login error:", error);
    loginMessage.innerText = 'Lỗi kết nối. Vui lòng thử lại.';
  }
}

async function handleRegister() {
  const email = document.getElementById('regEmail').value.trim();
  const fullName = document.getElementById('regName').value.trim();
  const cccd = document.getElementById('regCCCD').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const registerMessage = document.getElementById('registerMessage');
  registerMessage.innerText = ''; // Clear previous messages

  // Validations
  if (!email || !fullName || !cccd || !password) {
    registerMessage.innerText = 'Vui lòng điền đầy đủ thông tin.';
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    registerMessage.innerText = 'Định dạng email không hợp lệ.';
    return;
  }

  const cccdRegex = /^\d{12}$/;
  if (!cccdRegex.test(cccd)) {
    registerMessage.innerText = 'Số CCCD phải là 12 ký tự số.';
    return;
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    registerMessage.innerText = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ hoa và 1 chữ số.';
    return;
  }

  const body = `action=signup&email=${encodeURIComponent(email)}&fullName=${encodeURIComponent(fullName)}&cccd=${encodeURIComponent(cccd)}&password=${encodeURIComponent(password)}`;

  try {
    const res = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    });
    const data = await res.json();
    if (data.success) {
      alert(data.message || 'Đăng ký thành công! Tài khoản của bạn đang chờ phê duyệt.');
      showLogin(); // Assuming showLogin() function exists in index.html to switch views
    } else {
      registerMessage.innerText = data.error || 'Đăng ký thất bại.';
    }
  } catch (error) {
    console.error("Registration error:", error);
    registerMessage.innerText = 'Lỗi kết nối. Vui lòng thử lại.';
  }
}

async function handleForgot() {
  const email = document.getElementById('forgotEmail').value.trim();
  const forgotMessage = document.getElementById('forgotMessage');
  forgotMessage.innerText = ''; // Clear previous messages

  if (!email) {
    forgotMessage.innerText = 'Vui lòng nhập email.';
    return;
  }
  currentEmail = email; // Store for reset password step
  const body = `action=requestPasswordOtp&email=${encodeURIComponent(email)}`;

  try {
    const res = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    });
    const data = await res.json();
    forgotMessage.innerText = data.message || data.error;
    if (data.success) {
      // Assuming showResetForm() function exists in index.html to switch views
      if (typeof hideAll === 'function' && document.getElementById('resetForm')) {
          hideAll();
          document.getElementById('resetForm').classList.remove('hidden');
      } else {
          alert('Vui lòng kiểm tra email để lấy OTP và nhập vào form tiếp theo (nếu có).');
      }
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    forgotMessage.innerText = 'Lỗi kết nối. Vui lòng thử lại.';
  }
}

async function handleResetPassword() {
  const otp = document.getElementById('otpCode').value.trim();
  const newPassword = document.getElementById('newPassword').value.trim();
  const resetMessage = document.getElementById('resetMessage');
  resetMessage.innerText = ''; // Clear previous messages

  if (!otp || !newPassword) {
    resetMessage.innerText = 'Vui lòng nhập OTP và mật khẩu mới.';
    return;
  }
  
  // Password validation (can reuse the one from register or a simpler one if needed)
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(newPassword)) {
    resetMessage.innerText = 'Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ hoa và 1 chữ số.';
    return;
  }


  const body = `action=verifyOtpAndResetPassword&email=${encodeURIComponent(currentEmail)}&otp=${encodeURIComponent(otp)}&newPassword=${encodeURIComponent(newPassword)}`;

  try {
    const res = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    });
    const data = await res.json();
    resetMessage.innerText = data.message || data.error;
    if (data.success) {
        alert(data.message || 'Đặt lại mật khẩu thành công!');
        if (typeof showLogin === 'function') {
            showLogin();
        }
    }
  } catch (error) {
    console.error("Reset password error:", error);
    resetMessage.innerText = 'Lỗi kết nối. Vui lòng thử lại.';
  }
}
