
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { SignupData } from '../../types';

interface SignupPageProps {
  onSwitchToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [cccd, setCccd] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const { signup, isLoading, error, clearError } = useAuth();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError(null);

    if (password !== confirmPassword) {
      setValidationError('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }
    if (password.length < 6) {
      setValidationError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    const signupData: SignupData = { email, fullName, cccd, password };
    await signup(signupData);
  };
  
  React.useEffect(() => {
    if (error && error.includes("Đăng ký thành công")) {
        setModalMessage(error);
        setShowSuccessModal(true);
    }
  }, [error]);


  return (
    <>
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">Đăng Ký Tài Khoản</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            autoComplete="email"
          />
          <Input
            label="Họ và Tên"
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nguyễn Văn A"
            required
            autoComplete="name"
          />
          <Input
            label="Số CCCD"
            id="signup-cccd"
            type="text" 
            value={cccd}
            onChange={(e) => setCccd(e.target.value)}
            placeholder="12 chữ số trên CCCD"
            maxLength={12}
            minLength={12}
            pattern="\d{12}"
            title="Số CCCD phải gồm 12 chữ số."
            required
            autoComplete="off"
          />
          <Input
            label="Mật khẩu"
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ít nhất 6 ký tự"
            required
            minLength={6}
            autoComplete="new-password"
          />
          <Input
            label="Xác nhận Mật khẩu"
            id="signup-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu"
            required
            minLength={6}
            autoComplete="new-password"
          />
          {validationError && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{validationError}</p>}
          {error && !error.includes("Đăng ký thành công") && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
          
          <Button type="submit" isLoading={isLoading} fullWidth variant="primary" className="mt-2">
            {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
          </Button>
        </form>
        <div className="text-sm text-center mt-6">
          <button onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:text-blue-500">
            Đã có tài khoản? Đăng nhập
          </button>
        </div>
      </div>
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
            setShowSuccessModal(false);
            clearError(); 
            onSwitchToLogin(); 
        }}
        title="Thông Báo Đăng Ký"
      >
        <p>{modalMessage}</p>
      </Modal>
    </>
  );
};

export default SignupPage;
