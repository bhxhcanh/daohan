
const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbwupeI_-uhLqsnv1HiHAnQvjEojHpXra-tZoxJt_Md8-WesJxz8Eif3Vz9WpmOv3sXs/exec'
};

// Generate or retrieve a unique device ID for the browser
let deviceId = localStorage.getItem('bhyt_deviceId');
if (!deviceId) {
  deviceId = self.crypto.randomUUID ? self.crypto.randomUUID() : 'dev-' + Date.now() + Math.random().toString(36).substring(2);
  localStorage.setItem('bhyt_deviceId', deviceId);
}

let currentEmail = '';
let tempLoginCredentials = {}; // To hold email/password for the device verification step

async function logout() {
  const user = JSON.parse(localStorage.getItem('bhyt_user') || '{}');
  const sessionId = user.sessionId; // Get session ID from the user object

  if (sessionId) {
    const body = `action=logout&sessionId=${encodeURIComponent(sessionId)}`;
    try {
      // Send a request to the server to invalidate the session.
      // We use `fetch` with `keepalive` to increase the chance of the request being sent even if the page is closing.
      // We don't need to wait for the response (`await`) because we will log out on the client side regardless.
      fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body,
        keepalive: true
      });
    } catch (error) {
      // Log the error but proceed with client-side logout anyway
      console.error("Error during server-side logout call:", error);
    }
  }

  // Always clear local storage and redirect the user
  localStorage.removeItem('bhyt_user');
  window.location.href = './index.html';
}


function hideAll() {
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('registerForm').classList.add('hidden');
  document.getElementById('forgotForm').classList.add('hidden');
  document.getElementById('resetForm').classList.add('hidden');
  document.getElementById('deviceOtpForm').classList.add('hidden');
}

function showLogin() {
  hideAll();
  document.getElementById('loginForm').classList.remove('hidden');
  tempLoginCredentials = {}; // Clear temp credentials when returning to login
}

function showRegister() {
  hideAll();
  document.getElementById('registerForm').classList.remove('hidden');
}

function showForgotPassword() {
  hideAll();
  document.getElementById('forgotForm').classList.remove('hidden');
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

  // Store credentials for potential device verification OTP step
  tempLoginCredentials = { email, password };
  
  const body = `action=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&deviceId=${encodeURIComponent(deviceId)}`;

  try {
    const res = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    });
    const data = await res.json();
    if (data.success) {
      // The returned user object (data.data) now includes the sessionId
      localStorage.setItem('bhyt_user', JSON.stringify(data.data));
      window.location.href = './main.html';
    } else if (data.requireOtp) {
        // New device flow
        const deviceOtpMessage = document.getElementById('deviceOtpMessage');
        deviceOtpMessage.className = 'mt-3 text-info';
        deviceOtpMessage.innerText = data.message;
        currentEmail = email; // Keep track of email
        hideAll();
        document.getElementById('deviceOtpForm').classList.remove('hidden');
    } else {
      loginMessage.innerText = data.error || 'Đăng nhập thất bại.';
    }
  } catch (error) {
    console.error("Login error:", error);
    loginMessage.innerText = 'Lỗi kết nối. Vui lòng thử lại.';
  }
}

async function handleDeviceVerification() {
    const otp = document.getElementById('deviceOtpCode').value.trim();
    const deviceOtpMessage = document.getElementById('deviceOtpMessage');
    deviceOtpMessage.innerText = '';

    if (!otp) {
        deviceOtpMessage.className = 'mt-3 text-danger';
        deviceOtpMessage.innerText = 'Vui lòng nhập mã OTP.';
        return;
    }
    if (!tempLoginCredentials.email || !tempLoginCredentials.password) {
        deviceOtpMessage.className = 'mt-3 text-danger';
        deviceOtpMessage.innerText = 'Phiên làm việc đã hết hạn. Vui lòng quay lại và đăng nhập.';
        return;
    }

    const deviceName = navigator.userAgent;
    const body = `action=verifyDeviceAndLogin&email=${encodeURIComponent(tempLoginCredentials.email)}&password=${encodeURIComponent(tempLoginCredentials.password)}&otp=${encodeURIComponent(otp)}&deviceId=${encodeURIComponent(deviceId)}&deviceName=${encodeURIComponent(deviceName)}`;

    try {
        const res = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body
        });
        const data = await res.json();
        if (data.success) {
            // The returned user object (data.data) now includes the sessionId
            localStorage.setItem('bhyt_user', JSON.stringify(data.data));
            window.location.href = './main.html';
        } else {
            deviceOtpMessage.className = 'mt-3 text-danger';
            deviceOtpMessage.innerText = data.error || 'Xác thực thất bại.';
        }
    } catch (error) {
        console.error("Device verification error:", error);
        deviceOtpMessage.className = 'mt-3 text-danger';
        deviceOtpMessage.innerText = 'Lỗi kết nối. Vui lòng thử lại.';
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
    
    if (data.success) {
      forgotMessage.className = 'mt-3 text-success';
      forgotMessage.innerText = data.message;
      hideAll();
      document.getElementById('resetForm').classList.remove('hidden');
    } else {
      forgotMessage.className = 'mt-3 text-danger';
      forgotMessage.innerText = data.error;
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
    if (data.success) {
        alert(data.message || 'Đặt lại mật khẩu thành công!');
        resetMessage.innerText = '';
        showLogin();
    } else {
       resetMessage.innerText = data.error || data.message;
    }
  } catch (error) {
    console.error("Reset password error:", error);
    resetMessage.innerText = 'Lỗi kết nối. Vui lòng thử lại.';
  }
}

// Attach event listeners after the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const loginPasswordInput = document.getElementById('loginPassword');
  const regPasswordInput = document.getElementById('regPassword');

  if (loginPasswordInput) {
    loginPasswordInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleLogin();
      }
    });
  }

  if (regPasswordInput) {
    regPasswordInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleRegister();
      }
    });
  }
  // Show the login form by default
  showLogin();
});
