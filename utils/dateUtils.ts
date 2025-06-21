
// Helper to parse dates that might be DD/MM/YYYY or YYYY-MM-DD
export const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  let date;
  if (dateString.includes('/')) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      // DD/MM/YYYY
      date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    } else {
      return null;
    }
  } else if (dateString.includes('-')) {
     // YYYY-MM-DD
    date = new Date(dateString);
  } else {
    return null; // Unknown format
  }
  return isNaN(date.getTime()) ? null : date;
};

export const formatDate = (date: Date | string | null, format: string = "dd/MM/yyyy"): string => {
  if (!date) return 'N/A';
  
  let dateObj: Date | null;
  if (typeof date === 'string') {
    dateObj = parseDate(date);
  } else {
    dateObj = date;
  }

  if (!dateObj || isNaN(dateObj.getTime())) return 'Invalid Date';

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();

  if (format === "yyyy-MM-dd") {
    return `${year}-${month}-${day}`;
  }
  return `${day}/${month}/${year}`;
};

export const getToday = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  return today;
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
