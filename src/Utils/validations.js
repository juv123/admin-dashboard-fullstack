// utils/validation.js

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? "" : "Invalid email format!";
  };
  
  export const validatePassword = (password, confirmPassword, currentPassword) => {
    if (!password || password.length < 8) {
      return "Password must be at least 8 characters long!";
    }
    if (password !== confirmPassword) {
      return "New password and confirmation do not match!";
    }
    if (password === currentPassword) {
      return "New password cannot be the same as the current password!";
    }
    return "";
  };
  export const validatePasswordSyntax = (password) => {
    if (!password || password.length < 8) {
      return "Password must be at least 8 characters long!";
    }
    return "";
  };
  