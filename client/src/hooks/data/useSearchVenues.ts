import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export interface SearchVenuesParams {
    search?: string;
    city?: string;
    venueType?: string;
    minGuests?: number;
    maxGuests?: number;
    minPrice?: number;
    maxPrice?: number;
    kosher?: boolean;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export const useSearchVenues = (params: SearchVenuesParams) => {
    return useQuery({
        queryKey: ['venues', params],
        queryFn: () => api.getVenues(params as Record<string, unknown>),
    });
};
