import { useCallback, useMemo, useState } from 'react';
import { addMonths, eachDayOfInterval, endOfMonth, format, isSameDay, startOfMonth, subMonths } from 'date-fns';
import { AvailabilityStatus } from '@/types';
import { useMyVenues, useUpdateAvailability, useVenueAvailability } from '@/hooks/data';

const WEEK_DAYS = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

export const useAvailabilityTabLogic = () => {
    const [selectedVenue, setSelectedVenue] = useState<string>('');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [status, setStatus] = useState<AvailabilityStatus>('available');
    const [notes, setNotes] = useState('');

    const { data: venuesData, isLoading: isVenuesLoading } = useMyVenues();
    const venues = venuesData?.venues ?? [];

    const { data: availability, isLoading: isAvailabilityLoading } = useVenueAvailability(
        selectedVenue || undefined,
        currentMonth,
    );

    const closeDialog = useCallback(() => {
        setDialogOpen(false);
    }, []);

    const updateMutation = useUpdateAvailability(closeDialog);

    const days = useMemo(
        () =>
            eachDayOfInterval({
                start: startOfMonth(currentMonth),
                end: endOfMonth(currentMonth),
            }),
        [currentMonth],
    );

    const startPadding = useMemo(() => startOfMonth(currentMonth).getDay(), [currentMonth]);

    const getDateStatus = useCallback(
        (date: Date): AvailabilityStatus => {
            if (!availability) {
                return 'available';
            }

            const entriesForDate = availability.filter((entry) => isSameDay(new Date(entry.date), date));
            if (entriesForDate.length === 0) {
                return 'available';
            }

            const fullDay = entriesForDate.find((entry) => entry.slot === 'fullDay');
            if (fullDay?.status) {
                return fullDay.status;
            }

            if (entriesForDate.some((entry) => entry.status === 'hold')) {
                return 'hold';
            }

            return entriesForDate.some((entry) => entry.status === 'booked' || entry.isAvailable === false)
                ? 'booked'
                : 'available';
        },
        [availability],
    );

    const openDateDialog = useCallback(
        (date: Date) => {
            setSelectedDate(date);
            setStatus(getDateStatus(date));
            const found = availability?.find((entry) => isSameDay(new Date(entry.date), date));
            setNotes(found?.notes ?? '');
            setDialogOpen(true);
        },
        [availability, getDateStatus],
    );

    const saveDateAvailability = useCallback(() => {
        if (!selectedVenue || !selectedDate) {
            return;
        }

        updateMutation.mutate({
            venueId: selectedVenue,
            date: format(selectedDate, 'yyyy-MM-dd'),
            status,
            notes: notes || undefined,
        });
    }, [notes, selectedDate, selectedVenue, status, updateMutation]);

    return {
        venues,
        isVenuesLoading,
        selectedVenue,
        setSelectedVenue,
        currentMonth,
        setCurrentMonth,
        weekDays: WEEK_DAYS,
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
        isSaving: updateMutation.isPending,
        goToNextMonth: () => setCurrentMonth((value) => addMonths(value, 1)),
        goToPreviousMonth: () => setCurrentMonth((value) => subMonths(value, 1)),
    };
};
