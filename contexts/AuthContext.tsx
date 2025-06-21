
import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import { User, AuthState, AuthContextType, SignupData } from '../types';
import { authService } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
    isAuthenticated: false,
  });

  const loadUserFromStorage = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('bhytUser');
      if (storedUser) {
        const user: User = JSON.parse(storedUser);
        // Kiểm tra kỹ hơn cấu trúc user object
        if (user && typeof user.id === 'string' && 
            typeof user.email === 'string' && 
            typeof user.fullName === 'string' &&
            typeof user.cccd === 'string' &&
            ['Chờ phê duyệt', 'Đồng ý', 'Từ chối'].includes(user.status)) {
          setAuthState({
            user,
            isLoading: false,
            error: null,
            isAuthenticated: true,
          });
        } else {
          // Dữ liệu người dùng trong localStorage không hợp lệ
          console.warn("Invalid user data found in localStorage.");
          localStorage.removeItem('bhytUser');
          setAuthState(prev => ({ ...prev, isLoading: false, user: null, isAuthenticated: false }));
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Failed to load user from storage (e.g., JSON parsing error):", error);
      localStorage.removeItem('bhytUser'); // Xóa dữ liệu lỗi
      setAuthState(prev => ({ ...prev, isLoading: false, error: "Lỗi tải dữ liệu người dùng từ bộ nhớ cục bộ.", user: null, isAuthenticated: false }));
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const login = useCallback(async (email: string, passwordAttempt: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    const response = await authService.login(email, passwordAttempt);
    if (response.success && response.data) {
      // Kiểm tra status trước khi lưu và set state
      if (response.data.status === 'Đồng ý' || response.data.status === 'Chờ phê duyệt') {
        localStorage.setItem('bhytUser', JSON.stringify(response.data));
        setAuthState({
          user: response.data,
          isLoading: false,
          error: null,
          isAuthenticated: true,
        });
      } else { // Tài khoản bị từ chối hoặc trạng thái không xác định không nên đăng nhập
        localStorage.removeItem('bhytUser');
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || `Tài khoản của bạn ở trạng thái "${response.data.status}" và không thể đăng nhập.`,
          user: null,
          isAuthenticated: false,
        }));
      }
    } else {
      localStorage.removeItem('bhytUser'); // Xóa user nếu đăng nhập thất bại
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: response.error || 'Đăng nhập thất bại.',
        user: null,
        isAuthenticated: false,
      }));
    }
  }, []);

  const signup = useCallback(async (userData: SignupData) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    const response = await authService.signup(userData);
    if (response.success) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: response.message || 'Đăng ký thành công. Vui lòng chờ phê duyệt.', 
        user: null, 
        isAuthenticated: false,
      }));
    } else {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: response.error || 'Đăng ký thất bại.',
      }));
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    await authService.logout(); 
    localStorage.removeItem('bhytUser');
    setAuthState({
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    });
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, signup, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
