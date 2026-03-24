import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useMyVenues = () => {
    return useQuery({
        queryKey: ['myVenues'],
        queryFn: () => api.getVenues({}),
    });
};
