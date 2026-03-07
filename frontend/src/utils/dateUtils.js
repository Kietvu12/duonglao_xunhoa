/**
 * Utility functions for handling dates and times in Vietnam timezone (UTC+7)
 */

// Vietnam timezone offset: UTC+7
const VN_TIMEZONE_OFFSET = 7 * 60; // 7 hours in minutes

/**
 * Get current date/time in Vietnam timezone
 * @returns {Date} Date object representing current VN time
 */
export const getVNNow = () => {
  // Get current time in browser's local timezone
  const now = new Date();
  // Get VN time by adding 7 hours to UTC
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  const vnTime = utcTime + (VN_TIMEZONE_OFFSET * 60000);
  return new Date(vnTime);
};

/**
 * Convert a date string or Date object to Vietnam timezone Date
 * @param {string|Date} dateInput - Date string (ISO format) or Date object
 * @returns {Date} Date object in Vietnam timezone
 */
export const toVNDate = (dateInput) => {
  if (!dateInput) return null;
  
  let date;
  if (typeof dateInput === 'string') {
    // If it's an ISO string with timezone, parse it
    if (dateInput.includes('T') || dateInput.includes('Z')) {
      date = new Date(dateInput);
    } else {
      // If it's just a date string (YYYY-MM-DD), treat it as local date in VN timezone
      const [year, month, day] = dateInput.split('T')[0].split('-');
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
  } else if (dateInput instanceof Date) {
    date = new Date(dateInput);
  } else {
    return null;
  }
  
  // Adjust to Vietnam timezone
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  return new Date(utc + (VN_TIMEZONE_OFFSET * 60000));
};

/**
 * Format date to Vietnamese locale string with Vietnam timezone
 * @param {string|Date} dateInput - Date string or Date object
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatVNDate = (dateInput, options = {}) => {
  if (!dateInput) return '-';
  
  const date = toVNDate(dateInput);
  if (!date || isNaN(date.getTime())) return '-';
  
  const defaultOptions = {
    timeZone: 'Asia/Ho_Chi_Minh',
    ...options
  };
  
  return date.toLocaleString('vi-VN', defaultOptions);
};

/**
 * Format date to YYYY-MM-DD format (for date inputs)
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {string} Date in YYYY-MM-DD format
 */
export const formatDateForInput = (dateInput) => {
  if (!dateInput) return '';
  
  const date = toVNDate(dateInput);
  if (!date || isNaN(date.getTime())) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format datetime to YYYY-MM-DDTHH:mm format (for datetime-local inputs)
 * Chỉ parse từ DB format và format lại, KHÔNG convert timezone
 * @param {string|Date} dateInput - Date string from DB hoặc Date object
 * @returns {string} Date in YYYY-MM-DDTHH:mm format
 */
export const formatDateTimeForInput = (dateInput) => {
  if (!dateInput) return '';
  
  try {
    let year, month, day, hours, minutes;
    
    if (typeof dateInput === 'string') {
      let datePart, timePart;
      
      // Parse từ DB format: "YYYY-MM-DD HH:mm:ss" hoặc "YYYY-MM-DDTHH:mm:ss"
      if (dateInput.includes(' ')) {
        [datePart, timePart] = dateInput.split(' ');
      } else if (dateInput.includes('T')) {
        [datePart, timePart] = dateInput.split('T');
        // Bỏ phần timezone nếu có
        timePart = timePart.replace(/[Zz].*$/, '').replace(/[+-]\d{2}:\d{2}.*$/, '');
      } else {
        // Chỉ có date: YYYY-MM-DD
        datePart = dateInput;
        timePart = '00:00:00';
      }
      
      const [y, m, d] = datePart.split('-').map(Number);
      const [h, min] = (timePart || '00:00:00').split(':').map(Number);
      
      year = y;
      month = m;
      day = d;
      hours = h || 0;
      minutes = min || 0;
    } else if (dateInput instanceof Date) {
      year = dateInput.getFullYear();
      month = dateInput.getMonth() + 1;
      day = dateInput.getDate();
      hours = dateInput.getHours();
      minutes = dateInput.getMinutes();
    } else {
      return '';
    }
    
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  } catch (error) {
    console.error('Error formatting datetime for input:', error);
    return '';
  }
};

/**
 * Convert datetime-local input to MySQL DATETIME format (YYYY-MM-DD HH:mm:ss)
 * Chỉ format lại, KHÔNG convert timezone
 * @param {string} dateInput - Date string từ datetime-local input (YYYY-MM-DDTHH:mm)
 * @returns {string} MySQL DATETIME format (YYYY-MM-DD HH:mm:ss)
 */
export const toISOStringVN = (dateInput) => {
  if (!dateInput) return null;
  
  try {
    // Nếu là datetime-local format (YYYY-MM-DDTHH:mm), format thành MySQL format
    if (typeof dateInput === 'string' && dateInput.includes('T')) {
      const [datePart, timePart] = dateInput.split('T');
      const [hours, minutes] = (timePart || '00:00').split(':').map(Number);
      
      return `${datePart} ${String(hours || 0).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}:00`;
    }
    
    // Nếu đã là MySQL format, trả về nguyên
    if (typeof dateInput === 'string' && dateInput.includes(' ')) {
      return dateInput;
    }
    
    // Nếu là Date object, format thành MySQL format
    if (dateInput instanceof Date) {
      const year = dateInput.getFullYear();
      const month = String(dateInput.getMonth() + 1).padStart(2, '0');
      const day = String(dateInput.getDate()).padStart(2, '0');
      const hours = String(dateInput.getHours()).padStart(2, '0');
      const minutes = String(dateInput.getMinutes()).padStart(2, '0');
      const seconds = String(dateInput.getSeconds()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    
    return null;
  } catch (error) {
    console.error('Error converting to ISO string:', error);
    return null;
  }
};

/**
 * Format date to Vietnamese date string (DD/MM/YYYY)
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {string} Formatted date string
 */
export const formatDateVN = (dateInput) => {
  if (!dateInput) return '-';
  
  let year, month, day;
  
  if (typeof dateInput === 'string') {
    // If it's MySQL DATE or DATETIME format: "YYYY-MM-DD" or "YYYY-MM-DD HH:mm:ss"
    // Treat as VN time (no timezone conversion needed)
    const datePart = dateInput.split(' ')[0].split('T')[0];
    const parts = datePart.split('-');
    
    if (parts.length === 3) {
      year = parseInt(parts[0]);
      month = parseInt(parts[1]);
      day = parseInt(parts[2]);
    } else {
      return '-';
    }
  } else if (dateInput instanceof Date) {
    // For Date object, extract components directly
    year = dateInput.getFullYear();
    month = dateInput.getMonth() + 1;
    day = dateInput.getDate();
  } else {
    return '-';
  }
  
  // Format as DD/MM/YYYY
  const dayStr = String(day).padStart(2, '0');
  const monthStr = String(month).padStart(2, '0');
  
  return `${dayStr}/${monthStr}/${year}`;
};

/**
 * Format datetime to Vietnamese datetime string (DD/MM/YYYY HH:mm)
 * Chỉ parse và format lại từ DB format, KHÔNG convert timezone
 * @param {string} dateInput - Date string from DB (YYYY-MM-DD HH:mm:ss hoặc YYYY-MM-DDTHH:mm:ss)
 * @returns {string} Formatted datetime string (DD/MM/YYYY HH:mm)
 */
export const formatDateTimeVN = (dateInput) => {
  if (!dateInput) return '-';
  
  try {
    let datePart, timePart;
    
    // Parse từ DB format: "YYYY-MM-DD HH:mm:ss" hoặc "YYYY-MM-DDTHH:mm:ss"
    if (dateInput.includes(' ')) {
      [datePart, timePart] = dateInput.split(' ');
    } else if (dateInput.includes('T')) {
      [datePart, timePart] = dateInput.split('T');
      // Bỏ phần timezone nếu có (Z, +07:00, etc.)
      timePart = timePart.replace(/[Zz].*$/, '').replace(/[+-]\d{2}:\d{2}.*$/, '');
    } else {
      return '-';
    }
    
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = (timePart || '00:00:00').split(':').map(Number);
    
    // Format as DD/MM/YYYY HH:mm
    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return '-';
  }
};

/**
 * Get today's date in YYYY-MM-DD format (Vietnam timezone)
 * @returns {string} Today's date
 */
export const getTodayVN = () => {
  return formatDateForInput(getVNNow());
};

/**
 * Get current datetime in ISO format for API (Vietnam timezone)
 * @returns {string} Current datetime in ISO format
 */
export const getNowISO = () => {
  return toISOStringVN(getVNNow());
};

