
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
        setAuthState({
          user,
          isLoading: false,
          error: null,
          isAuthenticated: true,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Failed to load user from storage:", error);
      setAuthState(prev => ({ ...prev, isLoading: false, error: "Lỗi tải dữ liệu người dùng." }));
      localStorage.removeItem('bhytUser');
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const login = useCallback(async (email: string, passwordAttempt: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    const response = await authService.login(email, passwordAttempt);
    if (response.success && response.data) {
      localStorage.setItem('bhytUser', JSON.stringify(response.data));
      setAuthState({
        user: response.data,
        isLoading: false,
        error: null,
        isAuthenticated: true,
      });
    } else {
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
        // Set error to response.message if signup is successful for modal display
        error: response.message || 'Đăng ký thành công. Vui lòng chờ phê duyệt.', 
        user: null, // User is not logged in yet after signup
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
    await authService.logout(); // This is client-side for now
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
