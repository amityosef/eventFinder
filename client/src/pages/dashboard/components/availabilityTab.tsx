import { useTranslation } from 'react-i18next';
import { Box, Skeleton } from '@mui/material';
import { EmptyState } from '@/components/emptyState';
import { AvailabilityCalendar } from './availabilityTab/availabilityCalendar';
import { AvailabilityDialog } from './availabilityTab/availabilityDialog';
import { AvailabilityToolbar } from './availabilityTab/availabilityToolbar';
import { useAvailabilityTabLogic } from './availabilityTab/useAvailabilityTabLogic';

export const AvailabilityTab = () => {
  const { t } = useTranslation();
  const {
    venues,
    isVenuesLoading,
    selectedVenue,
    setSelectedVenue,
    currentMonth,
    weekDays,
    days,
    startPadding,
    getDateStatus,
    isAvailabilityLoading,
    openDateDialog,
    dialogOpen,
    closeDialog,
    selectedDate,
    status,
    setStatus,
    notes,
    setNotes,
    saveDateAvailability,
    isSaving,
    goToNextMonth,
    goToPreviousMonth,
  } = useAvailabilityTabLogic();

  if (isVenuesLoading) {
    return <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />;
  }

  if (venues.length === 0) {
    return (
      <EmptyState
        title={t('noVenues')}
        description={t('addVenueFirst')}
        illustration="noResults"
      />
    );
  }

  return (
    <Box>
      <AvailabilityToolbar
        venues={venues}
        selectedVenue={selectedVenue}
        onVenueChange={setSelectedVenue}
        texts={{
          title: t('manageAvailability'),
          venueLabel: t('selectVenue'),
        }}
      />

      {!selectedVenue ? (
        <EmptyState
          title={t('selectVenueToManage')}
          description={t('selectVenueDescription')}
          illustration="search"
        />
      ) : isAvailabilityLoading ? (
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
      ) : (
        <AvailabilityCalendar
          currentMonth={currentMonth}
          weekDays={weekDays}
          days={days}
          startPadding={startPadding}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onDateClick={openDateDialog}
          getDateStatus={getDateStatus}
          texts={{
            previousMonth: t('prevMonth'),
            nextMonth: t('nextMonth'),
            translateStatus: (value) => t(value),
          }}
        />
      )}

      <AvailabilityDialog
        open={dialogOpen}
        selectedDate={selectedDate}
        status={status}
        notes={notes}
        isSaving={isSaving}
        onStatusChange={setStatus}
        onNotesChange={setNotes}
        onClose={closeDialog}
        onSave={saveDateAvailability}
        texts={{
          editAvailability: t('editAvailability'),
          status: t('status'),
          available: t('available'),
          booked: t('booked'),
          onHold: t('onHold'),
          notes: t('notes'),
          cancel: t('cancel'),
          save: t('save'),
        }}
      />
    </Box>
  );
};
