import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '@/services/api';
import { useSnackbar } from '@/components/snackbar';
import { CreateLeadPayload } from '@/types';
import { getApiErrorMessage } from './authMutationUtils';

export const useCreateLead = (onSuccessCallback?: () => void) => {
    const { t } = useTranslation();
    const { showSnackbar } = useSnackbar();

    return useMutation({
        mutationFn: (data: CreateLeadPayload) => api.createLead(data),
        onSuccess: () => {
            showSnackbar(t('leadSubmitted'), 'success');
            onSuccessCallback?.();
        },
        onError: (error: unknown) => {
            const message = getApiErrorMessage(error, t('leadError'));
            showSnackbar(message, 'error');
        },
    });
};
