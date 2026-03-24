import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useSnackbar } from '@/components/snackbar';
import { getApiErrorMessage } from './authMutationUtils';

interface GoogleAuthData {
    credential: string;
}

interface UseGoogleAuthOptions {
    successMessageKey?: string;
    errorMessageKey?: string;
}

export const useGoogleAuth = (options: UseGoogleAuthOptions = {}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { login } = useAuthStore();
    const { showSnackbar } = useSnackbar();

    const successMessageKey = options.successMessageKey || 'loginSuccess';
    const errorMessageKey = options.errorMessageKey || 'loginError';

    return useMutation({
        mutationFn: (data: GoogleAuthData) => api.loginWithGoogleToken(data.credential),
        onSuccess: (response) => {
            login(response.user, response.accessToken, response.refreshToken);
            showSnackbar(t(successMessageKey), 'success');
            navigate('/');
        },
        onError: (error: unknown) => {
            const fallbackMessage = t(errorMessageKey);
            const message = getApiErrorMessage(error, fallbackMessage);
            showSnackbar(message, 'error');
        },
    });
};
