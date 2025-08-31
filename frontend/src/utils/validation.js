// Email validation
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Password validation
export const validatePassword = (password) => {
  // At least 6 characters
  return password.length >= 6;
};

// Username validation
export const validateUsername = (username) => {
  // Alphanumeric, 3-20 characters
  const re = /^[a-zA-Z0-9_]{3,20}$/;
  return re.test(username);
};

// Required field validation
export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim().length > 0;
};

// File validation
export const validateFile = (file, maxSize, allowedTypes) => {
  if (!file) return 'File is required';
  
  if (file.size > maxSize) {
    return `File size must be less than ${maxSize / 1024 / 1024}MB`;
  }
  
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedTypes.includes(extension)) {
    return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
  }
  
  return null;
};

// Form validation helper
export const validateForm = (fields, values) => {
  const errors = {};
  
  Object.keys(fields).forEach(field => {
    const validation = fields[field];
    const value = values[field];
    
    if (validation.required && !validateRequired(value)) {
      errors[field] = validation.requiredMessage || 'This field is required';
      return;
    }
    
    if (validation.email && value && !validateEmail(value)) {
      errors[field] = 'Please enter a valid email address';
      return;
    }
    
    if (validation.username && value && !validateUsername(value)) {
      errors[field] = 'Username must be 3-20 characters and can only contain letters, numbers, and underscores';
      return;
    }
    
    if (validation.password && value && !validatePassword(value)) {
      errors[field] = 'Password must be at least 6 characters';
      return;
    }
    
    if (validation.confirmPassword && value !== values.password) {
      errors[field] = 'Passwords do not match';
      return;
    }
    
    if (validation.minLength && value && value.length < validation.minLength) {
      errors[field] = `Must be at least ${validation.minLength} characters`;
      return;
    }
    
    if (validation.maxLength && value && value.length > validation.maxLength) {
      errors[field] = `Must be less than ${validation.maxLength} characters`;
      return;
    }
    
    if (validation.custom && value) {
      const customError = validation.custom(value, values);
      if (customError) {
        errors[field] = customError;
      }
    }
  });
  
  return errors;
};

// Login form validation schema
export const loginValidation = {
  username: {
    required: true,
    requiredMessage: 'Username or email is required',
  },
  password: {
    required: true,
    requiredMessage: 'Password is required',
  },
};

// Registration form validation schema
export const registerValidation = {
  full_name: {
    required: true,
    requiredMessage: 'Full name is required',
    minLength: 2,
    maxLength: 50,
  },
  username: {
    required: true,
    requiredMessage: 'Username is required',
    username: true,
    minLength: 3,
    maxLength: 20,
  },
  email: {
    required: true,
    requiredMessage: 'Email is required',
    email: true,
  },
  password: {
    required: true,
    requiredMessage: 'Password is required',
    password: true,
    minLength: 6,
  },
  confirm_password: {
    required: true,
    requiredMessage: 'Please confirm your password',
    confirmPassword: true,
  },
  role: {
    required: true,
    requiredMessage: 'Please select a role',
  },
};

// Document upload validation schema
export const documentValidation = {
  name: {
    required: true,
    requiredMessage: 'Your name is required',
  },
  paper_name: {
    required: true,
    requiredMessage: 'Paper title is required',
    maxLength: 200,
  },
  description: {
    maxLength: 500,
  },
  document_submission: {
    required: true,
    requiredMessage: 'Please select a file to upload',
  },
};