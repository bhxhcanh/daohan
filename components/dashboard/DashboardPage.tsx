
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { dataService } from '../../services/dataService';
import { BHYTRecord, BHYTFilterType, User } from '../../types';
import BHYTTable from './BHYTTable';
import Tabs from '../ui/Tabs';
import Select from '../ui/Select';
import Button from '../ui/Button'; // For logout
import { getToday } from '../../utils/dateUtils';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth() as { user: User; logout: () => void }; // User is guaranteed here
  const [activeTab, setActiveTab] = useState<string>('dueSoon');
  const [bhytData, setBhytData] = useState<BHYTRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedMonth, setSelectedMonth] = useState<string>(`${getToday().getMonth() + 1}`.padStart(2,'0'));
  const [selectedYear, setSelectedYear] = useState<string>(`${getToday().getFullYear()}`);

  const fetchAndSetData = useCallback(async () => {
    if (!user?.cccd) return;

    setIsLoading(true);
    setError(null);
    setBhytData([]); // Clear previous data

    let filterParams;
    switch (activeTab) {
      case 'dueSoon':
        filterParams = { filterType: BHYTFilterType.DUE_SOON, userCCCD: user.cccd };
        break;
      case 'expiredRecently':
        filterParams = { filterType: BHYTFilterType.EXPIRED_RECENTLY }; // No CCCD filter
        break;
      case 'byMonth':
        filterParams = { 
          filterType: BHYTFilterType.BY_MONTH, 
          userCCCD: user.cccd,
          month: selectedMonth, // This is just month number e.g. "08"
          year: selectedYear 
        };
        break;
      default:
        setIsLoading(false);
        return;
    }

    const response = await dataService.fetchBHYTData(filterParams);
    if (response.success && response.data) {
      setBhytData(response.data);
    } else {
      setError(response.error || 'Không thể tải dữ liệu.');
    }
    setIsLoading(false);
  }, [activeTab, user?.cccd, selectedMonth, selectedYear]);

  useEffect(() => {
    fetchAndSetData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAndSetData]); // fetchAndSetData is memoized by useCallback with its dependencies

  const currentYear = getToday().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => ({
    value: `${currentYear - 5 + i}`,
    label: `${currentYear - 5 + i}`,
  }));

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: `${i + 1}`.padStart(2, '0'),
    label: `Tháng ${i + 1}`,
  }));


  const tabContents = {
    dueSoon: <BHYTTable records={bhytData} isLoading={isLoading} error={error} title="Danh sách sắp/vừa hết hạn (+-30 ngày)" />,
    expiredRecently: <BHYTTable records={bhytData} isLoading={isLoading} error={error} title="Danh sách đã hết hạn (30-90 ngày trước)" />,
    byMonth: (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg shadow">
          <Select
            label="Chọn Năm"
            options={yearOptions}
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          />
          <Select
            label="Chọn Tháng"
            options={monthOptions}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
          <div className="md:mt-7"> {/* Align button with selects */}
             {/* Button is part of useEffect dependency via fetchAndSetData->selectedMonth/Year */}
          </div>
        </div>
        <BHYTTable records={bhytData} isLoading={isLoading} error={error} title={`Danh sách hết hạn tháng ${selectedMonth}/${selectedYear}`} />
      </div>
    ),
  };

  const TABS = [
    { id: 'dueSoon', label: 'Đến hạn (+-30 ngày)', content: tabContents.dueSoon },
    { id: 'expiredRecently', label: 'Quá hạn (30-90 ngày trước)', content: tabContents.expiredRecently },
    { id: 'byMonth', label: 'Lọc theo tháng', content: tabContents.byMonth },
  ];
  
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <header className="mb-8 p-6 bg-white shadow-lg rounded-xl flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Trang Quản Lý BHYT</h1>
          <p className="text-gray-600">Xin chào, {user.fullName} ({user.email})</p>
        </div>
        <Button onClick={logout} variant="secondary" size="md">
          Đăng xuất
        </Button>
      </header>
      <main className="bg-white shadow-xl rounded-xl p-6 md:p-8">
        <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      </main>
      <footer className="text-center mt-12 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} BHYT Management App. All rights reserved.</p>
        <p>Phát triển bởi Nhóm Kỹ Thuật.</p>
      </footer>
    </div>
  );
};

export default DashboardPage;
