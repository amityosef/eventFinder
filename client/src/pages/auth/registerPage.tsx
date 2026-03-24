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
import { useRegister, useGoogleAuth } from '@/hooks/data';
import { AuthBrand, GoogleSignInButton } from './components';
import { RegisterFormData, RegisterFormErrors } from './types';
import { validateRegisterForm } from './validation';
import * as styles from './styles';

export const RegisterPage = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<RegisterFormErrors>({});

  const mutation = useRegister();
  const googleAuthMutation = useGoogleAuth({
    successMessageKey: 'registerSuccess',
    errorMessageKey: 'registerError',
  });

  const isSubmitting = useMemo(
    () => mutation.isPending || googleAuthMutation.isPending,
    [googleAuthMutation.isPending, mutation.isPending],
  );

  const updateFormField = useCallback(
    <K extends keyof RegisterFormData>(key: K, value: RegisterFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const validate = () => {
    const newErrors = validateRegisterForm(formData, t);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const { confirmPassword, ...submitData } = formData;
    mutation.mutate(submitData);
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
            {t('createAccount')}
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ marginBottom: 4 }}>
            {t('registerDescription')}
          </Typography>

          <GoogleSignInButton
            errorMessageKey="registerError"
            onCredential={handleGoogleCredential}
          />

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              {t('or')}
            </Typography>
          </Divider>

          {/* Register Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('fullName')}
              value={formData.fullName}
              onChange={(e) => updateFormField('fullName', e.target.value)}
              error={!!errors.fullName}
              helperText={errors.fullName}
              sx={{ marginBottom: 2 }}
            />

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
              label={t('phone')}
              value={formData.phone}
              onChange={(e) => updateFormField('phone', e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
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
              sx={{ marginBottom: 2 }}
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

            <TextField
              fullWidth
              label={t('confirmPassword')}
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => updateFormField('confirmPassword', e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              sx={{ marginBottom: 3 }}
              inputProps={{ dir: 'ltr' }}
            />

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
                t('register')
              )}
            </Button>
          </Box>

          <Typography variant="body2" textAlign="center" sx={{ marginTop: 3 }}>
            {t('hasAccount')}{' '}
            <Link to="/login" style={{ color: '#6366f1', fontWeight: 600 }}>
              {t('loginNow')}
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};
