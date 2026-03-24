import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  LocationOn,
  People,
  Star,
  Restaurant,
} from '@mui/icons-material';
import { Venue } from '@/types';
import * as styles from './styles';

interface VenueCardProps {
  venue: Venue;
  onFavorite?: (venueId: string, isFavorite: boolean) => void;
  isFavorite?: boolean;
}

export const VenueCard = ({ venue, onFavorite, isFavorite = false }: VenueCardProps) => {
  const { t } = useTranslation();
  const [favorite, setFavorite] = useState(isFavorite);
  const [imageError, setImageError] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newFavorite = !favorite;
    setFavorite(newFavorite);
    onFavorite?.(venue._id, newFavorite);
  };

  // Handle both string arrays and object arrays for gallery
  const getImageUrl = () => {
    if (venue.mainImage) return venue.mainImage;
    if (!venue.gallery || venue.gallery.length === 0) return '/placeholder-venue.jpg';
    const firstImage = venue.gallery[0];
    if (typeof firstImage === 'string') return firstImage;
    return firstImage?.medium || firstImage?.original || '/placeholder-venue.jpg';
  };

  const mainImage = getImageUrl();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card
      component={Link}
      to={`/venues/${venue._id}`}
      sx={styles.cardStyles}
    >
      {/* Image Container */}
      <Box sx={styles.imageContainerStyles}>
        <CardMedia
          component="img"
          image={imageError ? '/placeholder-venue.jpg' : mainImage}
          alt={venue.name}
          sx={styles.imageStyles}
          onError={() => setImageError(true)}
        />

        {/* Favorite Button */}
        <IconButton
          onClick={handleFavoriteClick}
          sx={styles.favoriteButtonStyles}
        >
          {favorite ? (
            <Favorite sx={styles.favoriteIconStyles} />
          ) : (
            <FavoriteBorder sx={styles.favoriteIconBorderStyles} />
          )}
        </IconButton>

        {/* Badges */}
        <Box sx={styles.badgesStyles}>
          {venue.kospitoVerified && (
            <Chip
              label="✓ מאומת"
              size="small"
              sx={styles.verifiedBadgeStyles}
            />
          )}
          {venue.kospitoRecommended && (
            <Chip
              label="⭐ מומלץ"
              size="small"
              sx={styles.recommendedBadgeStyles}
            />
          )}
        </Box>

        {/* Price Tag */}
        <Box sx={styles.priceTagStyles}>
          <Typography variant="subtitle2" fontWeight={700}>
            {formatPrice(venue.pricing?.pricePerPerson || venue.price?.amount || 0)}
          </Typography>
          <Typography variant="caption">
            / {t('perPerson')}
          </Typography>
        </Box>
      </Box>

      <CardContent sx={styles.contentStyles}>
        {/* Venue Name */}
        <Typography variant="h6" fontWeight={600} sx={styles.nameStyles}>
          {venue.name}
        </Typography>

        {/* Location */}
        <Box sx={styles.infoRowStyles}>
          <LocationOn fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {venue.location?.city || venue.address?.city}
            {(venue.location?.neighborhood || venue.address?.area) && `, ${venue.location?.neighborhood || venue.address?.area}`}
          </Typography>
        </Box>

        {/* Capacity */}
        <Box sx={styles.infoRowStyles}>
          <People fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {venue.capacity.min} - {venue.capacity.max} {t('guests')}
          </Typography>
        </Box>

        {/* Features */}
        <Box sx={styles.featuresStyles}>
          {venue.features?.kosher && (
            <Tooltip title={t('kosher')}>
              <Chip
                icon={<Restaurant fontSize="small" />}
                label={t('kosher')}
                size="small"
                variant="outlined"
                sx={styles.featureChipStyles}
              />
            </Tooltip>
          )}
          {(venue.features?.indoorArea && venue.features?.outdoorArea) && (
            <Chip
              label={t('indoorOutdoor')}
              size="small"
              variant="outlined"
              sx={styles.featureChipStyles}
            />
          )}
          {venue.features?.parking && (
            <Chip
              label={t('parking')}
              size="small"
              variant="outlined"
              sx={styles.featureChipStyles}
            />
          )}
        </Box>

        {/* Rating */}
        {(venue.stats?.averageRating || venue.rating) ? (
          <Box sx={styles.ratingStyles}>
            <Star sx={styles.starIconStyles} />
            <Typography variant="body2" fontWeight={600}>
              {(venue.stats?.averageRating || venue.rating || 0).toFixed(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({venue.stats?.totalReviews || venue.reviewCount || 0} {t('reviews')})
            </Typography>
          </Box>
        ) : null}
      </CardContent>
    </Card>
  );
};
