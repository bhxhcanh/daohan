
import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/auth/AuthPage';
import DashboardPage from './components/dashboard/DashboardPage';
import ApprovalPendingPage from './components/auth/ApprovalPendingPage';
import LoadingSpinner from './components/ui/LoadingSpinner';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner size="lg" text="Đang tải ứng dụng..." />
      </div>
    );
  }

  if (isAuthenticated && user) {
    if (user.status === 'Đồng ý') {
      return <DashboardPage />;
    } else if (user.status === 'Chờ phê duyệt') {
      return <ApprovalPendingPage />;
    } else if (user.status === 'Từ chối') {
      // User is authenticated but rejected. Logout and show AuthPage with error.
      // This case is typically handled by the login logic returning an error,
      // preventing the user from reaching an authenticated state if rejected.
      // If somehow a rejected user is in 'authenticated' state,
      // it implies an issue with state management or login flow.
      // For robustness, redirect to AuthPage or show a specific "Rejected" page.
      // The login service already prevents login for 'Từ chối' status.
      // This state should ideally not be reachable if login logic is correct.
      // If it is, ApprovalPendingPage can be adapted, or a specific "Rejected" page is better.
      // For now, ApprovalPendingPage might show if login somehow bypassed status check.
      // The current authService.login prevents this.
      return <ApprovalPendingPage />; // Or a new RejectedPage
    }
  }

  // If there's a login error (e.g. "Tài khoản bị từ chối"), AuthPage will display it.
  return <AuthPage />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
