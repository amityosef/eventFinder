import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api } from '@/services/api';
import { useSnackbar } from '@/components/snackbar';
import { AvailabilityStatus } from '@/types';

interface UpdateAvailabilityData {
    date: string;
    status: AvailabilityStatus;
    notes?: string;
}

export const useUpdateAvailability = (onSuccessCallback?: () => void) => {
    const { t } = useTranslation();
    const { showSnackbar } = useSnackbar();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ venueId, ...data }: UpdateAvailabilityData & { venueId: string }) =>
            api.updateAvailability(venueId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['availability'] });
            showSnackbar(t('availabilityUpdated'), 'success');
            onSuccessCallback?.();
        },
        onError: () => {
            showSnackbar(t('errorUpdatingAvailability'), 'error');
        },
    });
};
