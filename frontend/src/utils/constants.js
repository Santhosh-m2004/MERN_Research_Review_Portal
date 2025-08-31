// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  USERS: {
    BASE: '/users',
    STATS: '/users/stats',
  },
  DOCUMENTS: {
    BASE: '/documents',
    STATS: '/documents/stats',
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
  },
  ASSIGNMENTS: {
    BASE: '/assignments',
  },
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
};

// Document statuses
export const DOCUMENT_STATUS = {
  SUBMITTED: 'submitted',
  REVIEWED: 'reviewed',
  REVISED: 'revised',
};

// Notification categories
export const NOTIFICATION_CATEGORIES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
};

// File upload constraints
export const FILE_UPLOAD = {
  MAX_SIZE: 16 * 1024 * 1024, // 16MB
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx', '.txt'],
  ALLOWED_MIMETYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  USER_DATA: 'user',
  THEME: 'theme',
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY_DATE: 'MMM DD, YYYY',
  DISPLAY_DATETIME: 'MMM DD, YYYY, hh:mm A',
  API_DATE: 'YYYY-MM-DD',
};