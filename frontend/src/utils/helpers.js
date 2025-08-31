import { DOCUMENT_STATUS, NOTIFICATION_CATEGORIES } from './constants';

// Format date for display
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

// Format datetime for display
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get document status badge class
export const getStatusBadgeClass = (status) => {
  switch (status) {
    case DOCUMENT_STATUS.REVIEWED:
      return 'bg-green-100 text-green-800';
    case DOCUMENT_STATUS.SUBMITTED:
      return 'bg-yellow-100 text-yellow-800';
    case DOCUMENT_STATUS.REVISED:
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Get notification category class
export const getNotificationCategoryClass = (category) => {
  switch (category) {
    case NOTIFICATION_CATEGORIES.INFO:
      return 'bg-blue-100 text-blue-800';
    case NOTIFICATION_CATEGORIES.SUCCESS:
      return 'bg-green-100 text-green-800';
    case NOTIFICATION_CATEGORIES.WARNING:
      return 'bg-yellow-100 text-yellow-800';
    case NOTIFICATION_CATEGORIES.ERROR:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

// Generate a unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Get user initials for avatar
export const getUserInitials = (name) => {
  if (!name) return 'U';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Check if file type is allowed
export const isFileTypeAllowed = (file, allowedTypes) => {
  if (!file || !allowedTypes) return false;
  
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  return allowedTypes.includes(extension);
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};