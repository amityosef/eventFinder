import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  InputBase,
  Button,
  IconButton,
  Collapse,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Tune,
  Close,
  AutoAwesome,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDebounce } from '@/hooks/useDebounce';
import * as styles from './styles';

interface SearchBarProps {
  onSearch?: (query: string, filters: SearchFilters) => void;
  showFilters?: boolean;
  initialQuery?: string;
  compact?: boolean;
}

export interface SearchFilters {
  city?: string;
  venueType?: string;
  guestCount?: number;
  priceRange?: [number, number];
  kosher?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
}

const cities = [
  'תל אביב',
  'ירושלים',
  'חיפה',
  'באר שבע',
  'ראשון לציון',
  'פתח תקווה',
  'נתניה',
  'אשדוד',
  'הרצליה',
  'רמת גן',
];

const venueTypes = [
  { value: 'weddingHall', label: 'אולם אירועים' },
  { value: 'eventGarden', label: 'גן אירועים' },
  { value: 'conferenceRoom', label: 'אולם כנסים' },
  { value: 'privateSalon', label: 'סלון פרטי' },
  { value: 'restaurant', label: 'מסעדה' },
  { value: 'hotel', label: 'מלון' },
];

export const SearchBar = ({
  onSearch,
  showFilters = true,
  initialQuery = '',
  compact = false,
}: SearchBarProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const [query, setQuery] = useState(initialQuery);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    city: '',
    venueType: '',
    guestCount: 100,
    priceRange: [100, 1000],
    kosher: false,
    startDate: null,
    endDate: null,
  });

  const debouncedQuery = useDebounce(query, 300);

  const handleSearch = useCallback(() => {
    if (onSearch) {
      onSearch(debouncedQuery, filters);
    } else {
      // Navigate to search results
      const params = new URLSearchParams();
      if (debouncedQuery) params.set('q', debouncedQuery);
      if (filters.city) params.set('city', filters.city);
      if (filters.venueType) params.set('type', filters.venueType);
      if (filters.guestCount) params.set('guests', String(filters.guestCount));
      if (filters.startDate) params.set('startDate', filters.startDate.toISOString().split('T')[0]);
      if (filters.endDate) params.set('endDate', filters.endDate.toISOString().split('T')[0]);
      navigate(`/search?${params.toString()}`);
    }
  }, [debouncedQuery, filters, onSearch, navigate]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box sx={compact ? styles.containerCompactStyles : styles.containerStyles}>
      <Paper sx={compact ? styles.searchBarCompactStyles : styles.searchBarStyles}>
        <Box sx={styles.inputWrapperStyles}>
          <AutoAwesome sx={styles.aiIconStyles} />
          <InputBase
            placeholder={t('searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={styles.inputStyles}
            fullWidth
          />
          {query && (
            <IconButton size="small" onClick={() => setQuery('')}>
              <Close fontSize="small" />
            </IconButton>
          )}
        </Box>

        {showFilters && (
          <IconButton
            onClick={() => setFiltersOpen(!filtersOpen)}
            sx={styles.filterButtonStyles}
          >
            <Tune />
          </IconButton>
        )}

        <Button
          variant="contained"
          onClick={handleSearch}
          sx={styles.searchButtonStyles}
          startIcon={!isMobile && <SearchIcon />}
        >
          {isMobile ? <SearchIcon /> : t('search')}
        </Button>
      </Paper>

      {showFilters && (
        <Collapse in={filtersOpen}>
          <Paper sx={styles.filtersPanelStyles}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('city')}</InputLabel>
                  <Select
                    value={filters.city}
                    label={t('city')}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  >
                    <MenuItem value="">
                      <em>{t('allCities')}</em>
                    </MenuItem>
                    {cities.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>{t('venueType')}</InputLabel>
                  <Select
                    value={filters.venueType}
                    label={t('venueType')}
                    onChange={(e) => setFilters({ ...filters, venueType: e.target.value })}
                  >
                    <MenuItem value="">
                      <em>{t('allTypes')}</em>
                    </MenuItem>
                    {venueTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  {t('guestCount')}: {filters.guestCount}
                </Typography>
                <Slider
                  value={filters.guestCount}
                  onChange={(_, value) => setFilters({ ...filters, guestCount: value as number })}
                  min={20}
                  max={1000}
                  step={10}
                  valueLabelDisplay="auto"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  {t('priceRange')}: ₪{filters.priceRange?.[0]} - ₪{filters.priceRange?.[1]}
                </Typography>
                <Slider
                  value={filters.priceRange}
                  onChange={(_, value) => setFilters({ ...filters, priceRange: value as [number, number] })}
                  min={50}
                  max={2000}
                  step={50}
                  valueLabelDisplay="auto"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label={t('startDate')}
                  value={filters.startDate}
                  onChange={(date) => setFilters({ ...filters, startDate: date })}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label={t('endDate')}
                  value={filters.endDate}
                  onChange={(date) => setFilters({ ...filters, endDate: date })}
                  minDate={filters.startDate || undefined}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Collapse>
      )}
    </Box>
  );
};
