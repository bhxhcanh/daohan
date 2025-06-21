
import React from 'react';
import { BHYTRecord } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import LoadingSpinner from '../ui/LoadingSpinner';

interface BHYTTableProps {
  records: BHYTRecord[];
  isLoading: boolean;
  error?: string | null;
  title: string;
}

const BHYTTable: React.FC<BHYTTableProps> = ({ records, isLoading, error, title }) => {
  const tableHeaders = [
    { key: 'stt', label: 'STT' },
    { key: 'hoTen', label: 'Họ và Tên' },
    { key: 'ngaySinh', label: 'Ngày Sinh' },
    { key: 'hanTheTu', label: 'Từ Ngày' },
    { key: 'hanTheDen', label: 'Đến Ngày' },
    { key: 'soDienThoai', label: 'Số Điện Thoại' },
    { key: 'diaChiLh', label: 'Địa Chỉ Liên Hệ' },
    { key: 'maPb', label: 'Mã PB' },
    { key: 'maBv', label: 'Mã BV KCB' },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white shadow-md rounded-lg p-6">
        <LoadingSpinner text={`Đang tải dữ liệu ${title}...`}/>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 bg-red-100 p-4 rounded-md shadow">Lỗi tải dữ liệu: {error}</div>;
  }
  
  if (records.length === 0) {
    return <div className="text-gray-600 bg-gray-50 p-6 rounded-md shadow text-center">Không có dữ liệu nào phù hợp.</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {tableHeaders.map((header) => (
                <th
                  key={header.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record, index) => (
              <tr key={record.id || index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{record.hoTen}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(record.ngaySinh)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(record.hanTheTu)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(record.hanTheDen)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.soDienThoai || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 min-w-[200px]">{record.diaChiLh}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.maPb}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.maBv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {records.length > 0 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
          Tổng số: {records.length} hồ sơ.
        </div>
      )}
    </div>
  );
};

export default BHYTTable;
