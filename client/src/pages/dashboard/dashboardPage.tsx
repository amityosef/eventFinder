import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Business,
  Mail,
  People,
  Star,
  CalendarMonth,
} from '@mui/icons-material';
import { useAuthStore } from '@/store/authStore';
import { useMyVenues, useLeads } from '@/hooks/data';
import { VenuesTab } from './components/venuesTab';
import { LeadsTab } from './components/leadsTab';
import { AvailabilityTab } from './components/availabilityTab';
import * as styles from './styles';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <Box role="tabpanel" hidden={value !== index} sx={{ paddingTop: 3 }}>
    {value === index && children}
  </Box>
);

export const DashboardPage = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);

  const { data: venuesData } = useMyVenues();
  const { data: leadsData } = useLeads({ status: 'new' });

  const venues = venuesData?.venues || [];
  const totalLeads = leadsData?.leads?.length || 0;

  const stats = [
    {
      icon: <Business />,
      value: venues.length,
      label: t('myVenues'),
      color: '#6366f1',
    },
    {
      icon: <Mail />,
      value: totalLeads,
      label: t('newLeads'),
      color: '#f59e0b',
    },
    {
      icon: <Star />,
      value: venues.reduce((acc, v) => acc + (v.stats?.averageRating || 0), 0) / venues.length || 0,
      label: t('averageRating'),
      color: '#10b981',
      format: (v: number) => v.toFixed(1),
    },
    {
      icon: <People />,
      value: venues.reduce((acc, v) => acc + (v.stats?.totalViews || 0), 0),
      label: t('totalViews'),
      color: '#8b5cf6',
    },
  ];

  return (
    <Box sx={styles.containerStyles}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={styles.headerStyles}>
          <Box sx={styles.userInfoStyles}>
            <Avatar
              src={user?.avatar || undefined}
              sx={styles.avatarStyles}
            >
              {user?.fullName?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700}>
                {t('welcomeUser', { name: user?.fullName?.split(' ')[0] })}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('dashboardSubtitle')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ marginBottom: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper sx={styles.statCardStyles}>
                <Box
                  sx={{
                    ...styles.statIconStyles,
                    backgroundColor: `${stat.color}15`,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography variant="h4" fontWeight={700}>
                  {stat.format ? stat.format(stat.value as number) : stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Tabs */}
        <Paper sx={styles.tabsContainerStyles}>
          <Tabs
            value={tabValue}
            onChange={(_, value) => setTabValue(value)}
            sx={styles.tabsStyles}
          >
            <Tab
              icon={<Business />}
              iconPosition="start"
              label={t('venues')}
            />
            <Tab
              icon={<Mail />}
              iconPosition="start"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {t('leads')}
                  {totalLeads > 0 && (
                    <Chip
                      label={totalLeads}
                      size="small"
                      color="primary"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              }
            />
            <Tab
              icon={<CalendarMonth />}
              iconPosition="start"
              label={t('availability')}
            />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <VenuesTab />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <LeadsTab />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <AvailabilityTab />
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};
