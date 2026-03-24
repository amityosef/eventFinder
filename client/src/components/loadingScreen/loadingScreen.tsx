import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import * as styles from './styles';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({ message = 'טוען...' }: LoadingScreenProps) => {
  return (
    <Fade in timeout={300}>
      <Box sx={styles.containerStyles}>
        <Box sx={styles.contentStyles}>
          <Box sx={styles.logoContainerStyles}>
            <Box sx={styles.logoStyles}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </Box>
          </Box>
          <CircularProgress
            size={48}
            thickness={4}
            sx={styles.spinnerStyles}
          />
          <Typography variant="body1" color="text.secondary" sx={{ marginTop: 2 }}>
            {message}
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};
