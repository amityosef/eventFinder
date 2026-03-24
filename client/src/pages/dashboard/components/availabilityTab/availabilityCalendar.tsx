import { Box, Button, Chip, Typography } from '@mui/material';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { AvailabilityStatus } from '@/types';
import {
    calendarContainerStyles,
    calendarHeaderStyles,
    dayCellBaseStyles,
    dayHeaderCellStyles,
    daysGridStyles,
    emptyPaddingCellStyles,
    weekDaysGridStyles,
} from './availabilityTab.styles';

interface AvailabilityCalendarTexts {
    previousMonth: string;
    nextMonth: string;
    translateStatus: (status: AvailabilityStatus) => string;
}

interface AvailabilityCalendarProps {
    currentMonth: Date;
    weekDays: string[];
    days: Date[];
    startPadding: number;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    onDateClick: (date: Date) => void;
    getDateStatus: (date: Date) => AvailabilityStatus;
    texts: AvailabilityCalendarTexts;
}

const statusColorMap: Record<AvailabilityStatus, string> = {
    available: '#10b981',
    booked: '#ef4444',
    hold: '#f59e0b',
};

const statusBgMap: Record<AvailabilityStatus, string> = {
    available: 'transparent',
    booked: '#fee2e2',
    hold: '#fef3c7',
};

const statusHoverBgMap: Record<AvailabilityStatus, string> = {
    available: '#f1f5f9',
    booked: '#fecaca',
    hold: '#fde68a',
};

export const AvailabilityCalendar = ({
    currentMonth,
    weekDays,
    days,
    startPadding,
    onPreviousMonth,
    onNextMonth,
    onDateClick,
    getDateStatus,
    texts,
}: AvailabilityCalendarProps) => {
    return (
        <Box sx={calendarContainerStyles}>
            <Box sx={calendarHeaderStyles}>
                <Button onClick={onPreviousMonth}>{texts.previousMonth}</Button>
                <Typography variant="h6" fontWeight={600}>
                    {format(currentMonth, 'MMMM yyyy', { locale: he })}
                </Typography>
                <Button onClick={onNextMonth}>{texts.nextMonth}</Button>
            </Box>
            <Box sx={weekDaysGridStyles}>
                {weekDays.map((day) => (
                    <Box key={day} sx={dayHeaderCellStyles}>
                        {day}
                    </Box>
                ))}
            </Box>
            <Box sx={daysGridStyles}>
                {Array.from({ length: startPadding }).map((_, index) => (
                    <Box key={`pad-${index}`} sx={emptyPaddingCellStyles} />
                ))}
                {days.map((day) => {
                    const status = getDateStatus(day);
                    return (
                        <Box
                            key={day.toISOString()}
                            onClick={() => onDateClick(day)}
                            sx={{
                                ...dayCellBaseStyles,
                                backgroundColor: statusBgMap[status],
                                '&:hover': { backgroundColor: statusHoverBgMap[status] },
                            }}
                        >
                            <Typography variant="body2" fontWeight={500}>
                                {format(day, 'd')}
                            </Typography>
                            <Chip
                                label={texts.translateStatus(status)}
                                size="small"
                                sx={{
                                    marginTop: 0.5,
                                    fontSize: '0.65rem',
                                    height: 20,
                                    backgroundColor: statusColorMap[status],
                                    color: 'white',
                                }}
                            />
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};
