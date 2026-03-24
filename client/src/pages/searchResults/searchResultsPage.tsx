import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Grid,
  FormControl,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Button,
  Pagination,
} from '@mui/material';
import {
  GridView,
  ViewList,
  FilterList,
  Close,
} from '@mui/icons-material';
import { SearchBar } from '@/components/searchBar';
import { VenueCard } from '@/components/venueCard';
import { EmptyState } from '@/components/emptyState';
import { VenueCardSkeleton } from '@/components/venueCard';
import { FiltersSidebar } from '@/components/filtersSidebar';
import { useSearchVenues } from '@/hooks/data';
import * as styles from './styles';

export const SearchResultsPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('stats.averageRating');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    venueType: searchParams.get('type') || '',
    minGuests: searchParams.get('minGuests') || '',
    maxGuests: searchParams.get('maxGuests') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    kosher: searchParams.get('kosher') === 'true',
    startDate: searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : null,
    endDate: searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : null,
  });

  const query = searchParams.get('q') || '';

  const { data, isLoading } = useSearchVenues({
    search: query,
    city: filters.city || undefined,
    venueType: filters.venueType || undefined,
    minGuests: filters.minGuests ? Number(filters.minGuests) : undefined,
    maxGuests: filters.maxGuests ? Number(filters.maxGuests) : undefined,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    kosher: filters.kosher || undefined,
    startDate: filters.startDate ? filters.startDate.toISOString().split('T')[0] : undefined,
    endDate: filters.endDate ? filters.endDate.toISOString().split('T')[0] : undefined,
    sortBy,
    sortOrder: 'desc',
    page,
    limit: 12,
  });

  const venues = data?.venues || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const total = data?.pagination?.total || 0;

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.city) params.set('city', filters.city);
    if (filters.venueType) params.set('type', filters.venueType);
    if (filters.startDate) params.set('startDate', filters.startDate.toISOString().split('T')[0]);
    if (filters.endDate) params.set('endDate', filters.endDate.toISOString().split('T')[0]);
    setSearchParams(params);
  }, [query, filters, setSearchParams]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <Box sx={styles.containerStyles}>
      <Container maxWidth="xl">
        {/* Search Header */}
        <Box sx={styles.searchHeaderStyles}>
          <SearchBar compact initialQuery={query} showFilters={false} />
        </Box>

        {/* Results Header */}
        <Box sx={styles.resultsHeaderStyles}>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              {query ? `${t('resultsFor')} "${query}"` : t('allVenues')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {total} {t('venuesFound')}
            </Typography>
          </Box>

          <Box sx={styles.controlsStyles}>
            {isMobile && (
              <Button
                startIcon={<FilterList />}
                onClick={() => setFiltersOpen(true)}
                variant="outlined"
                size="small"
              >
                {t('filters')}
              </Button>
            )}

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                displayEmpty
              >
                <MenuItem value="stats.averageRating">{t('sortByRating')}</MenuItem>
                <MenuItem value="pricing.pricePerPerson">{t('sortByPrice')}</MenuItem>
                <MenuItem value="createdAt">{t('sortByNewest')}</MenuItem>
              </Select>
            </FormControl>

            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, value) => value && setViewMode(value)}
              size="small"
            >
              <ToggleButton value="grid">
                <GridView />
              </ToggleButton>
              <ToggleButton value="list">
                <ViewList />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Filters Sidebar - Desktop */}
          {!isMobile && (
            <Grid item xs={12} md={3}>
              <FiltersSidebar
                filters={filters}
                onChange={handleFilterChange}
              />
            </Grid>
          )}

          {/* Results Grid */}
          <Grid item xs={12} md={isMobile ? 12 : 9}>
            {isLoading ? (
              <Grid container spacing={3}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Grid item xs={12} sm={6} lg={viewMode === 'grid' ? 4 : 12} key={index}>
                    <VenueCardSkeleton />
                  </Grid>
                ))}
              </Grid>
            ) : venues.length === 0 ? (
              <EmptyState
                title={t('noVenuesFound')}
                description={t('noVenuesDescription')}
                illustration="noResults"
                actionLabel={t('clearFilters')}
                onAction={() => handleFilterChange({
                  city: '',
                  venueType: '',
                  minGuests: '',
                  maxGuests: '',
                  minPrice: '',
                  maxPrice: '',
                  kosher: false,
                  startDate: null,
                  endDate: null,
                })}
              />
            ) : (
              <>
                <Grid container spacing={3}>
                  {venues.map((venue) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      lg={viewMode === 'grid' ? 4 : 12}
                      key={venue._id}
                    >
                      <VenueCard venue={venue} />
                    </Grid>
                  ))}
                </Grid>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box sx={styles.paginationStyles}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(_, value) => setPage(value)}
                      color="primary"
                      size="large"
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>

        {/* Mobile Filters Drawer */}
        <Drawer
          anchor="right"
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
        >
          <Box sx={styles.drawerStyles}>
            <Box sx={styles.drawerHeaderStyles}>
              <Typography variant="h6" fontWeight={600}>
                {t('filters')}
              </Typography>
              <IconButton onClick={() => setFiltersOpen(false)}>
                <Close />
              </IconButton>
            </Box>
            <FiltersSidebar
              filters={filters}
              onChange={handleFilterChange}
            />
          </Box>
        </Drawer>
      </Container>
    </Box>
  );
};
