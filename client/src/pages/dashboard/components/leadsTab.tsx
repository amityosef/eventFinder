import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  FormControl,
  Select,
  InputLabel,
  ChipProps,
} from '@mui/material';
import {
  MoreVert,
  Phone,
  CheckCircle,
  Schedule,
  Cancel,
} from '@mui/icons-material';
import { useLeads, useUpdateLeadStatus } from '@/hooks/data';
import { EmptyState } from '@/components/emptyState';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { LeadStatus } from '@/types';

type LeadFilterStatus = 'all' | LeadStatus;

export const LeadsTab = () => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<LeadFilterStatus>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  const { data, isLoading } = useLeads(
    statusFilter !== 'all' ? { status: statusFilter } : undefined
  );

  const updateStatusMutation = useUpdateLeadStatus();

  const leads = data?.leads || [];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, leadId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedLead(leadId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedLead(null);
  };

  const handleStatusChange = (status: LeadStatus) => {
    if (selectedLead) {
      updateStatusMutation.mutate({ id: selectedLead, status });
    }
    handleMenuClose();
  };

  const statusColorMap: Record<LeadStatus, ChipProps['color']> = {
    new: 'info',
    contacted: 'warning',
    negotiating: 'warning',
    confirmed: 'success',
    cancelled: 'error',
    completed: 'default',
  };

  const getStatusColor = (status: LeadStatus): ChipProps['color'] =>
    statusColorMap[status] || 'default';

  const statusIconMap: Record<LeadStatus, React.ReactElement> = {
    new: <Schedule fontSize="small" />,
    contacted: <Phone fontSize="small" />,
    negotiating: <Schedule fontSize="small" />,
    confirmed: <CheckCircle fontSize="small" />,
    cancelled: <Cancel fontSize="small" />,
    completed: <CheckCircle fontSize="small" />,
  };

  const getStatusIcon = (status: LeadStatus): React.ReactElement | undefined =>
    statusIconMap[status];

  if (isLoading) {
    return (
      <Box>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={60} sx={{ marginBottom: 1, borderRadius: 1 }} />
        ))}
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          {t('leads')} ({leads.length})
        </Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>{t('status')}</InputLabel>
          <Select
            value={statusFilter}
            label={t('status')}
            onChange={(e) => setStatusFilter(e.target.value as LeadFilterStatus)}
          >
            <MenuItem value="all">{t('all')}</MenuItem>
            <MenuItem value="new">{t('new')}</MenuItem>
            <MenuItem value="contacted">{t('contacted')}</MenuItem>
            <MenuItem value="negotiating">{t('negotiating')}</MenuItem>
            <MenuItem value="confirmed">{t('confirmed')}</MenuItem>
            <MenuItem value="cancelled">{t('cancelled')}</MenuItem>
            <MenuItem value="completed">{t('completed')}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {leads.length === 0 ? (
        <EmptyState
          title={t('noLeads')}
          description={t('noLeadsDescription')}
          illustration="noResults"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('customer')}</TableCell>
                <TableCell>{t('venue')}</TableCell>
                <TableCell>{t('eventType')}</TableCell>
                <TableCell>{t('eventDate')}</TableCell>
                <TableCell>{t('guestCount')}</TableCell>
                <TableCell>{t('status')}</TableCell>
                <TableCell>{t('createdAt')}</TableCell>
                <TableCell align="left">{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead._id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {lead.customerName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {lead.customerPhone}
                        </Typography>
                        {lead.customerEmail && (
                          <>
                            <Typography variant="caption" color="text.secondary">
                              •
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {lead.customerEmail}
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {typeof lead.venue === 'object' ? lead.venue.name : '-'}
                  </TableCell>
                  <TableCell>{t(lead.eventType)}</TableCell>
                  <TableCell>
                    {lead.eventDate
                      ? format(new Date(lead.eventDate), 'dd/MM/yyyy', { locale: he })
                      : '-'}
                  </TableCell>
                  <TableCell>{lead.guestCount}</TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(lead.status) || undefined}
                      label={t(lead.status)}
                      size="small"
                      color={getStatusColor(lead.status)}
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(lead.createdAt), 'dd/MM/yyyy HH:mm', { locale: he })}
                  </TableCell>
                  <TableCell align="left">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, lead._id)}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Status Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleStatusChange('new')}>
          <Schedule fontSize="small" sx={{ mr: 1 }} />
          {t('markAsNew')}
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('contacted')}>
          <Phone fontSize="small" sx={{ mr: 1 }} />
          {t('markAsContacted')}
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('negotiating')}>
          <Schedule fontSize="small" sx={{ mr: 1 }} />
          {t('markAsNegotiating')}
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('confirmed')}>
          <CheckCircle fontSize="small" sx={{ mr: 1 }} />
          {t('markAsConfirmed')}
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('cancelled')}>
          <Cancel fontSize="small" sx={{ mr: 1 }} />
          {t('markAsCancelled')}
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('completed')}>
          <CheckCircle fontSize="small" sx={{ mr: 1 }} />
          {t('markAsCompleted')}
        </MenuItem>
      </Menu>
    </Box>
  );
};
