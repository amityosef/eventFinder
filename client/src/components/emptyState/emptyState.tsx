import { Box, Typography, Button } from '@mui/material';
import * as styles from './styles';

interface EmptyStateProps {
  title: string;
  description: string;
  illustration?: 'search' | 'error' | 'noResults' | 'favorites';
  actionLabel?: string;
  onAction?: () => void;
}

const illustrations = {
  search: (
    <svg viewBox="0 0 200 200" width="200" height="200">
      <circle cx="100" cy="100" r="80" fill="#e0e7ff" />
      <circle cx="85" cy="85" r="35" fill="none" stroke="#6366f1" strokeWidth="8" />
      <line x1="110" y1="110" x2="140" y2="140" stroke="#6366f1" strokeWidth="8" strokeLinecap="round" />
      <circle cx="75" cy="75" r="8" fill="#a5b4fc" />
    </svg>
  ),
  noResults: (
    <svg viewBox="0 0 200 200" width="200" height="200">
      <circle cx="100" cy="100" r="80" fill="#fef3c7" />
      <rect x="60" y="70" width="80" height="60" rx="8" fill="#fbbf24" />
      <rect x="70" y="85" width="60" height="8" rx="2" fill="#fef3c7" />
      <rect x="70" y="100" width="40" height="8" rx="2" fill="#fef3c7" />
      <path d="M90 140 Q100 155 110 140" stroke="#92400e" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="85" cy="50" r="5" fill="#f59e0b" />
      <circle cx="115" cy="50" r="5" fill="#f59e0b" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 200 200" width="200" height="200">
      <circle cx="100" cy="100" r="80" fill="#fee2e2" />
      <circle cx="100" cy="100" r="50" fill="#fecaca" />
      <text x="100" y="115" textAnchor="middle" fontSize="60" fill="#ef4444">!</text>
    </svg>
  ),
  favorites: (
    <svg viewBox="0 0 200 200" width="200" height="200">
      <circle cx="100" cy="100" r="80" fill="#fce7f3" />
      <path
        d="M100 150 L60 110 Q40 90 60 70 Q80 50 100 70 Q120 50 140 70 Q160 90 140 110 Z"
        fill="#f472b6"
      />
      <circle cx="80" cy="85" r="8" fill="#fce7f3" opacity="0.5" />
    </svg>
  ),
};

export const EmptyState = ({
  title,
  description,
  illustration = 'noResults',
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <Box sx={styles.containerStyles}>
      <Box sx={styles.illustrationStyles}>
        {illustrations[illustration]}
      </Box>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={styles.descriptionStyles}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button
          variant="contained"
          onClick={onAction}
          sx={styles.actionButtonStyles}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};
