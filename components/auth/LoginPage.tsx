
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

interface LoginPageProps {
  onSwitchToSignup: () => void;
  onSwitchToForgotPassword: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToSignup, onSwitchToForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Đổi tên từ cccd sang password
  const { login, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login(email, password); 
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800">Đăng Nhập</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          aria-required="true"
        />
        <Input
          label="Mật khẩu" 
          id="password"    
          type="password"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Nhập mật khẩu của bạn"
          required
          aria-required="true"
        />
        {error && <p role="alert" className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
        <Button type="submit" isLoading={isLoading} fullWidth variant="primary">
          {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
        </Button>
      </form>
      <div className="text-sm text-center flex flex-col space-y-2">
        <button onClick={onSwitchToSignup} className="font-medium text-blue-600 hover:text-blue-500">
          Chưa có tài khoản? Đăng ký
        </button>
        <button onClick={onSwitchToForgotPassword} className="font-medium text-gray-600 hover:text-gray-500 text-xs">
          Quên mật khẩu?
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
