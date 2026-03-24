import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useVenue = (id: string | undefined) => {
    return useQuery({
        queryKey: ['venue', id],
        queryFn: () => api.getVenue(id!),
        enabled: !!id,
    });
};
