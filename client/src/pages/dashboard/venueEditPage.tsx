import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { useVenue } from '@/hooks/data';
import { api } from '@/services/api';
import { useSnackbar } from '@/components/snackbar';

interface VenueEditForm {
    name: string;
    description: string;
    city: string;
    region: string;
    address: string;
    minCapacity: string;
    maxCapacity: string;
    priceAmount: string;
    contactEmail: string;
    contactPhone: string;
}

const mapVenueToForm = (venue: any): VenueEditForm => ({
    name: venue?.name || '',
    description: venue?.description || '',
    city: venue?.location?.city || venue?.address?.city || '',
    region: venue?.location?.region || '',
    address: venue?.location?.address || venue?.address?.street || '',
    minCapacity: String(venue?.capacity?.min ?? ''),
    maxCapacity: String(venue?.capacity?.max ?? ''),
    priceAmount: String(venue?.price?.amount ?? venue?.pricing?.pricePerPerson ?? ''),
    contactEmail: venue?.contactEmail || venue?.contact?.email || '',
    contactPhone: venue?.contactPhone || venue?.contact?.phone || '',
});

export const VenueEditPage = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const { data: venue, isLoading } = useVenue(id);

    const [form, setForm] = useState<VenueEditForm>({
        name: '',
        description: '',
        city: '',
        region: '',
        address: '',
        minCapacity: '',
        maxCapacity: '',
        priceAmount: '',
        contactEmail: '',
        contactPhone: '',
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (venue) {
            setForm(mapVenueToForm(venue));
        }
    }, [venue]);

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

    const handleChange = (key: keyof VenueEditForm, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!id || !venue || !canSubmit) {
            return;
        }

        setIsSaving(true);

        try {
            await api.updateVenue(id, {
                name: form.name.trim(),
                description: form.description.trim(),
                location: {
                    city: form.city.trim(),
                    region: form.region.trim(),
                    address: form.address.trim(),
                    neighborhood: venue.location?.neighborhood || '',
                },
                capacity: {
                    min: Number(form.minCapacity),
                    max: Number(form.maxCapacity),
                },
                price: {
                    amount: Number(form.priceAmount),
                    type: venue.price?.type || 'perPerson',
                    currency: venue.price?.currency || 'ILS',
                },
                features: venue.features || {},
                gallery: (venue.gallery || []).map((image: any) =>
                    typeof image === 'string' ? image : image.original,
                ),
                mainImage: venue.mainImage,
                contactEmail: form.contactEmail.trim() || undefined,
                contactPhone: form.contactPhone.trim() || undefined,
                website: venue.website,
            });

            showSnackbar('Venue updated successfully', 'success');
            navigate('/dashboard');
        } catch {
            showSnackbar('Failed to update venue. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (!venue) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                    Venue not found
                </Typography>
                <Button variant="contained" onClick={() => navigate('/dashboard')}>
                    {t('dashboard')}
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Paper sx={{ p: { xs: 2.5, md: 4 } }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Edit Venue
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Update core details for your venue.
                </Typography>

                <Box component="form" onSubmit={handleSave}>
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
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="City"
                                value={form.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
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
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
                        <Button variant="text" onClick={() => navigate('/dashboard')} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" disabled={!canSubmit || isSaving}>
                            {isSaving ? <CircularProgress size={20} color="inherit" /> : 'Save changes'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};
