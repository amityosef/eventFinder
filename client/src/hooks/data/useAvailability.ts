import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { api } from '@/services/api';

export const useAvailability = (venueId: string, currentMonth: Date) => {
    return useQuery({
        queryKey: ['availability', venueId, format(currentMonth, 'yyyy-MM')],
        queryFn: () =>
            api.getAvailability(venueId, {
                startDate: format(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1), 'yyyy-MM-dd'),
                endDate: format(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0), 'yyyy-MM-dd'),
            }),
    });
};
