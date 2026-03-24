import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Container, Typography, Button } from '@mui/material';
import { Home, Search } from '@mui/icons-material';

export const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        {/* 404 Illustration */}
        <Box sx={{ marginBottom: 4 }}>
          <svg viewBox="0 0 300 200" width="300" height="200">
            <circle cx="150" cy="100" r="80" fill="#e0e7ff" />
            <text
              x="150"
              y="115"
              textAnchor="middle"
              fontSize="60"
              fontWeight="bold"
              fill="#6366f1"
            >
              404
            </text>
            <circle cx="100" cy="160" r="20" fill="#a5b4fc" opacity="0.5" />
            <circle cx="200" cy="50" r="15" fill="#a5b4fc" opacity="0.5" />
            <circle cx="250" cy="130" r="10" fill="#a5b4fc" opacity="0.5" />
          </svg>
        </Box>

        <Typography variant="h3" fontWeight={700} gutterBottom>
          {t('pageNotFound')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ marginBottom: 4 }}>
          {t('pageNotFoundDescription')}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            component={Link}
            to="/"
            variant="contained"
            size="large"
            startIcon={<Home />}
            sx={{ borderRadius: 2 }}
          >
            {t('backToHome')}
          </Button>
          <Button
            component={Link}
            to="/search"
            variant="outlined"
            size="large"
            startIcon={<Search />}
            sx={{ borderRadius: 2 }}
          >
            {t('searchVenues')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
