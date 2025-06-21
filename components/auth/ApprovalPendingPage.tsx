
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const ApprovalPendingPage: React.FC = () => {
  const { user, logout } = useAuth();

  let title = "Tài Khoản Đang Chờ Phê Duyệt";
  let message = `Tài khoản của bạn (${user?.email}) đã được đăng ký và đang chờ quản trị viên phê duyệt. 
                 Bạn sẽ không thể truy cập vào các tính năng chính cho đến khi tài khoản được kích hoạt. 
                 Vui lòng kiểm tra lại sau hoặc liên hệ quản trị viên.`;
  let iconColor = "text-yellow-500";
  let iconPath = "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"; // Clock icon

  if (user?.status === 'Từ chối') {
    title = "Tài Khoản Bị Từ Chối";
    message = `Rất tiếc, tài khoản của bạn (${user?.email}) đã bị từ chối phê duyệt. 
               Vui lòng liên hệ quản trị viên để biết thêm chi tiết.`;
    iconColor = "text-red-500";
    iconPath = "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"; // X Circle / Ban icon
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 p-4 text-center">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-2xl max-w-lg">
        <svg className={`w-20 h-20 ${iconColor} mx-auto mb-6`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath}></path>
        </svg>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
        <p className="text-gray-700 mb-2">
          Xin chào, {user?.fullName || 'bạn'}!
        </p>
        <p className="text-gray-600 mb-8 text-lg whitespace-pre-line">
          {message}
        </p>
        <Button onClick={logout} variant="primary" size="lg">
          Đăng xuất
        </Button>
      </div>
       <footer className="text-center mt-12 text-sm text-gray-700 opacity-80">
        <p>&copy; {new Date().getFullYear()} BHYT Management App.</p>
      </footer>
    </div>
  );
};

export default ApprovalPendingPage;
