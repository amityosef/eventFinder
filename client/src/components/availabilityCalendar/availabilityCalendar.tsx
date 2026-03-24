import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, IconButton, Chip, Skeleton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    addMonths,
    subMonths,
    isSameMonth,
    isToday,
    isBefore,
    startOfDay,
} from 'date-fns';
import { he } from 'date-fns/locale';
import { useAvailability } from '@/hooks/data';
import {
    containerStyles,
    headerStyles,
    weekDaysGridStyles,
    weekDayCellStyles,
    calendarGridStyles,
    dayCellStyles,
    todayIndicatorStyles,
    legendStyles,
    availableChipStyles,
    bookedChipStyles,
    holdChipStyles,
    skeletonStyles,
} from './styles';
import { consts } from './consts';
import { strings } from './strings';

interface AvailabilityCalendarProps {
    venueId: string;
}

export const AvailabilityCalendar = ({ venueId }: AvailabilityCalendarProps) => {
    const { t } = useTranslation();
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const { data: availability, isLoading } = useAvailability(venueId, currentMonth);

    const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const getDateStatus = (date: Date) => {
        if (!availability) return 'unknown';

        const dateStr = format(date, 'yyyy-MM-dd');
        const dayAvailability = availability.find(
            (a) => format(new Date(a.date), 'yyyy-MM-dd') === dateStr
        );

        if (!dayAvailability) return 'available';
        if (!dayAvailability.isAvailable) return 'booked';
        return 'available';
    };

    const startPadding = startOfMonth(currentMonth).getDay();

    if (isLoading) {
        return <Skeleton variant="rectangular" height={300} sx={skeletonStyles} />;
    }

    return (
        <Box sx={containerStyles}>
            <Box sx={headerStyles}>
                <IconButton onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                    <ChevronRight />
                </IconButton>
                <Typography variant="h6" fontWeight={600}>
                    {format(currentMonth, 'MMMM yyyy', { locale: he })}
                </Typography>
                <IconButton onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                    <ChevronLeft />
                </IconButton>
            </Box>

            <Box sx={weekDaysGridStyles}>
                {consts.WEEK_DAYS.map((day) => (
                    <Box key={day} sx={weekDayCellStyles}>
                        {day}
                    </Box>
                ))}
            </Box>

            <Box sx={calendarGridStyles}>
                {Array.from({ length: startPadding }).map((_, index) => (
                    <Box key={`pad-${index}`} sx={{ py: 2 }} />
                ))}

                {days.map((day) => {
                    const status = getDateStatus(day);
                    const isPast = isBefore(day, startOfDay(new Date()));
                    const isCurrentMonth = isSameMonth(day, currentMonth);

                    return (
                        <Box
                            key={day.toISOString()}
                            sx={{
                                ...dayCellStyles,
                                cursor: status === 'available' && !isPast ? 'pointer' : 'default',
                                '&:hover': {
                                    backgroundColor:
                                        status === 'available' && !isPast ? 'action.hover' : 'transparent',
                                },
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: isToday(day) ? 700 : 400,
                                    color: isPast
                                        ? 'text.disabled'
                                        : !isCurrentMonth
                                            ? 'text.disabled'
                                            : status === 'booked'
                                                ? 'error.main'
                                                : 'text.primary',
                                }}
                            >
                                {format(day, 'd')}
                            </Typography>
                            {isToday(day) && <Box sx={todayIndicatorStyles} />}
                        </Box>
                    );
                })}
            </Box>

            <Box sx={legendStyles}>
                <Chip label={t(strings.available)} size="small" sx={availableChipStyles} />
                <Chip label={t(strings.booked)} size="small" sx={bookedChipStyles} />
                <Chip label={t(strings.onHold)} size="small" sx={holdChipStyles} />
            </Box>
        </Box>
    );
};
