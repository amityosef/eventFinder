import { Box, Typography } from '@mui/material';
import * as styles from '../styles';

export const AuthBrand = () => {
    return (
        <Box sx={styles.logoStyles}>
            <Box sx={styles.logoIconStyles}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
            </Box>
            <Typography variant="h5" fontWeight={700}>
                EventFinder
            </Typography>
        </Box>
    );
};
