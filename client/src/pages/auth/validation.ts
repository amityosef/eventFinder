import { TFunction } from 'i18next';
import {
    LoginFormData,
    LoginFormErrors,
    RegisterFormData,
    RegisterFormErrors,
} from './types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISRAEL_PHONE_PATTERN = /^0\d{8,9}$/;
const MIN_PASSWORD_LENGTH = 8;

export const validateLoginForm = (
    formData: LoginFormData,
    t: TFunction,
): LoginFormErrors => {
    const errors: LoginFormErrors = {};

    if (!formData.email.trim()) {
        errors.email = t('required');
    } else if (!EMAIL_PATTERN.test(formData.email)) {
        errors.email = t('invalidEmail');
    }

    if (!formData.password) {
        errors.password = t('required');
    }

    return errors;
};

export const validateRegisterForm = (
    formData: RegisterFormData,
    t: TFunction,
): RegisterFormErrors => {
    const errors: RegisterFormErrors = {};

    if (!formData.fullName.trim()) {
        errors.fullName = t('required');
    } else if (formData.fullName.length < 2) {
        errors.fullName = t('nameTooShort');
    }

    if (!formData.email.trim()) {
        errors.email = t('required');
    } else if (!EMAIL_PATTERN.test(formData.email)) {
        errors.email = t('invalidEmail');
    }

    if (!formData.password) {
        errors.password = t('required');
    } else if (formData.password.length < MIN_PASSWORD_LENGTH) {
        errors.password = t('passwordTooShort');
    }

    if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = t('passwordsDontMatch');
    }

    if (
        formData.phone &&
        !ISRAEL_PHONE_PATTERN.test(formData.phone.replace(/[-\s]/g, ''))
    ) {
        errors.phone = t('invalidPhone');
    }

    return errors;
};
