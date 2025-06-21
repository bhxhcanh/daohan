
import React, { useState } from 'react';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ForgotPasswordPage from './ForgotPasswordPage'; 

type AuthView = 'login' | 'signup' | 'forgot_password';

const AuthPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  const switchToSignup = () => setCurrentView('signup');
  const switchToLogin = () => setCurrentView('login');
  const switchToForgotPassword = () => setCurrentView('forgot_password');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
      <div className="mb-8 text-center">
        <img src="https://vnnic.vn/sites/default/files/logo-bhxh_1.png" alt="App Logo - BHXH Việt Nam" className="w-24 h-24 mx-auto mb-4 p-2 bg-white rounded-full shadow-lg" />
        <h1 className="text-4xl font-bold text-white">Quản Lý Danh Sách BHYT</h1>
        <p className="text-blue-100 mt-2">Theo dõi và quản lý thông tin đáo hạn BHYT hiệu quả.</p>
      </div>
      {currentView === 'login' && <LoginPage onSwitchToSignup={switchToSignup} onSwitchToForgotPassword={switchToForgotPassword} />}
      {currentView === 'signup' && <SignupPage onSwitchToLogin={switchToLogin} />}
      {currentView === 'forgot_password' && <ForgotPasswordPage onSwitchToLogin={switchToLogin} />}
    </div>
  );
};

export default AuthPage;