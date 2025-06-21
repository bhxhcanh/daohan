
import { User, ApiResponse, SignupData } from '../types';

// !!! IMPORTANT: Replace this with your actual Google Apps Script Web App URL !!!
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbwupeI_-uhLqsnv1HiHAnQvjEojHpXra-tZoxJt_Md8-WesJxz8Eif3Vz9WpmOv3sXs/exec'; 

export const authService = {
  login: async (email: string, passwordAttempt: string): Promise<ApiResponse<User>> => {
    console.log(`Attempting login for email: ${email}`);
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          payload: { email, password: passwordAttempt },
        }),
      });

      const result: ApiResponse<User> = await response.json();
      console.log('Login API Response:', result);
      return result;

    } catch (error) {
      console.error('Login API Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Lỗi mạng hoặc không thể kết nối đến máy chủ.';
      return { success: false, error: `Đăng nhập thất bại: ${errorMessage}` };
    }
  },

  signup: async (userData: SignupData): Promise<ApiResponse<null | { message: string }>> => {
    console.log('Attempting signup for:', { email: userData.email, fullName: userData.fullName, cccd: userData.cccd });
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'signup',
          payload: userData,
        }),
      });

      const result: ApiResponse<null | { message: string }> = await response.json();
       console.log('Signup API Response:', result);
      // The signup response from GAS might include a message directly
      if (result.success && result.message) {
         return { success: true, message: result.message };
      } else if (!result.success && result.error) {
         return { success: false, error: result.error };
      }
      return result; // Or handle more specific structures if needed

    } catch (error) {
      console.error('Signup API Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Lỗi mạng hoặc không thể kết nối đến máy chủ.';
      return { success: false, error: `Đăng ký thất bại: ${errorMessage}` };
    }
  },

  logout: async (): Promise<ApiResponse<null>> => {
    console.log('Simulating logout (client-side state clearing)');
    // Logout is primarily a client-side state clearing operation.
    // No backend call is defined in Code.gs for logout.
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate minor delay
    return { success: true };
  },

  requestPasswordOtp: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    console.log(`Attempting OTP request for email: ${email}`);
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'requestPasswordOtp',
          payload: { email },
        }),
      });
      const result: ApiResponse<{ message: string }> = await response.json();
      console.log('Request OTP API Response:', result);
      return result;
    } catch (error) {
      console.error('Request OTP API Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Lỗi mạng hoặc không thể kết nối đến máy chủ.';
      return { success: false, error: `Yêu cầu OTP thất bại: ${errorMessage}` };
    }
  },

  verifyOtpAndResetPassword: async (email: string, otp: string, newPassword: string): Promise<ApiResponse<{ message: string }>> => {
    console.log(`Attempting OTP verification and password reset for email: ${email}`);
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'verifyOtpAndResetPassword',
          payload: { email, otp, newPassword },
        }),
      });
      const result: ApiResponse<{ message: string }> = await response.json();
      console.log('Reset Password API Response:', result);
      return result;
    } catch (error) {
      console.error('Reset Password API Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Lỗi mạng hoặc không thể kết nối đến máy chủ.';
      return { success: false, error: `Đặt lại mật khẩu thất bại: ${errorMessage}` };
    }
  },
};
