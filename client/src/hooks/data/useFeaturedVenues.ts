import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export const useFeaturedVenues = (limit: number = 6) => {
    return useQuery({
        queryKey: ['featuredVenues', limit],
        queryFn: () => api.getVenues({ limit, sortBy: 'stats.averageRating', sortOrder: 'desc' }),
    });
};
