import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Avatar,
} from '@mui/material';
import {
    Event,
    Search,
    Verified,
    Support,
} from '@mui/icons-material';
import * as styles from './styles';

export const AboutPage = () => {
    const { t } = useTranslation();

    const features = [
        {
            icon: <Search fontSize="large" />,
            title: t('easySearch'),
            description: t('easySearchDescription'),
        },
        {
            icon: <Event fontSize="large" />,
            title: t('wideSelection'),
            description: t('wideSelectionDescription'),
        },
        {
            icon: <Verified fontSize="large" />,
            title: t('verifiedVenues'),
            description: t('verifiedVenuesDescription'),
        },
        {
            icon: <Support fontSize="large" />,
            title: t('professionalSupport'),
            description: t('professionalSupportDescription'),
        },
    ];

    const stats = [
        { number: '500+', label: t('venuesCount') },
        { number: '10,000+', label: t('happyCustomers') },
        { number: '15+', label: t('citiesCovered') },
        { number: '98%', label: t('satisfactionRate') },
    ];

    const teamMembers = [
        { name: t('ceoName'), role: t('ceoRole'), initial: 'א' },
        { name: t('ctoName'), role: t('ctoRole'), initial: 'ד' },
        { name: t('designerName'), role: t('designerRole'), initial: 'מ' },
    ];

    return (
        <>
            <Helmet>
                <title>{t('about')} | EventFinder</title>
                <meta name="description" content={t('aboutDescription')} />
            </Helmet>

            <Container maxWidth="lg" sx={styles.containerStyles}>
                {/* Header */}
                <Box sx={styles.headerStyles}>
                    <Typography variant="h2" sx={styles.titleStyles}>
                        {t('aboutTitle')}
                    </Typography>
                    <Typography variant="h6" sx={styles.subtitleStyles}>
                        {t('aboutSubtitle')}
                    </Typography>
                </Box>

                {/* Mission Section */}
                <Box sx={styles.sectionStyles}>
                    <Typography variant="h4" sx={styles.sectionTitleStyles}>
                        {t('ourMission')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        {t('missionText1')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        {t('missionText2')}
                    </Typography>
                </Box>

                {/* Stats Section */}
                <Box sx={styles.sectionStyles}>
                    <Grid container spacing={3}>
                        {stats.map((stat, index) => (
                            <Grid item xs={6} md={3} key={index}>
                                <Box sx={styles.statCardStyles}>
                                    <Typography sx={styles.statNumberStyles}>
                                        {stat.number}
                                    </Typography>
                                    <Typography sx={styles.statLabelStyles}>
                                        {stat.label}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Features Section */}
                <Box sx={styles.sectionStyles}>
                    <Typography variant="h4" sx={styles.sectionTitleStyles}>
                        {t('whyChooseUs')}
                    </Typography>
                    <Grid container spacing={3}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Paper sx={styles.cardStyles}>
                                    <Box sx={styles.iconWrapperStyles}>
                                        {feature.icon}
                                    </Box>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Team Section */}
                <Box sx={styles.sectionStyles}>
                    <Typography variant="h4" sx={styles.sectionTitleStyles}>
                        {t('ourTeam')}
                    </Typography>
                    <Grid container spacing={3} justifyContent="center">
                        {teamMembers.map((member, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Paper sx={styles.teamMemberCardStyles}>
                                    <Avatar sx={styles.avatarStyles}>
                                        {member.initial}
                                    </Avatar>
                                    <Typography variant="h6" fontWeight={600}>
                                        {member.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {member.role}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </>
    );
};
