import { Card, CardContent, Skeleton, Box } from '@mui/material';
import * as styles from './styles';

export const VenueCardSkeleton = () => {
    return (
        <Card sx={styles.cardStyles}>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
                <Skeleton variant="text" width="70%" height={28} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, marginTop: 1, marginBottom: 2 }}>
                    <Skeleton variant="text" width="30%" height={20} />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, marginBottom: 2 }}>
                    <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Skeleton variant="text" width="30%" height={32} />
                    <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 2 }} />
                </Box>
            </CardContent>
        </Card>
    );
};
