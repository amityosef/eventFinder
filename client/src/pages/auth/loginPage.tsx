import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useLogin, useGoogleAuth } from '@/hooks/data';
import { AuthBrand, GoogleSignInButton } from './components';
import { LoginFormData, LoginFormErrors } from './types';
import { validateLoginForm } from './validation';
import * as styles from './styles';

export const LoginPage = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const mutation = useLogin();
  const googleAuthMutation = useGoogleAuth();

  const isSubmitting = useMemo(
    () => mutation.isPending || googleAuthMutation.isPending,
    [googleAuthMutation.isPending, mutation.isPending],
  );

  const updateFormField = useCallback(
    <K extends keyof LoginFormData>(key: K, value: LoginFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const validate = () => {
    const newErrors = validateLoginForm(formData, t);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate(formData);
  }, [formData, mutation]);

  const handleGoogleCredential = useCallback(
    (credential: string) => {
      googleAuthMutation.mutate({ credential });
    },
    [googleAuthMutation],
  );

  return (
    <Box sx={styles.containerStyles}>
      <Container maxWidth="sm">
        <Paper sx={styles.paperStyles}>
          <AuthBrand />

          <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
            {t('welcomeBack')}
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ marginBottom: 4 }}>
            {t('loginDescription')}
          </Typography>

          <GoogleSignInButton
            errorMessageKey="loginError"
            onCredential={handleGoogleCredential}
          />

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {t('or')}
            </Typography>
          </Divider>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('email')}
              type="email"
              value={formData.email}
              onChange={(e) => updateFormField('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ marginBottom: 2 }}
              inputProps={{ dir: 'ltr' }}
            />

            <TextField
              fullWidth
              label={t('password')}
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => updateFormField('password', e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ marginBottom: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              inputProps={{ dir: 'ltr' }}
            />

            <Box sx={{ textAlign: 'left', marginBottom: 3 }}>
              <Link to="/forgot-password" style={{ color: '#6366f1', fontSize: '0.875rem' }}>
                {t('forgotPassword')}
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={styles.submitButtonStyles}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t('login')
              )}
            </Button>
          </Box>

          <Typography variant="body2" textAlign="center" sx={{ marginTop: 3 }}>
            {t('noAccount')}{' '}
            <Link to="/register" style={{ color: '#6366f1', fontWeight: 600 }}>
              {t('registerNow')}
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};
