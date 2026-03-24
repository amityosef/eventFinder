import { useTranslation } from 'react-i18next';
import { Box, Container, Typography } from '@mui/material';
import {
    heroContainerStyles,
    decorativeElement1Styles,
    decorativeElement2Styles,
    contentContainerStyles,
    contentBoxStyles,
    titleStyles,
    subtitleStyles,
} from './styles';
import { strings } from './strings';

export const HeroSection = () => {
    const { t } = useTranslation();

    return (
        <Box sx={heroContainerStyles}>
            <Box sx={decorativeElement1Styles} />
            <Box sx={decorativeElement2Styles} />

            <Container maxWidth="lg" sx={contentContainerStyles}>
                <Box sx={contentBoxStyles}>
                    <Typography variant="h1" sx={titleStyles}>
                        {t(strings.heroTitle)}
                    </Typography>
                    <Typography variant="h5" sx={subtitleStyles}>
                        {t(strings.heroSubtitle)}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};
