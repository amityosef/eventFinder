import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Instagram,
  LinkedIn,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';
import * as styles from './styles';

export const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: t('home'), path: '/' },
    { label: t('venues'), path: '/search' },
    { label: t('about'), path: '/about' },
    { label: t('contact'), path: '/contact' },
  ];

  const venueTypes = [
    { label: t('weddingHalls'), path: '/search?type=weddingHall' },
    { label: t('eventGardens'), path: '/search?type=eventGarden' },
    { label: t('conferenceRooms'), path: '/search?type=conferenceRoom' },
    { label: t('privateSalons'), path: '/search?type=privateSalon' },
  ];

  const legalLinks = [
    { label: t('privacyPolicy'), path: '/privacy' },
    { label: t('termsOfService'), path: '/terms' },
    { label: 'הצהרת נגישות', path: '/accessibility' },
  ];

  return (
    <Box component="footer" sx={styles.footerStyles}>
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={styles.brandSectionStyles}>
              <Box sx={styles.logoStyles}>
                <Box sx={styles.logoIconStyles}>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </Box>
                <Typography variant="h5" fontWeight={700}>
                  EventFinder
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ marginTop: 2 }}>
                {t('footerDescription')}
              </Typography>
              <Box sx={styles.socialLinksStyles}>
                <IconButton size="small" sx={styles.socialButtonStyles}>
                  <Facebook />
                </IconButton>
                <IconButton size="small" sx={styles.socialButtonStyles}>
                  <Instagram />
                </IconButton>
                <IconButton size="small" sx={styles.socialButtonStyles}>
                  <LinkedIn />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {t('quickLinks')}
            </Typography>
            <Box sx={styles.linkListStyles}>
              {quickLinks.map((link) => (
                <Link key={link.path} to={link.path} style={styles.linkStyles}>
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Venue Types */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {t('venueTypes')}
            </Typography>
            <Box sx={styles.linkListStyles}>
              {venueTypes.map((link) => (
                <Link key={link.path} to={link.path} style={styles.linkStyles}>
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Legal & Accessibility */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              משפטי ונגישות
            </Typography>
            <Box sx={styles.linkListStyles}>
              {legalLinks.map((link) => (
                <Link key={link.path} to={link.path} style={styles.linkStyles}>
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {t('contactUs')}
            </Typography>
            <Box sx={styles.contactListStyles}>
              <Box sx={styles.contactItemStyles}>
                <Phone fontSize="small" sx={styles.contactIconStyles} />
                <Typography variant="body2">03-1234567</Typography>
              </Box>
              <Box sx={styles.contactItemStyles}>
                <Email fontSize="small" sx={styles.contactIconStyles} />
                <Typography variant="body2">info@eventfinder.co.il</Typography>
              </Box>
              <Box sx={styles.contactItemStyles}>
                <LocationOn fontSize="small" sx={styles.contactIconStyles} />
                <Typography variant="body2">{t('address')}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Copyright */}
        <Box sx={styles.copyrightStyles}>
          <Typography variant="body2" color="text.secondary">
            © {currentYear} EventFinder. {t('allRightsReserved')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
