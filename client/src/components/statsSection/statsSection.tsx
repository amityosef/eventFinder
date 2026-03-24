import { useTranslation } from 'react-i18next';
import { Box, Container, Typography, Grid } from '@mui/material';
import { Place, EventAvailable, Star, Groups } from '@mui/icons-material';
import { sectionContainerStyles, statItemStyles, iconContainerStyles } from './styles';
import { strings } from './strings';

export const StatsSection = () => {
    const { t } = useTranslation();

    const stats = [
        { icon: <Place />, value: '500+', label: t(strings.venues) },
        { icon: <EventAvailable />, value: '10,000+', label: t(strings.eventsHosted) },
        { icon: <Star />, value: '4.8', label: t(strings.averageRating) },
        { icon: <Groups />, value: '50,000+', label: t(strings.happyCustomers) },
    ];

    return (
        <Box sx={sectionContainerStyles}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {stats.map((stat, index) => (
                        <Grid item xs={6} md={3} key={index}>
                            <Box sx={statItemStyles}>
                                <Box sx={iconContainerStyles}>{stat.icon}</Box>
                                <Typography variant="h4" fontWeight={700} color="primary">
                                    {stat.value}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {stat.label}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};
