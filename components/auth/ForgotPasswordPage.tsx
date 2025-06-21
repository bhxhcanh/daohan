
import React, { useState } from 'react';
import { authService } from '../../services/authService'; // Assuming authService will have these methods
import Input from '../ui/Input';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface ForgotPasswordPageProps {
  onSwitchToLogin: () => void;
}

type ForgotPasswordStep = 'enterEmail' | 'enterOtpAndPassword' | 'success' | 'error';

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onSwitchToLogin }) => {
  const [step, setStep] = useState<ForgotPasswordStep>('enterEmail');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');


  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    
    const response = await authService.requestPasswordOtp(email);
    setIsLoading(false);

    if (response.success) {
      setStep('enterOtpAndPassword');
      setMessage(response.message || 'OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến (và thư rác).');
      setModalTitle('Yêu Cầu OTP Thành Công');
      setShowModal(true); // Show modal for initial OTP sent message
    } else {
      setStep('error');
      setMessage(response.error || 'Không thể gửi OTP. Vui lòng thử lại.');
      setModalTitle('Lỗi');
      setShowModal(true);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setMessage('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      setModalTitle('Lỗi');
      setStep('error'); // Keep user on OTP page but show error
      setShowModal(true);
      return;
    }
    setIsLoading(true);
    setMessage(null);

    const response = await authService.verifyOtpAndResetPassword(email, otp, newPassword);
    setIsLoading(false);

    if (response.success) {
      setStep('success');
      setMessage(response.message || 'Mật khẩu của bạn đã được đặt lại thành công. Vui lòng đăng nhập bằng mật khẩu mới.');
      setModalTitle('Thành Công');
      setShowModal(true);
    } else {
      setStep('error'); // Keep user on OTP page but show error
      setMessage(response.error || 'Không thể đặt lại mật khẩu. OTP không hợp lệ hoặc đã hết hạn.');
      setModalTitle('Lỗi');
      setShowModal(true);
    }
  };

  const closeModalAndProceed = () => {
    setShowModal(false);
    setMessage(null); // Clear message after modal closes
    if (step === 'success') {
      onSwitchToLogin();
    } else if (step === 'error' && !message?.includes('không khớp')) { 
      // if it was a general error, not mismatch, stay to retry or go back
      // if it was OTP sent success, stay on enterOtpAndPassword
       setStep(prevStep => prevStep === 'error' ? 'enterEmail' : prevStep); // reset to email if critical error, or stay if just otp message
    }
  }

  return (
    <>
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">Quên Mật Khẩu</h2>
        
        {step === 'enterEmail' && (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <p className="text-sm text-gray-600">Nhập địa chỉ email đã đăng ký của bạn. Chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.</p>
            <Input
              label="Email"
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              aria-required="true"
            />
            <Button type="submit" isLoading={isLoading} fullWidth variant="primary">
              {isLoading ? 'Đang gửi...' : 'Gửi Mã OTP'}
            </Button>
          </form>
        )}

        {step === 'enterOtpAndPassword' && (
          <form onSubmit={handleResetPassword} className="space-y-6">
             <p className="text-sm text-gray-600">Một mã OTP đã được gửi đến {email}. Nhập mã OTP và mật khẩu mới của bạn.</p>
            <Input
              label="Mã OTP"
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Nhập mã OTP"
              required
              aria-required="true"
            />
            <Input
              label="Mật khẩu mới"
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
              required
              aria-required="true"
            />
            <Input
              label="Xác nhận mật khẩu mới"
              id="confirmNewPassword"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu mới"
              required
              aria-required="true"
            />
            <Button type="submit" isLoading={isLoading} fullWidth variant="primary">
              {isLoading ? 'Đang xử lý...' : 'Đặt Lại Mật Khẩu'}
            </Button>
          </form>
        )}
        
        <div className="text-sm text-center">
          <button onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:text-blue-500">
            Quay lại Đăng nhập
          </button>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={closeModalAndProceed}
        title={modalTitle}
      >
        <p>{message}</p>
      </Modal>
    </>
  );
};

export default ForgotPasswordPage;