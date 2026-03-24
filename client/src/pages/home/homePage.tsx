import { useTranslation } from 'react-i18next';
import { Box, Container, Typography, Grid, Button } from '@mui/material';
import { SearchBar } from '@/components/searchBar';
import { VenueCard } from '@/components/venueCard';
import { VenueCardSkeleton } from '@/components/venueCard';
import { HeroSection } from '@/components/heroSection';
import { StatsSection } from '@/components/statsSection';
import { useFeaturedVenues } from '@/hooks/data';
import * as styles from './styles';

export const HomePage = () => {
  const { t } = useTranslation();

  const { data: venuesData, isLoading } = useFeaturedVenues(6);

  const venues = venuesData?.venues || [];

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection />

      {/* Search Section */}
      <Container maxWidth="lg" sx={styles.searchSectionStyles}>
        <Box sx={styles.searchWrapperStyles}>
          <Typography variant="h5" fontWeight={600} textAlign="center" gutterBottom>
            {t('findPerfectVenue')}
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ marginBottom: 4 }}>
            {t('searchDescription')}
          </Typography>
          <SearchBar />
        </Box>
      </Container>

      {/* Stats Section */}
      <StatsSection />

      {/* Featured Venues Section */}
      <Container maxWidth="xl" sx={styles.featuredSectionStyles}>
        <Box sx={styles.sectionHeaderStyles}>
          <Typography variant="h4" fontWeight={700}>
            {t('featuredVenues')}
          </Typography>
          <Button href="/search" variant="outlined" sx={styles.viewAllButtonStyles}>
            {t('viewAll')}
          </Button>
        </Box>

        <Grid container spacing={3}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <VenueCardSkeleton />
              </Grid>
            ))
            : venues.map((venue) => (
              <Grid item xs={12} sm={6} lg={4} key={venue._id}>
                <VenueCard venue={venue} />
              </Grid>
            ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={styles.ctaSectionStyles}>
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
            {t('ctaTitle')}
          </Typography>
          <Typography variant="body1" textAlign="center" sx={{ marginBottom: 4, opacity: 0.9 }}>
            {t('ctaDescription')}
          </Typography>
          <Box sx={styles.ctaButtonsStyles}>
            <Button variant="contained" color="secondary" size="large" href="/search">
              {t('startSearching')}
            </Button>
            <Button variant="outlined" size="large" href="/register" sx={styles.ctaOutlineButtonStyles}>
              {t('registerVenue')}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
