/**
 * Validation utilities for user inputs
 * Includes email, password, phone, and other validations
 */

import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

/**
 * Validate email format using RFC 5322 simplified regex
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Validate email with stricter RFC 5322 compliance
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email passes stricter validation
 */
export const isValidEmailStrict = (email) => {
  // RFC 5322 - simplified but more accurate
  const rfc5322Regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return rfc5322Regex.test(email) && email.length <= 254;
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Object with strength info and checks
 */
export const validatePassword = (password) => {
  if (!password) {
    return {
      score: 0,
      label: 'None',
      color: '#999',
      checks: {
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
      },
      isValid: false,
      message: 'Password is required',
    };
  }

  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^\w\s]/.test(password),
  };

  let score = Object.values(checks).filter(Boolean).length;

  let label, color;
  if (score <= 1) {
    label = 'Weak';
    color = '#ef4444';
  } else if (score <= 2) {
    label = 'Fair';
    color = '#f59e0b';
  } else if (score <= 3) {
    label = 'Good';
    color = '#eab308';
  } else if (score <= 4) {
    label = 'Strong';
    color = '#22c55e';
  } else {
    label = 'Very Strong';
    color = '#10b981';
  }

  // Password is valid if it meets minimum requirements
  const isValid = checks.length && checks.lowercase && checks.uppercase && checks.number;

  return {
    score,
    label,
    color,
    checks,
    isValid,
    message: isValid ? 'Password meets requirements' : 'Password must have 8+ chars, uppercase, lowercase, and number',
  };
};

/**
 * Get password strength requirements
 * @returns {array} - Array of password requirements
 */
export const getPasswordRequirements = () => [
  {
    key: 'length',
    label: '8+ characters',
    description: 'Password must be at least 8 characters long',
  },
  {
    key: 'lowercase',
    label: 'Lowercase letter',
    description: 'At least one lowercase letter (a-z)',
  },
  {
    key: 'uppercase',
    label: 'Uppercase letter',
    description: 'At least one uppercase letter (A-Z)',
  },
  {
    key: 'number',
    label: 'Number',
    description: 'At least one number (0-9)',
  },
  {
    key: 'special',
    label: 'Special character (optional)',
    description: 'At least one special character (!@#$%^&* etc.)',
  },
];

/**
 * Validate phone number using libphonenumber-js
 * @param {string} phoneNumber - Phone number to validate
 * @param {string} countryCode - Country code (e.g., 'US', 'CA', 'MX')
 * @returns {object} - Validation result with formatted number or error
 */
export const validatePhoneNumber = (phoneNumber, countryCode = 'US') => {
  if (!phoneNumber || !phoneNumber.trim()) {
    return {
      isValid: false,
      message: 'Phone number is required',
      formatted: null,
      error: 'EMPTY',
    };
  }

  try {
    if (!isValidPhoneNumber(phoneNumber, countryCode)) {
      return {
        isValid: false,
        message: `Invalid phone number for ${countryCode}`,
        formatted: null,
        error: 'INVALID_FORMAT',
      };
    }

    const parsed = parsePhoneNumber(phoneNumber, countryCode);
    return {
      isValid: true,
      message: 'Phone number is valid',
      formatted: parsed.formatInternational(),
      countryCode: parsed.country,
      nationalNumber: parsed.nationalNumber,
      error: null,
    };
  } catch {
    return {
      isValid: false,
      message: 'Invalid phone number format',
      formatted: null,
      error: 'PARSE_ERROR',
    };
  }
};

/**
 * Validate phone number with common US formats
 * Fallback for cases where libphonenumber doesn't work as expected
 * @param {string} phoneNumber - Phone number to validate
 * @returns {object} - Validation result
 */
export const validatePhoneNumberSimple = (phoneNumber) => {
  if (!phoneNumber || !phoneNumber.trim()) {
    return {
      isValid: false,
      message: 'Phone number is required',
      formatted: null,
    };
  }

  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // Check if it's 10 digits (US format)
  if (cleaned.length !== 10) {
    return {
      isValid: false,
      message: 'Phone number must be 10 digits',
      formatted: null,
    };
  }

  // Format as (XXX) XXX-XXXX
  const formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;

  return {
    isValid: true,
    message: 'Phone number is valid',
    formatted,
  };
};

/**
 * Validate name field
 * @param {string} name - Name to validate
 * @returns {object} - Validation result
 */
export const validateName = (name) => {
  const trimmed = name.trim();

  if (!trimmed) {
    return {
      isValid: false,
      message: 'Name is required',
    };
  }

  if (trimmed.length < 2) {
    return {
      isValid: false,
      message: 'Name must be at least 2 characters',
    };
  }

  if (trimmed.length > 50) {
    return {
      isValid: false,
      message: 'Name must be less than 50 characters',
    };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) {
    return {
      isValid: false,
      message: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    };
  }

  return {
    isValid: true,
    message: 'Name is valid',
  };
};

/**
 * Check if passwords match
 * @param {string} password - First password
 * @param {string} confirmPassword - Confirmation password
 * @returns {object} - Validation result
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!password || !confirmPassword) {
    return {
      isValid: false,
      message: 'Both password fields are required',
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      message: 'Passwords do not match',
    };
  }

  return {
    isValid: true,
    message: 'Passwords match',
  };
};

/**
 * Comprehensive form validation for signup
 * @param {object} formData - Form data object with email, password, confirmPassword
 * @returns {object} - Validation result with errors object
 */
export const validateSignupForm = (formData) => {
  const errors = {};

  // Validate first name
  const firstNameValidation = validateName(formData.firstName);
  if (!firstNameValidation.isValid) {
    errors.firstName = firstNameValidation.message;
  }

  // Validate last name
  const lastNameValidation = validateName(formData.lastName);
  if (!lastNameValidation.isValid) {
    errors.lastName = lastNameValidation.message;
  }

  // Validate email
  if (!formData.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmailStrict(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate password
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }

  // Validate password match
  const passwordMatchValidation = validatePasswordMatch(formData.password, formData.confirmPassword);
  if (!passwordMatchValidation.isValid) {
    errors.confirmPassword = passwordMatchValidation.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Sanitize email (trim and lowercase)
 * @param {string} email - Email to sanitize
 * @returns {string} - Sanitized email
 */
export const sanitizeEmail = (email) => {
  return email.trim().toLowerCase();
};

/**
 * Sanitize name (trim and proper spacing)
 * @param {string} name - Name to sanitize
 * @returns {string} - Sanitized name
 */
export const sanitizeName = (name) => {
  return name.trim().replace(/\s+/g, ' ');
};
