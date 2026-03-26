import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/emptyState';
import { VenueCard, VenueCardSkeleton } from '@/components/venueCard';
import { api } from '@/services/api';
import { Venue } from '@/types';
import { getFavoriteVenueIds } from '@/utils/favorites';

export const FavoritesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => getFavoriteVenueIds());

  const { data: venues = [], isLoading } = useQuery({
    queryKey: ['favoriteVenues', favoriteIds],
    queryFn: async () => {
      const results = await Promise.allSettled(
        favoriteIds.map((id) => api.getVenue(id)),
      );

      return results
        .filter(
          (result): result is PromiseFulfilledResult<Venue> =>
            result.status === 'fulfilled',
        )
        .map((result) => result.value);
    },
    enabled: favoriteIds.length > 0,
  });

  const hasFavorites = favoriteIds.length > 0;

  const sortedVenues = useMemo(
    () => [...venues].sort((a, b) => a.name.localeCompare(b.name)),
    [venues],
  );

  if (!hasFavorites) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <EmptyState
          title={t('favorites')}
          description="You have no saved venues yet. Tap the heart icon on any venue to add it here."
          illustration="favorites"
          actionLabel={t('searchVenues')}
          onAction={() => navigate('/search')}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {t('favorites')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {sortedVenues.length} saved venues
          </Typography>
        </Box>
        <Button variant="outlined" onClick={() => navigate('/search')}>
          {t('searchVenues')}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <VenueCardSkeleton />
            </Grid>
          ))
          : sortedVenues.map((venue) => (
            <Grid item xs={12} sm={6} lg={4} key={venue._id}>
              <VenueCard
                venue={venue}
                isFavorite
                onFavorite={(venueId, nextFavoriteState) => {
                  if (!nextFavoriteState) {
                    setFavoriteIds((current) => current.filter((id) => id !== venueId));
                  }
                }}
              />
            </Grid>
          ))}
      </Grid>
    </Container>
  );
};
