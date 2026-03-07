/**
 * Sanitize values for database insertion
 * Converts undefined and empty strings to null
 */
export const sanitizeValue = (value) => {
  if (value === undefined || value === '') {
    return null;
  }
  return value;
};

/**
 * Sanitize an object's values
 */
export const sanitizeObject = (obj) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeValue(value);
  }
  return sanitized;
};

