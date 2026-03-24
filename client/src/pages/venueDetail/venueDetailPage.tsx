import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Button,
  IconButton,
  Breadcrumbs,
  Link,
  Skeleton,
} from '@mui/material';
import {
  LocationOn,
  People,
  Restaurant,
  DirectionsCar,
  Accessible,
  Wifi,
  AcUnit,
  Favorite,
  FavoriteBorder,
  Share,
  Phone,
  Email,
} from '@mui/icons-material';
import { GallerySection } from '@/components/gallerySection';
import { LeadForm } from '@/components/leadForm';
import { AvailabilityCalendar } from '@/components/availabilityCalendar';
import { MapSection } from '@/components/mapSection';
import { useVenue } from '@/hooks/data';
import * as styles from './styles';

export const VenueDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: venue, isLoading } = useVenue(id);

  if (isLoading) {
    return <VenueDetailSkeleton />;
  }

  if (!venue) {
    return (
      <Container maxWidth="lg" sx={styles.notFoundContainerStyles}>
        <Typography variant="h5">{t('venueNotFound')}</Typography>
      </Container>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const featureIcons: Record<string, JSX.Element> = {
    kosher: <Restaurant fontSize="small" />,
    parking: <DirectionsCar fontSize="small" />,
    accessibility: <Accessible fontSize="small" />,
    wifi: <Wifi fontSize="small" />,
    airConditioning: <AcUnit fontSize="small" />,
  };

  return (
    <Box sx={styles.containerStyles}>
      {/* Breadcrumbs */}
      <Container maxWidth="xl">
        <Breadcrumbs sx={styles.breadcrumbsStyles}>
          <Link href="/" color="inherit" underline="hover">
            {t('home')}
          </Link>
          <Link href="/search" color="inherit" underline="hover">
            {t('venues')}
          </Link>
          <Typography color="text.primary">{venue.name}</Typography>
        </Breadcrumbs>
      </Container>

      {/* Gallery Section */}
      <GallerySection images={venue.gallery} venueName={venue.name} />

      {/* Main Content */}
      <Container maxWidth="xl" sx={styles.mainContentStyles}>
        <Grid container spacing={4}>
          {/* Left Column - Details */}
          <Grid item xs={12} lg={8}>
            {/* Header */}
            <Box sx={styles.headerStyles}>
              <Box>
                <Box sx={styles.badgesStyles}>
                  {venue.kospitoVerified && (
                    <Chip label="✓ מאומת" color="success" size="small" />
                  )}
                  {venue.kospitoRecommended && (
                    <Chip label="⭐ מומלץ" color="warning" size="small" />
                  )}
                  {venue.isFeatured && (
                    <Chip label="מומלץ" color="primary" size="small" />
                  )}
                </Box>
                <Typography variant="h3" fontWeight={700} sx={styles.titleStyles}>
                  {venue.name}
                </Typography>
                <Box sx={styles.locationStyles}>
                  <LocationOn color="action" />
                  <Typography variant="body1" color="text.secondary">
                    {venue.location?.address || venue.address?.street}, {venue.location?.city || venue.address?.city}
                    {(venue.location?.neighborhood || venue.address?.area) && ` - ${venue.location?.neighborhood || venue.address?.area}`}
                  </Typography>
                </Box>
              </Box>
              <Box sx={styles.actionsStyles}>
                <IconButton
                  onClick={() => setIsFavorite(!isFavorite)}
                  sx={styles.actionButtonStyles}
                >
                  {isFavorite ? (
                    <Favorite sx={styles.favoriteIconStyles} />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
                <IconButton sx={styles.actionButtonStyles}>
                  <Share />
                </IconButton>
              </Box>
            </Box>

            <Box sx={styles.quickInfoStyles}>
              <Box sx={styles.infoItemStyles}>
                <People color="primary" />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t('capacity')}
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {venue.capacity.min} - {venue.capacity.max} {t('guests')}
                  </Typography>
                </Box>
              </Box>
              <Box sx={styles.infoItemStyles}>
                <Typography variant="body2" color="text.secondary">
                  {t('pricePerPerson')}
                </Typography>
                <Typography variant="h6" fontWeight={600} color="primary">
                  {formatPrice(venue.pricing?.pricePerPerson || venue.price?.amount || 0)}
                </Typography>
              </Box>
            </Box>

            <Box sx={styles.sectionStyles}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {t('aboutVenue')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={styles.descriptionStyles}>
                {venue.description}
              </Typography>
            </Box>

            <Box sx={styles.sectionStyles}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {t('features')}
              </Typography>
              <Box sx={styles.featuresStyles}>
                {Object.entries(venue.features).map(([key, value]) => {
                  if (typeof value === 'boolean' && value) {
                    return (
                      <Chip
                        key={key}
                        icon={featureIcons[key] || undefined}
                        label={t(key)}
                        variant="outlined"
                        sx={styles.featureChipStyles}
                      />
                    );
                  }
                  if (key === 'indoorOutdoor' && value) {
                    return (
                      <Chip
                        key={key}
                        label={t(value as string)}
                        variant="outlined"
                        sx={styles.featureChipStyles}
                      />
                    );
                  }
                  return null;
                })}
              </Box>
            </Box>

            <Box sx={styles.sectionStyles}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {t('availability')}
              </Typography>
              <AvailabilityCalendar venueId={venue._id} />
            </Box>

            <Box sx={styles.sectionStyles}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                {t('location')}
              </Typography>
              <MapSection
                address={`${venue.location?.address || venue.address?.street || ''}, ${venue.location?.city || venue.address?.city || ''}`}
                coordinates={venue.location?.coordinates || venue.address?.coordinates}
              />
            </Box>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Box sx={styles.stickyColumnStyles}>
              <LeadForm venue={venue} />

              {/* Contact Info */}
              <Box sx={styles.contactCardStyles}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {t('contactVenue')}
                </Typography>
                {(venue.contact?.phone || venue.contactPhone) && (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Phone />}
                    href={`tel:${venue.contact?.phone || venue.contactPhone}`}
                    sx={styles.contactButtonStyles}
                  >
                    {venue.contact?.phone || venue.contactPhone}
                  </Button>
                )}
                {(venue.contact?.email || venue.contactEmail) && (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Email />}
                    href={`mailto:${venue.contact?.email || venue.contactEmail}`}
                    sx={styles.contactButtonLastStyles}
                  >
                    {venue.contact?.email || venue.contactEmail}
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const VenueDetailSkeleton = () => (
  <Container maxWidth="xl" sx={styles.skeletonContainerStyles}>
    <Skeleton variant="rectangular" height={400} sx={styles.skeletonGalleryStyles} />
    <Grid container spacing={4}>
      <Grid item xs={12} lg={8}>
        <Skeleton variant="text" height={60} width="60%" />
        <Skeleton variant="text" height={30} width="40%" />
        <Skeleton variant="rectangular" height={200} sx={styles.skeletonContentStyles} />
      </Grid>
      <Grid item xs={12} lg={4}>
        <Skeleton variant="rectangular" height={400} sx={styles.skeletonSidebarStyles} />
      </Grid>
    </Grid>
  </Container>
);
