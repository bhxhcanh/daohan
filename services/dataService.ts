
import { BHYTRecord, BHYTFilterParams, ApiResponse } from '../types';
// utils/dateUtils are general purpose, so they can stay if needed elsewhere or by fetched data.

// !!! IMPORTANT: Replace this with your actual Google Apps Script Web App URL !!!
// Ensure this is the SAME URL as in authService.ts if they point to the same GAS deployment.
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbwupeI_-uhLqsnv1HiHAnQvjEojHpXra-tZoxJt_Md8-WesJxz8Eif3Vz9WpmOv3sXs/exec';
  
export const dataService = {
  fetchBHYTData: async (params: BHYTFilterParams): Promise<ApiResponse<BHYTRecord[]>> => {
    console.log('Fetching BHYTData with params:', params);
    
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'fetchBHYTData',
          payload: params,
        }),
      });

      if (!response.ok) {
        // Try to parse error from GAS if it's a known structure
        let errorBody = 'Lỗi không xác định từ máy chủ.';
        try {
            const errJson = await response.json();
            errorBody = errJson.error || errJson.message || JSON.stringify(errJson);
        } catch (e) {
            errorBody = await response.text();
        }
        console.error('Fetch BHYT Data API Error (not ok):', response.status, errorBody);
        return { success: false, error: `Lỗi ${response.status}: ${errorBody}` };
      }

      const result: ApiResponse<BHYTRecord[]> = await response.json();
      console.log('Fetch BHYT Data API Response:', result);

      if (result.success && Array.isArray(result.data)) {
        return { success: true, data: result.data };
      } else if (!result.success && result.error) {
         return { success: false, error: result.error };
      } else {
        // This case might happen if GAS returns success: true but data is not an array or is missing
        console.warn("Fetch BHYT Data: API reported success but data is not as expected.", result);
        return { success: false, error: "Dữ liệu nhận được không hợp lệ." };
      }

    } catch (error) {
      console.error('Fetch BHYT Data Network/Parsing Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Lỗi mạng hoặc không thể phân tích phản hồi.';
      return { success: false, error: `Không thể tải dữ liệu BHYT: ${errorMessage}` };
    }
  },
};
