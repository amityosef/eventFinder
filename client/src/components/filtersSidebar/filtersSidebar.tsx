import { useTranslation } from 'react-i18next';
import {
    Box,
    Paper,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
    Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    paperStyles,
    headerStyles,
    formControlStyles,
    guestCountBoxStyles,
    priceRangeBoxStyles,
    dividerStyles,
} from './styles';
import { cities, venueTypes } from './consts';
import { strings } from './strings';

interface FiltersSidebarProps {
    filters: {
        city: string;
        venueType: string;
        minGuests: string;
        maxGuests: string;
        minPrice: string;
        maxPrice: string;
        kosher: boolean;
        startDate: Date | null;
        endDate: Date | null;
    };
    onChange: (filters: FiltersSidebarProps['filters']) => void;
}

export const FiltersSidebar = ({ filters, onChange }: FiltersSidebarProps) => {
    const { t } = useTranslation();

    const handleChange = (key: keyof typeof filters, value: string | boolean | Date | null) => {
        onChange({ ...filters, [key]: value });
    };

    const handleClear = () => {
        onChange({
            city: '',
            venueType: '',
            minGuests: '',
            maxGuests: '',
            minPrice: '',
            maxPrice: '',
            kosher: false,
            startDate: null,
            endDate: null,
        });
    };

    return (
        <Paper sx={paperStyles}>
            <Box sx={headerStyles}>
                <Typography variant="h6" fontWeight={600}>
                    {t(strings.filters)}
                </Typography>
                <Button size="small" onClick={handleClear}>
                    {t(strings.clear)}
                </Button>
            </Box>

            <FormControl fullWidth sx={formControlStyles} size="small">
                <InputLabel>{t(strings.city)}</InputLabel>
                <Select
                    value={filters.city}
                    label={t(strings.city)}
                    onChange={(e) => handleChange('city', e.target.value)}
                >
                    <MenuItem value="">
                        <em>{t(strings.allCities)}</em>
                    </MenuItem>
                    {cities.map((city) => (
                        <MenuItem key={city} value={city}>
                            {city}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth sx={formControlStyles} size="small">
                <InputLabel>{t(strings.venueType)}</InputLabel>
                <Select
                    value={filters.venueType}
                    label={t(strings.venueType)}
                    onChange={(e) => handleChange('venueType', e.target.value)}
                >
                    <MenuItem value="">
                        <em>{t(strings.allTypes)}</em>
                    </MenuItem>
                    {venueTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                            {type.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Divider sx={dividerStyles} />

            <Typography variant="subtitle2" gutterBottom>
                {t(strings.guestCount)}
            </Typography>
            <Box sx={guestCountBoxStyles}>
                <TextField
                    size="small"
                    label={t(strings.min)}
                    type="number"
                    value={filters.minGuests}
                    onChange={(e) => handleChange('minGuests', e.target.value)}
                    inputProps={{ min: 0 }}
                />
                <TextField
                    size="small"
                    label={t(strings.max)}
                    type="number"
                    value={filters.maxGuests}
                    onChange={(e) => handleChange('maxGuests', e.target.value)}
                    inputProps={{ min: 0 }}
                />
            </Box>

            <Typography variant="subtitle2" gutterBottom>
                {t(strings.priceRange)} (₪)
            </Typography>
            <Box sx={priceRangeBoxStyles}>
                <TextField
                    size="small"
                    label={t(strings.min)}
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleChange('minPrice', e.target.value)}
                    inputProps={{ min: 0 }}
                />
                <TextField
                    size="small"
                    label={t(strings.max)}
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleChange('maxPrice', e.target.value)}
                    inputProps={{ min: 0 }}
                />
            </Box>

            <Divider sx={dividerStyles} />

            <Typography variant="subtitle2" gutterBottom>
                {t(strings.eventDate)}
            </Typography>
            <Box sx={guestCountBoxStyles}>
                <DatePicker
                    label={t(strings.startDate)}
                    value={filters.startDate}
                    onChange={(date) => handleChange('startDate', date as Date | null)}
                    slotProps={{
                        textField: {
                            size: 'small',
                            fullWidth: true,
                        },
                    }}
                />
                <DatePicker
                    label={t(strings.endDate)}
                    value={filters.endDate}
                    onChange={(date) => handleChange('endDate', date as Date | null)}
                    minDate={filters.startDate || undefined}
                    slotProps={{
                        textField: {
                            size: 'small',
                            fullWidth: true,
                        },
                    }}
                />
            </Box>

            <Divider sx={dividerStyles} />

            <FormControlLabel
                control={
                    <Checkbox
                        checked={filters.kosher}
                        onChange={(e) => handleChange('kosher', e.target.checked)}
                    />
                }
                label={t(strings.kosherOnly)}
            />
        </Paper>
    );
};
