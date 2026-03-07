/**
 * Sanitize and validate pagination parameters
 * @param {*} value - The value to sanitize
 * @param {number} defaultValue - Default value if invalid
 * @param {number} min - Minimum allowed value
 * @returns {number} - Safe integer value
 */
export const sanitizeInteger = (value, defaultValue = 0, min = 0) => {
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < min) {
    return defaultValue;
  }
  return parsed;
};

/**
 * Sanitize LIMIT value for SQL query
 * @param {*} limit - The limit value from query params
 * @param {number} defaultLimit - Default limit value
 * @returns {number} - Safe limit value
 */
export const sanitizeLimit = (limit, defaultLimit = 10) => {
  return sanitizeInteger(limit, defaultLimit, 1);
};

/**
 * Sanitize OFFSET value for SQL query
 * @param {*} offset - The offset value from query params
 * @returns {number} - Safe offset value
 */
export const sanitizeOffset = (offset) => {
  return sanitizeInteger(offset, 0, 0);
};

/**
 * Build LIMIT OFFSET clause safely (concat instead of bind)
 * This prevents "Incorrect arguments to mysqld_stmt_execute" error
 * on some MySQL/MariaDB versions
 * @param {number} limit - Limit value
 * @param {number} offset - Offset value
 * @returns {string} - SQL clause
 */
export const buildLimitOffsetClause = (limit, offset) => {
  const safeLimit = sanitizeLimit(limit, 10);
  const safeOffset = sanitizeOffset(offset);
  return ` LIMIT ${safeLimit} OFFSET ${safeOffset}`;
};

