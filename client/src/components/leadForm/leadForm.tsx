import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { he } from 'date-fns/locale';
import { EventType, Venue } from '@/types';
import { useCreateLead } from '@/hooks/data';
import {
    paperStyles,
    priceHeaderStyles,
    priceBoxStyles,
    priceDescriptionStyles,
    formContainerStyles,
    submitButtonStyles,
} from './styles';
import { eventTypes } from './consts';
import { strings } from './strings';

interface LeadFormProps {
    venue: Venue;
}

interface LeadFormData {
    fullName: string;
    phone: string;
    email: string;
    eventType: EventType | '';
    eventDate: Date | null;
    guestCount: string;
    message: string;
}

export const LeadForm = ({ venue }: LeadFormProps) => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState<LeadFormData>({
        fullName: '',
        phone: '',
        email: '',
        eventType: '',
        eventDate: null as Date | null,
        guestCount: '',
        message: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const mutation = useCreateLead(() => {
        setFormData({
            fullName: '',
            phone: '',
            email: '',
            eventType: '',
            eventDate: null,
            guestCount: '',
            message: '',
        });
    });

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = t(strings.required);
        }
        if (!formData.phone.trim()) {
            newErrors.phone = t(strings.required);
        } else if (!/^0\d{8,9}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
            newErrors.phone = t(strings.invalidPhone);
        }
        if (!formData.email.trim()) {
            newErrors.email = t(strings.required);
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t(strings.invalidEmail);
        }
        if (!formData.eventType) {
            newErrors.eventType = t(strings.required);
        }
        if (!formData.guestCount) {
            newErrors.guestCount = t(strings.required);
        }
        if (!formData.eventDate) {
            newErrors.eventDate = t(strings.required);
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        if (!formData.eventDate) return;

        mutation.mutate({
            venueId: venue._id,
            customerName: formData.fullName,
            phone: formData.phone,
            customerEmail: formData.email,
            eventType: formData.eventType || undefined,
            eventDate: formData.eventDate.toISOString(),
            guestsCount: Number(formData.guestCount),
            message: formData.message || undefined,
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('he-IL', {
            style: 'currency',
            currency: 'ILS',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <Paper component="form" onSubmit={handleSubmit} sx={paperStyles}>
            <Box sx={priceHeaderStyles}>
                <Typography variant="body2" color="text.secondary">
                    {t(strings.startingFrom)}
                </Typography>
                <Box sx={priceBoxStyles}>
                    <Typography variant="h4" fontWeight={700} color="primary">
                        {formatPrice(venue.pricing?.pricePerPerson || venue.price?.amount || 0)}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        / {t(strings.perPerson)}
                    </Typography>
                </Box>
            </Box>

            <Typography variant="h6" fontWeight={600} gutterBottom>
                {t(strings.requestQuote)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={priceDescriptionStyles}>
                {t(strings.requestQuoteDescription)}
            </Typography>

            <Box sx={formContainerStyles}>
                <TextField
                    label={t(strings.fullName)}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    required
                    fullWidth
                    size="small"
                />

                <TextField
                    label={t(strings.phone)}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    required
                    fullWidth
                    size="small"
                    inputProps={{ dir: 'ltr' }}
                />

                <TextField
                    label={t(strings.email)}
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                    fullWidth
                    size="small"
                    inputProps={{ dir: 'ltr' }}
                />

                <TextField
                    select
                    label={t(strings.eventType)}
                    value={formData.eventType}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            eventType: e.target.value as EventType | '',
                        })
                    }
                    error={!!errors.eventType}
                    helperText={errors.eventType}
                    required
                    fullWidth
                    size="small"
                >
                    {eventTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                            {type.label}
                        </MenuItem>
                    ))}
                </TextField>

                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={he}>
                    <DatePicker
                        label={t(strings.eventDate)}
                        value={formData.eventDate}
                        onChange={(date) => setFormData({ ...formData, eventDate: date })}
                        slotProps={{
                            textField: {
                                size: 'small',
                                fullWidth: true,
                                error: !!errors.eventDate,
                                helperText: errors.eventDate,
                            },
                        }}
                        minDate={new Date()}
                    />
                </LocalizationProvider>

                <TextField
                    label={t(strings.guestCount)}
                    type="number"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                    error={!!errors.guestCount}
                    helperText={errors.guestCount}
                    required
                    fullWidth
                    size="small"
                    inputProps={{ min: 1 }}
                />

                <TextField
                    label={t(strings.message)}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    multiline
                    rows={3}
                    fullWidth
                    size="small"
                />

                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={mutation.isPending}
                    sx={submitButtonStyles}
                >
                    {mutation.isPending ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        t(strings.sendRequest)
                    )}
                </Button>
            </Box>
        </Paper>
    );
};
