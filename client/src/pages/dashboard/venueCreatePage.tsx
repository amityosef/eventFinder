import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { api } from '@/services/api';
import { useSnackbar } from '@/components/snackbar';

interface VenueCreateForm {
    name: string;
    description: string;
    city: string;
    neighborhood: string;
    region: string;
    address: string;
    minCapacity: string;
    maxCapacity: string;
    priceAmount: string;
    contactEmail: string;
    contactPhone: string;
    website: string;
}

export const VenueCreatePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();

    const [form, setForm] = useState<VenueCreateForm>({
        name: '',
        description: '',
        city: '',
        neighborhood: '',
        region: '',
        address: '',
        minCapacity: '',
        maxCapacity: '',
        priceAmount: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
    });
    const [isSaving, setIsSaving] = useState(false);

    const canSubmit = useMemo(() => {
        return (
            form.name.trim() &&
            form.description.trim() &&
            form.city.trim() &&
            form.region.trim() &&
            form.address.trim() &&
            Number(form.minCapacity) > 0 &&
            Number(form.maxCapacity) >= Number(form.minCapacity) &&
            Number(form.priceAmount) >= 0
        );
    }, [form]);

    const handleChange = (key: keyof VenueCreateForm, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleCreate = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!canSubmit) {
            return;
        }

        setIsSaving(true);

        try {
            await api.createVenue({
                name: form.name.trim(),
                description: form.description.trim(),
                location: {
                    city: form.city.trim(),
                    neighborhood: form.neighborhood.trim() || undefined,
                    region: form.region.trim(),
                    address: form.address.trim(),
                },
                capacity: {
                    min: Number(form.minCapacity),
                    max: Number(form.maxCapacity),
                },
                price: {
                    amount: Number(form.priceAmount),
                    type: 'perPerson',
                    currency: 'ILS',
                },
                features: {},
                gallery: [],
                contactEmail: form.contactEmail.trim() || undefined,
                contactPhone: form.contactPhone.trim() || undefined,
                website: form.website.trim() || undefined,
            });

            showSnackbar('Venue created successfully', 'success');
            navigate('/dashboard');
        } catch {
            showSnackbar('Failed to create venue. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Paper sx={{ p: { xs: 2.5, md: 4 } }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    {t('addVenue')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Add a new venue to your dashboard.
                </Typography>

                <Box component="form" onSubmit={handleCreate}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Venue name"
                                value={form.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={4}
                                label="Description"
                                value={form.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="City"
                                value={form.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Neighborhood"
                                value={form.neighborhood}
                                onChange={(e) => handleChange('neighborhood', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Region"
                                value={form.region}
                                onChange={(e) => handleChange('region', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                value={form.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Min capacity"
                                value={form.minCapacity}
                                onChange={(e) => handleChange('minCapacity', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Max capacity"
                                value={form.maxCapacity}
                                onChange={(e) => handleChange('maxCapacity', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Price per person"
                                value={form.priceAmount}
                                onChange={(e) => handleChange('priceAmount', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Contact email"
                                value={form.contactEmail}
                                onChange={(e) => handleChange('contactEmail', e.target.value)}
                                inputProps={{ dir: 'ltr' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Contact phone"
                                value={form.contactPhone}
                                onChange={(e) => handleChange('contactPhone', e.target.value)}
                                inputProps={{ dir: 'ltr' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Website"
                                value={form.website}
                                onChange={(e) => handleChange('website', e.target.value)}
                                inputProps={{ dir: 'ltr' }}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
                        <Button variant="text" onClick={() => navigate('/dashboard')} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" disabled={!canSubmit || isSaving}>
                            {isSaving ? <CircularProgress size={20} color="inherit" /> : 'Create venue'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};
