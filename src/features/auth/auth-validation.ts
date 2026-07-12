export type AuthMode = 'login' | 'signup';

export type AuthFormValues = {
  name: string;
  email: string;
  phone: string;
  code: string;
};

export type AuthFieldErrors = Partial<Record<keyof AuthFormValues, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[1-9]\d{7,14}$/;

export function validateAuthForm(mode: AuthMode, values: AuthFormValues): AuthFieldErrors {
  const errors: AuthFieldErrors = {};

  if (mode === 'signup' && values.name.trim().length < 2) {
    errors.name = 'Full name should be at least 2 characters.';
  }

  if (!emailPattern.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (mode === 'signup' && !values.phone.trim()) {
    errors.phone = 'Phone is required for signup.';
  } else if (mode === 'signup' && !phonePattern.test(values.phone.trim())) {
    errors.phone = 'Phone should look like +919999999999.';
  }

  return errors;
}

export function validateOtpCode(code: string) {
  if (code.trim().length !== 6) {
    return 'Enter the 6-digit code.';
  }

  return null;
}
