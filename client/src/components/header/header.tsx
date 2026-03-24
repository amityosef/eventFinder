import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Container,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Logout,
  Favorite,
  DarkMode,
  LightMode,
  Language,
} from '@mui/icons-material';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { api } from '@/services/api';
import { useSnackbar } from '../snackbar';
import * as styles from './styles';
import { strings } from './strings';

export const Header = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const { user, isAuthenticated, logout } = useAuthStore();
  const { mode, toggleTheme } = useThemeStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLangMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangMenuClose = () => {
    setLangAnchorEl(null);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    handleLangMenuClose();
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore errors
    }
    logout();
    handleMenuClose();
    showSnackbar(t(strings.logoutSuccess), 'success');
    navigate('/');
  };

  const navItems = [
    { label: t('home'), path: '/' },
    { label: t('venues'), path: '/search' },
    { label: t('about'), path: '/about' },
    { label: t('contact'), path: '/contact' },
  ];

  // Add dashboard to nav for authenticated users
  const navItemsWithDashboard = isAuthenticated && user?.role === 'admin'
    ? [...navItems.slice(0, 2), { label: t('dashboard'), path: '/dashboard' }, ...navItems.slice(2)]
    : navItems;

  const languages = [
    { code: 'he', label: 'עברית' },
    { code: 'en', label: 'English' },
  ];

  return (
    <AppBar position="sticky" sx={styles.appBarStyles}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={styles.toolbarStyles}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Box sx={styles.logoStyles}>
              <Box sx={styles.logoIconStyles}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </Box>
              <Box component="span" sx={styles.logoTextStyles}>
                EventFinder
              </Box>
            </Box>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={styles.navLinksStyles}>
              {navItemsWithDashboard.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={styles.navLinkStyles}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Auth Buttons / User Menu */}
          <Box sx={styles.authSectionStyles}>
            {/* Theme Toggle */}
            <Tooltip title={mode === 'light' ? t('darkMode') : t('lightMode')}>
              <IconButton onClick={toggleTheme} sx={styles.iconButtonStyles}>
                {mode === 'light' ? <DarkMode /> : <LightMode />}
              </IconButton>
            </Tooltip>

            {/* Language Menu */}
            <Tooltip title={t('changeLanguage')}>
              <IconButton onClick={handleLangMenuOpen} sx={styles.iconButtonStyles}>
                <Language />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={langAnchorEl}
              open={Boolean(langAnchorEl)}
              onClose={handleLangMenuClose}
            >
              {languages.map((lang) => (
                <MenuItem
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  selected={i18n.language === lang.code}
                >
                  {lang.label}
                </MenuItem>
              ))}
            </Menu>

            {isAuthenticated && user ? (
              <>
                {!isMobile && (
                  <Typography variant="body2" sx={{ mr: 1, fontWeight: 500 }}>
                    {user.fullName}
                  </Typography>
                )}
                <IconButton onClick={handleMenuOpen} sx={styles.avatarButtonStyles}>
                  <Avatar
                    src={user.avatar || undefined}
                    alt={user.fullName || 'User'}
                    sx={styles.avatarStyles}
                  >
                    {user.fullName?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  sx={styles.menuStyles}
                >
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate('/dashboard');
                    }}
                  >
                    <Dashboard sx={{ ml: 1 }} />
                    {t('dashboard')}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate('/favorites');
                    }}
                  >
                    <Favorite sx={{ ml: 1 }} />
                    {t('favorites')}
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ ml: 1 }} />
                    {t('logout')}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                {!isMobile && (
                  <Button
                    component={Link}
                    to="/login"
                    sx={styles.loginButtonStyles}
                  >
                    {t('login')}
                  </Button>
                )}
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={styles.registerButtonStyles}
                >
                  {t('register')}
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                sx={styles.menuButtonStyles}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>

          {/* Mobile Drawer */}
          <Drawer
            anchor="right"
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          >
            <Box sx={styles.drawerStyles}>
              <List>
                {navItemsWithDashboard.map((item) => (
                  <ListItem key={item.path} disablePadding>
                    <ListItemButton
                      component={Link}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
                {!isAuthenticated && (
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <ListItemText primary={t('login')} />
                    </ListItemButton>
                  </ListItem>
                )}
              </List>
            </Box>
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
