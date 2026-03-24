import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useSnackbar } from '@/components/snackbar';
import { getApiErrorMessage } from './authMutationUtils';

interface RegisterData {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
}

export const useRegister = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { login } = useAuthStore();
    const { showSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: (data: RegisterData) => api.register(data),
        onSuccess: (response) => {
            login(response.user, response.accessToken, response.refreshToken);
            showSnackbar(t('registerSuccess'), 'success');
            navigate('/');
        },
        onError: (error: unknown) => {
            const message = getApiErrorMessage(error, t('registerError'));
            showSnackbar(message, 'error');
        },
    });
};
