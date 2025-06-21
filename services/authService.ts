
import { User, ApiResponse, SignupData } from '../types';

// Simulate API calls to a GAS backend
// const API_BASE_URL = 'YOUR_GAS_WEB_APP_URL'; // Replace with your actual GAS web app URL

let MOCK_USERS: User[] = [
  // Example approved user for testing (if needed, but GAS will handle this)
  // { id: 'user-approved-test', email: 'test@example.com', fullName: 'Test User Approved', cccd: '111222333444', password: 'password123', status: 'Đồng ý', token: 'fake-approved-token' }
];
let MOCK_OTPS: { email: string; otp: string; expires: number }[] = [];

export const authService = {
  login: async (email: string, passwordAttempt: string): Promise<ApiResponse<User>> => {
    console.log(`Simulating login for email: ${email}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = MOCK_USERS.find(u => u.email === email && u.password === passwordAttempt);

    if (user) {
      if (user.status === 'Đồng ý') {
        return { success: true, data: { ...user, token: `fake-token-${user.id}` } };
      } else if (user.status === 'Chờ phê duyệt') {
        return { success: false, error: 'Tài khoản của bạn đang chờ phê duyệt. Vui lòng thử lại sau.' };
      } else if (user.status === 'Từ chối') {
        return { success: false, error: 'Tài khoản của bạn đã bị từ chối. Vui lòng liên hệ quản trị viên.' };
      } else {
         return { success: false, error: 'Trạng thái tài khoản không xác định.' };
      }
    } else {
      return { success: false, error: 'Email hoặc Mật khẩu không đúng.' };
    }
  },

  signup: async (userData: SignupData): Promise<ApiResponse<null>> => {
    console.log('Simulating signup for:', { email: userData.email, fullName: userData.fullName, cccd: userData.cccd });
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (MOCK_USERS.some(u => u.email === userData.email)) {
      return { success: false, error: 'Email này đã được sử dụng.' };
    }
    if (MOCK_USERS.some(u => u.cccd === userData.cccd)) {
      return { success: false, error: 'Số CCCD này đã được sử dụng.' };
    }
    
    const newUser: User = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2,7)}`,
        email: userData.email,
        fullName: userData.fullName,
        cccd: userData.cccd,
        password: userData.password, // Store password (mock only, GAS should handle securely)
        status: 'Chờ phê duyệt', // Default status
    };
    MOCK_USERS.push(newUser);
    console.log("Mock Users after signup:", MOCK_USERS);
    // In real app, GAS would save this to Users sheet and send an email to admin.
    return { success: true, message: 'Đăng ký thành công. Tài khoản của bạn đang chờ quản trị viên phê duyệt. Bạn sẽ nhận được email thông báo khi tài khoản được xử lý.' };
  },

  logout: async (): Promise<ApiResponse<null>> => {
    console.log('Simulating logout');
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  requestPasswordOtp: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    console.log(`Simulating OTP request for email: ${email}`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // User must exist and be approved to request OTP
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      return { success: false, error: 'Email không tồn tại.' };
    }
    if (user.status !== 'Đồng ý') {
        return { success: false, error: 'Tài khoản này không thể yêu cầu OTP (chưa được phê duyệt hoặc đã bị từ chối).' };
    }


    const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
    const expires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    MOCK_OTPS = MOCK_OTPS.filter(o => o.email !== email); 
    MOCK_OTPS.push({ email, otp, expires });

    console.log(`Mock OTP for ${email}: ${otp}`); 
    return { success: true, message: `Một mã OTP ( ${otp} ) đã được gửi (mô phỏng) đến ${email}. Mã này sẽ hết hạn sau 10 phút.` };
  },

  verifyOtpAndResetPassword: async (email: string, otp: string, newPassword: string): Promise<ApiResponse<{ message: string }>> => {
    console.log(`Simulating OTP verification and password reset for email: ${email}`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const otpEntry = MOCK_OTPS.find(o => o.email === email && o.otp === otp);
    if (!otpEntry) {
      return { success: false, error: 'Mã OTP không hợp lệ.' };
    }
    if (Date.now() > otpEntry.expires) {
      MOCK_OTPS = MOCK_OTPS.filter(o => o.email !== email); 
      return { success: false, error: 'Mã OTP đã hết hạn.' };
    }

    const userIndex = MOCK_USERS.findIndex(u => u.email === email);
    if (userIndex === -1) {
      return { success: false, error: 'Không tìm thấy người dùng để cập nhật mật khẩu.' };
    }
    // Ensure user is still approved (though OTP request should have checked this)
     if (MOCK_USERS[userIndex].status !== 'Đồng ý') {
        return { success: false, error: 'Tài khoản này không thể đặt lại mật khẩu.' };
    }


    MOCK_USERS[userIndex].password = newPassword; 
    MOCK_OTPS = MOCK_OTPS.filter(o => o.email !== email); 

    console.log(`Password for ${email} has been reset to: ${newPassword}`);
    return { success: true, message: 'Mật khẩu đã được đặt lại thành công.' };
  },
};
