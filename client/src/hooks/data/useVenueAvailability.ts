import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { api } from '@/services/api';

export const useVenueAvailability = (venueId: string | undefined, selectedMonth: Date) => {
    return useQuery({
        queryKey: ['availability', venueId, format(selectedMonth, 'yyyy-MM')],
        queryFn: () => {
            if (!venueId) {
                return Promise.resolve([]);
            }

            return api.getAvailability(venueId, {
                startDate: format(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1), 'yyyy-MM-dd'),
                endDate: format(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0), 'yyyy-MM-dd'),
            });
        },
        enabled: !!venueId,
    });
};
