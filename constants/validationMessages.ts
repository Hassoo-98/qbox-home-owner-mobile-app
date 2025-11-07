export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "This field is required.",
  INVALID_EMAIL: "Please enter a valid email address.",
  INVALID_CONFIRM_PASSWORD: "Password and confirm password doesn't match",
  MAX_LENGTH: "Maximum length exceeded",
  MIN_LENGTH: "Minimum length not met",
  INVALID_PASSWORD:
    "Password must have at least 8 characters and contain at least one uppercase letter, lowercase letter, number and special symbol.",
};

export function getErrorMessage(fieldName: string) {
  return `${fieldName} is required`;
}
