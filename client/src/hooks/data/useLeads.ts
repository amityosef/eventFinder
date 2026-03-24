import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { LeadStatus } from '@/types';

export interface LeadsFilter {
    [key: string]: string | number | boolean | undefined;
    status?: LeadStatus;
}

export const useLeads = (filters?: LeadsFilter) => {
    return useQuery({
        queryKey: ['leads', filters],
        queryFn: () => api.getLeads(filters),
    });
};
