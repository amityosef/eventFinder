import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    TextField,
    Button,
    IconButton,
    CircularProgress,
} from '@mui/material';
import {
    Phone,
    Email,
    LocationOn,
    AccessTime,
    Facebook,
    Instagram,
    LinkedIn,
} from '@mui/icons-material';
import { useSnackbar } from '@/components/snackbar';
import * as styles from './styles';
import { strings } from './strings';
import { consts } from './consts';

export const ContactPage = () => {
    const { t } = useTranslation();
    const { showSnackbar } = useSnackbar();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = t('required');
        }

        if (!formData.email.trim()) {
            newErrors.email = t('required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('invalidEmail');
        }

        if (formData.phone && !consts.phoneRegex.test(formData.phone.replace(/[-\s]/g, ''))) {
            newErrors.phone = t('invalidPhone');
        }

        if (!formData.message.trim()) {
            newErrors.message = t('required');
        } else if (formData.message.length > consts.maxMessageLength) {
            newErrors.message = t('messageTooLong');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);

        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        showSnackbar(strings.successMessage, 'success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    const contactInfo = [
        {
            icon: <Phone />,
            title: t('phone'),
            content: '03-1234567',
            subtitle: t('availableHours'),
        },
        {
            icon: <Email />,
            title: t('email'),
            content: 'info@eventfinder.co.il',
            subtitle: t('responseTime'),
        },
        {
            icon: <LocationOn />,
            title: t('address'),
            content: t('officeAddress'),
            subtitle: t('officeCity'),
        },
        {
            icon: <AccessTime />,
            title: t('workingHours'),
            content: t('weekdayHours'),
            subtitle: t('weekendHours'),
        },
    ];

    return (
        <>
            <Helmet>
                <title>{strings.pageTitle}</title>
                <meta name="description" content={t('contactDescription')} />
            </Helmet>

            <Container maxWidth="lg" sx={styles.containerStyles}>
                <Box sx={styles.headerStyles}>
                    <Typography variant="h2" sx={styles.titleStyles}>
                        {t('contactUs')}
                    </Typography>
                    <Typography variant="h6" sx={styles.subtitleStyles}>
                        {t('contactSubtitle')}
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={7}>
                        <Paper sx={styles.formCardStyles}>
                            <Typography variant="h5" fontWeight={600} gutterBottom>
                                {t('sendMessage')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 3 }}>
                                {t('fillFormDescription')}
                            </Typography>

                            <Box component="form" onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label={t('fullName')}
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            error={!!errors.name}
                                            helperText={errors.name}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label={t('email')}
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            error={!!errors.email}
                                            helperText={errors.email}
                                            inputProps={{ dir: 'ltr' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label={t('phone')}
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            error={!!errors.phone}
                                            helperText={errors.phone}
                                            inputProps={{ dir: 'ltr' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label={t('subject')}
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            label={t('message')}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            error={!!errors.message}
                                            helperText={errors.message}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            size="large"
                                            disabled={isSubmitting}
                                            sx={styles.submitButtonStyles}
                                        >
                                            {isSubmitting ? (
                                                <CircularProgress size={24} color="inherit" />
                                            ) : (
                                                t('send')
                                            )}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Contact Info */}
                    <Grid item xs={12} md={5}>
                        <Paper sx={styles.infoCardStyles}>
                            <Typography variant="h5" fontWeight={600} gutterBottom>
                                {t('contactInfo')}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9, marginBottom: 4 }}>
                                {t('contactInfoDescription')}
                            </Typography>

                            {contactInfo.map((info, index) => (
                                <Box key={index} sx={styles.infoItemStyles}>
                                    <Box sx={styles.infoIconStyles}>
                                        {info.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                                            {info.title}
                                        </Typography>
                                        <Typography variant="body1" fontWeight={500}>
                                            {info.content}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                            {info.subtitle}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}

                            {/* Social Links */}
                            <Box sx={styles.socialLinksStyles}>
                                <IconButton sx={styles.socialButtonStyles}>
                                    <Facebook />
                                </IconButton>
                                <IconButton sx={styles.socialButtonStyles}>
                                    <Instagram />
                                </IconButton>
                                <IconButton sx={styles.socialButtonStyles}>
                                    <LinkedIn />
                                </IconButton>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};
