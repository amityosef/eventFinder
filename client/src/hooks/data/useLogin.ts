import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useSnackbar } from '@/components/snackbar';
import { getApiErrorMessage } from './authMutationUtils';

interface LoginData {
    email: string;
    password: string;
}

export const useLogin = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { login } = useAuthStore();
    const { showSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: (data: LoginData) => api.login(data),
        onSuccess: (response) => {
            login(response.user, response.accessToken, response.refreshToken);
            showSnackbar(t('loginSuccess'), 'success');
            navigate('/');
        },
        onError: (error: unknown) => {
            const message = getApiErrorMessage(error, t('loginError'));
            showSnackbar(message, 'error');
        },
    });
};
