/**
 * Utility functions for handling dates and times in Vietnam timezone (UTC+7)
 */

// Vietnam timezone offset: UTC+7
const VN_TIMEZONE_OFFSET = 7 * 60; // 7 hours in minutes

/**
 * Get current date/time in Vietnam timezone
 * This function ensures we always get VN time regardless of server timezone
 * @returns {Date} Date object representing current time in Vietnam timezone
 */
export const getVNNow = () => {
  // Use Intl API to get current time in Vietnam timezone
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const parts = formatter.formatToParts(now);
  const partsMap = {};
  parts.forEach(part => {
    partsMap[part.type] = part.value;
  });
  
  // Create date object with VN time values
  // Note: This creates a date in local timezone but with VN time values
  // which is what we want for formatting
  return new Date(
    parseInt(partsMap.year),
    parseInt(partsMap.month) - 1,
    parseInt(partsMap.day),
    parseInt(partsMap.hour),
    parseInt(partsMap.minute),
    parseInt(partsMap.second)
  );
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
 * Format date to YYYY-MM-DD format
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {string} Date in YYYY-MM-DD format
 */
export const formatDateForDB = (dateInput) => {
  if (!dateInput) return null;
  
  const date = toVNDate(dateInput);
  if (!date || isNaN(date.getTime())) return null;
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format datetime to YYYY-MM-DD HH:mm:ss format for MySQL
 * @param {string|Date} dateInput - Date string or Date object
 * @returns {string} Date in YYYY-MM-DD HH:mm:ss format
 */
export const formatDateTimeForDB = (dateInput) => {
  if (!dateInput) return null;
  
  const date = toVNDate(dateInput);
  if (!date || isNaN(date.getTime())) return null;
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * Get today's date in YYYY-MM-DD format (Vietnam timezone)
 * @returns {string} Today's date
 */
export const getTodayVN = () => {
  return formatDateForDB(getVNNow());
};

/**
 * Get current datetime for database (Vietnam timezone)
 * This function directly formats the current VN time without going through toVNDate
 * to avoid double timezone conversion issues
 * @returns {string} Current datetime in YYYY-MM-DD HH:mm:ss format
 */
export const getNowForDB = () => {
  // Get current time in Vietnam timezone using Intl API
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const parts = formatter.formatToParts(now);
  const partsMap = {};
  parts.forEach(part => {
    partsMap[part.type] = part.value;
  });
  
  // Format directly as YYYY-MM-DD HH:mm:ss
  const year = partsMap.year;
  const month = partsMap.month.padStart(2, '0');
  const day = partsMap.day.padStart(2, '0');
  const hours = partsMap.hour.padStart(2, '0');
  const minutes = partsMap.minute.padStart(2, '0');
  const seconds = partsMap.second.padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * Parse date string from database and return as Date object in VN timezone
 * @param {string} dbDateString - Date string from database (YYYY-MM-DD or YYYY-MM-DD HH:mm:ss)
 * @returns {Date} Date object in Vietnam timezone
 */
export const parseDateFromDB = (dbDateString) => {
  if (!dbDateString) return null;
  
  // Remove time part if exists
  const datePart = dbDateString.split(' ')[0].split('T')[0];
  const [year, month, day] = datePart.split('-');
  
  // Create date in VN timezone
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  return toVNDate(date);
};

