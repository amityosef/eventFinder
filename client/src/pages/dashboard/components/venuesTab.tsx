import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Avatar,
  Skeleton,
} from '@mui/material';
import { Add, Edit, Visibility } from '@mui/icons-material';
import { useMyVenues } from '@/hooks/data';
import { EmptyState } from '@/components/emptyState';

export const VenuesTab = () => {
  const { t } = useTranslation();

  const { data, isLoading } = useMyVenues();

  const venues = data?.venues || [];

  if (isLoading) {
    return (
      <Box>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={60} sx={{ marginBottom: 1, borderRadius: 1 }} />
        ))}
      </Box>
    );
  }

  if (venues.length === 0) {
    return (
      <EmptyState
        title={t('noVenues')}
        description={t('noVenuesDescription')}
        illustration="noResults"
        actionLabel={t('addFirstVenue')}
        onAction={() => { }}
      />
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          {t('myVenues')} ({venues.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          to="/dashboard/venues/new"
          sx={{ borderRadius: 2 }}
        >
          {t('addVenue')}
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('venue')}</TableCell>
              <TableCell>{t('location')}</TableCell>
              <TableCell>{t('status')}</TableCell>
              <TableCell align="center">{t('views')}</TableCell>
              <TableCell align="center">{t('leads')}</TableCell>
              <TableCell align="center">{t('rating')}</TableCell>
              <TableCell align="left">{t('actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {venues.map((venue) => {
              // Handle both string arrays and object arrays for gallery
              const getThumbUrl = () => {
                if (venue.mainImage) return venue.mainImage;
                if (!venue.gallery || venue.gallery.length === 0) return '';
                const firstImage = venue.gallery[0];
                if (typeof firstImage === 'string') return firstImage;
                return firstImage?.thumbnail || firstImage?.medium || firstImage?.original || '';
              };

              return (
                <TableRow key={venue._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        variant="rounded"
                        src={getThumbUrl()}
                        sx={{ width: 48, height: 48 }}
                      >
                        {venue.name?.charAt(0) || '?'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {venue.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {venue.venueType}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{venue.location?.city || venue.address?.city}</TableCell>
                  <TableCell>
                    <Chip
                      label={(venue.status === 'active' || venue.isActive) ? t('active') : t('inactive')}
                      size="small"
                      color={(venue.status === 'active' || venue.isActive) ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="center">{venue.stats?.totalViews || 0}</TableCell>
                  <TableCell align="center">{venue.stats?.totalLeads || 0}</TableCell>
                  <TableCell align="center">
                    {(venue.stats?.averageRating || venue.rating)
                      ? `⭐ ${(venue.stats?.averageRating || venue.rating || 0).toFixed(1)}`
                      : '-'}
                  </TableCell>
                  <TableCell align="left">
                    <IconButton
                      component={Link}
                      to={`/venues/${venue._id}`}
                      size="small"
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                    <IconButton
                      component={Link}
                      to={`/dashboard/venues/${venue._id}/edit`}
                      size="small"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
