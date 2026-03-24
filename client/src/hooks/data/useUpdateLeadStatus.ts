import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '@/services/api';
import { useSnackbar } from '@/components/snackbar';
import { LeadStatus } from '@/types';

export const useUpdateLeadStatus = () => {
    const { t } = useTranslation();
    const { showSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
            api.updateLead(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            showSnackbar(t('leadUpdated'), 'success');
        },
        onError: () => {
            showSnackbar(t('errorUpdatingLead'), 'error');
        },
    });
};
