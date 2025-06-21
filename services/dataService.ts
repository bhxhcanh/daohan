
import { BHYTRecord, BHYTFilterParams, BHYTFilterType, ApiResponse } from '../types';
import { getToday, addDays, parseDate } from '../utils/dateUtils';

// Simulate API calls to a GAS backend
const API_BASE_URL = '/api/bhyt'; // Replace with your actual GAS web app URL

// Mock data - replace with actual data structure from your Google Sheet 'luykedstg'
const MOCK_BHYT_DATA: BHYTRecord[] = [
  { id: '1', hoTen: 'Nguyễn Văn A', ngaySinh: '1990-01-15', hanTheTu: '2024-01-01', hanTheDen: formatDateForFilter(addDays(getToday(), 15)), soDienThoai: '0900000001', diaChiLh: '123 Đường ABC, Quận 1, TP. HCM', maPb: '01012345678901', maBv: '79001' },
  { id: '2', hoTen: 'Trần Thị B', ngaySinh: '1985-05-20', hanTheTu: '2023-12-01', hanTheDen: formatDateForFilter(addDays(getToday(), -20)), soDienThoai: '0900000002', diaChiLh: '456 Đường XYZ, Quận 2, TP. HCM', maPb: '02098765432102', maBv: '79002' },
  { id: '3', hoTen: 'Lê Văn C', ngaySinh: '2000-11-01', hanTheTu: '2024-06-01', hanTheDen: formatDateForFilter(addDays(getToday(), 45)), soDienThoai: '0900000003', diaChiLh: '789 Đường KLM, Quận 3, TP. HCM', maPb: '01012345678901', maBv: '79003' }, // Matches CCCD '012345678901'
  { id: '4', hoTen: 'Phạm Thị D', ngaySinh: '1995-02-10', hanTheTu: '2023-10-01', hanTheDen: formatDateForFilter(addDays(getToday(), -45)), soDienThoai: '0900000004', diaChiLh: '101 Đường UVW, Quận 4, TP. HCM', maPb: '03112233445503', maBv: '79004' },
  { id: '5', hoTen: 'Hoàng Văn E', ngaySinh: '1978-07-30', hanTheTu: '2023-09-01', hanTheDen: formatDateForFilter(addDays(getToday(), -75)), soDienThoai: '0900000005', diaChiLh: '202 Đường QRS, Quận 5, TP. HCM', maPb: '04667788990004', maBv: '79005' },
  { id: '6', hoTen: 'Vũ Thị F', ngaySinh: '2002-03-25', hanTheTu: '2024-08-01', hanTheDen: '2024-08-31', soDienThoai: '0900000006', diaChiLh: '303 Đường DEF, Quận 6, TP. HCM', maPb: '01012345678901', maBv: '79006' }, // For month filter, matches CCCD
  { id: '7', hoTen: 'Đặng Văn G', ngaySinh: '1992-12-12', hanTheTu: '2024-09-15', hanTheDen: '2024-09-30', soDienThoai: '0900000007', diaChiLh: '404 Đường GHI, Quận 7, TP. HCM', maPb: '05121212121205', maBv: '79007' }, // For month filter
];

function formatDateForFilter(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


export const dataService = {
  fetchBHYTData: async (params: BHYTFilterParams): Promise<ApiResponse<BHYTRecord[]>> => {
    console.log('Simulating fetchBHYTData with params:', params);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay

    // In a real scenario, this would be a fetch call to GAS backend
    // const queryParams = new URLSearchParams();
    // queryParams.append('filterType', params.filterType);
    // if (params.userCCCD) queryParams.append('cccd', params.userCCCD);
    // if (params.month) queryParams.append('month', params.month);
    // if (params.year && params.filterType === BHYTFilterType.BY_MONTH) queryParams.append('year', params.year);
    // const response = await fetch(`${API_BASE_URL}?${queryParams.toString()}`);
    // if (!response.ok) {
    //   const errorData = await response.json();
    //   return { success: false, error: errorData.message || 'Failed to fetch BHYT data' };
    // }
    // const data: BHYTRecord[] = await response.json();
    // return { success: true, data };

    // Mocked filtering logic:
    let filteredData = [...MOCK_BHYT_DATA];
    const today = getToday();

    if (params.filterType === BHYTFilterType.DUE_SOON) {
      const thirtyDaysAgo = addDays(today, -30);
      const thirtyDaysHence = addDays(today, 30);
      filteredData = filteredData.filter(record => {
        const denNgay = parseDate(record.hanTheDen);
        return denNgay && denNgay >= thirtyDaysAgo && denNgay <= thirtyDaysHence;
      });
      if (params.userCCCD) {
        filteredData = filteredData.filter(record => record.maPb.substring(2, 14) === params.userCCCD);
      }
    } else if (params.filterType === BHYTFilterType.EXPIRED_RECENTLY) {
      const thirtyDaysAgo = addDays(today, -30);
      const ninetyDaysAgo = addDays(today, -90);
      filteredData = filteredData.filter(record => {
        const denNgay = parseDate(record.hanTheDen);
        return denNgay && denNgay < thirtyDaysAgo && denNgay >= ninetyDaysAgo;
      });
      // No CCCD filter for Tab 2 as per requirement
    } else if (params.filterType === BHYTFilterType.BY_MONTH) {
      if (params.year && params.month) { // month is YYYY-MM
        const selectedYear = parseInt(params.year);
        const selectedMonth = parseInt(params.month); // month is 1-indexed
        
        filteredData = filteredData.filter(record => {
          const denNgay = parseDate(record.hanTheDen);
          return denNgay && denNgay.getFullYear() === selectedYear && (denNgay.getMonth() + 1) === selectedMonth;
        });
      }
      if (params.userCCCD) {
        filteredData = filteredData.filter(record => record.maPb.substring(2, 14) === params.userCCCD);
      }
    }
    
    return { success: true, data: filteredData };
  },
};
