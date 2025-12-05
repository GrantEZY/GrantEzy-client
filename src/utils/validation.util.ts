/**
 * Validation utilities for forms and data
 */
import { UserCommitmentStatus, UserRoles } from '../types/auth.types';

export class ValidationUtil {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isStrongPassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }

  static isValidName(name: string, minLength = 1, maxLength = 30): boolean {
    return name.length >= minLength && name.length <= maxLength && /^[a-zA-Z\s]+$/.test(name);
  }

  static isValidRole(role: string): boolean {
    return Object.values(UserRoles).includes(role as UserRoles);
  }

  static isValidCommitment(commitment: string): boolean {
    return Object.values(UserCommitmentStatus).includes(commitment as UserCommitmentStatus);
  }

  static validateRegisterForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    commitment: string;
    password: string;
  }): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!this.isValidName(data.firstName, 3, 30)) {
      errors.firstName = 'First name must be 3-30 characters and contain only letters';
    }

    if (!this.isValidName(data.lastName, 1, 30)) {
      errors.lastName = 'Last name must be 1-30 characters and contain only letters';
    }

    if (!this.isValidEmail(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!this.isValidCommitment(data.commitment)) {
      errors.commitment = 'Please select a valid commitment status';
    }

    if (!this.isStrongPassword(data.password)) {
      errors.password =
        'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validateLoginForm(data: { email: string; role: string; password: string }): {
    isValid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    if (!this.isValidEmail(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!this.isValidRole(data.role)) {
      errors.role = 'Please select a valid role';
    }

    if (data.password.length < 8 || data.password.length > 20) {
      errors.password = 'Password must be 8-20 characters';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export const validationUtil = new ValidationUtil();
