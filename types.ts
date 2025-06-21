
export interface User {
  id: string;
  email: string;
  fullName: string;
  cccd: string; // Số Căn Cước Công Dân
  status: 'Chờ phê duyệt' | 'Đồng ý' | 'Từ chối';
  token?: string; // Optional: token might be stored with user or separately
  password?: string; // Sẽ được gửi khi đăng ký, không nên lưu trữ ở client sau đó
}

// Dùng cho việc gửi dữ liệu đăng ký, mật khẩu là bắt buộc
export type SignupData = Pick<User, 'email' | 'fullName' | 'cccd'> & { password: string };


export interface BHYTRecord {
  id: string; // A unique ID for the record, can be row number or a generated ID
  maDvi?: string;
  maTinh?: string;
  maHuyen?: string;
  soBhxh?: string;
  hoTen: string;
  gioiTinh?: string;
  ngaySinh: string; // Date string, format YYYY-MM-DD or DD/MM/YYYY
  diaChiLh: string;
  maPb: string;
  maBv: string;
  hanTheTu: string; // Date string
  hanTheDen: string; // Date string
  soDienThoai?: string;
  // Add other fields from luykedstg if needed for display or logic
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean; // Derived from user !== null
  // isApproved is now derived from user.status
}

export interface AuthContextType extends AuthState {
  login: (email: string, passwordAttempt: string) => Promise<void>; 
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export enum BHYTFilterType {
  DUE_SOON = 'dueSoon', // +/- 30 days
  EXPIRED_RECENTLY = 'expiredRecently', // 30-90 days ago
  BY_MONTH = 'byMonth',
}

export interface BHYTFilterParams {
  filterType: BHYTFilterType;
  userCCCD?: string; // For filtering Tabs 1 and 3
  month?: string; // For Tab 3, format YYYY-MM
  year?: string; // For Tab 3
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}