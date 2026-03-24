import { SystemStyleObject } from '@mui/system';

export const cardStyles: SystemStyleObject = {
  borderRadius: 3,
  overflow: 'hidden',
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'all 0.3s ease',
  border: '1px solid',
  borderColor: 'divider',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
    '& .MuiCardMedia-root': {
      transform: 'scale(1.05)',
    },
  },
};

export const imageContainerStyles: SystemStyleObject = {
  position: 'relative',
  overflow: 'hidden',
  aspectRatio: '16/10',
};

export const imageStyles: SystemStyleObject = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease',
};

export const favoriteButtonStyles: SystemStyleObject = {
  position: 'absolute',
  top: 12,
  left: 12,
  backgroundColor: 'rgba(0,0,0,0.3)',
  backdropFilter: 'blur(4px)',
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
};

export const favoriteIconStyles: SystemStyleObject = {
  color: '#ef4444',
};

export const favoriteIconBorderStyles: SystemStyleObject = {
  color: 'white',
};

export const badgesStyles: SystemStyleObject = {
  position: 'absolute',
  top: 12,
  right: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 0.5,
};

export const verifiedBadgeStyles: SystemStyleObject = {
  backgroundColor: 'success.main',
  color: 'white',
  fontWeight: 600,
  fontSize: '0.7rem',
};

export const recommendedBadgeStyles: SystemStyleObject = {
  backgroundColor: 'warning.main',
  color: 'white',
  fontWeight: 600,
  fontSize: '0.7rem',
};

export const priceTagStyles: SystemStyleObject = {
  position: 'absolute',
  bottom: 12,
  right: 12,
  backgroundColor: 'white',
  borderRadius: 2,
  px: 1.5,
  py: 0.5,
  display: 'flex',
  alignItems: 'baseline',
  gap: 0.5,
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
};

export const contentStyles: SystemStyleObject = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: 2,
};

export const nameStyles: SystemStyleObject = {
  marginBottom: 1,
  lineHeight: 1.3,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

export const infoRowStyles: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
  marginBottom: 0.5,
};

export const featuresStyles: SystemStyleObject = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 0.5,
  marginTop: 1.5,
  marginBottom: 1,
};

export const featureChipStyles: SystemStyleObject = {
  fontSize: '0.7rem',
  height: 24,
};

export const ratingStyles: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5,
  marginTop: 'auto',
  paddingTop: 1,
};

export const starIconStyles: SystemStyleObject = {
  color: '#f59e0b',
  fontSize: 18,
};
