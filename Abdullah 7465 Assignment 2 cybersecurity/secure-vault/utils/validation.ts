
export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Must be at least 8 characters long.");
  }
  if (!/\d/.test(password)) {
    errors.push("Must contain at least one digit.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Must contain at least one lowercase letter.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Must contain at least one uppercase letter.");
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Must contain at least one special character.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};
