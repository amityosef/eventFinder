import { SystemStyleObject } from '@mui/system';

export const paperStyles: SystemStyleObject = {
    padding: 3,
    borderRadius: 2,
    position: 'sticky',
    top: 100,
};

export const headerStyles: SystemStyleObject = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
};

export const formControlStyles: SystemStyleObject = {
    marginBottom: 3,
};

export const guestCountBoxStyles: SystemStyleObject = {
    display: 'flex',
    gap: 2,
    marginBottom: 3,
};

export const priceRangeBoxStyles: SystemStyleObject = {
    display: 'flex',
    gap: 2,
    marginBottom: 3,
};

export const dividerStyles: SystemStyleObject = {
    my: 2,
};

export const dateRangeStyles: SystemStyleObject = {
    marginBottom: 3,
    '& .MuiPickersDay-root': {
        '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
                backgroundColor: 'primary.dark',
            },
        },
    },
    '& .MuiDateRangePickerDay-rangeIntervalDayHighlight': {
        backgroundColor: 'primary.light',
        opacity: 0.2,
    },
};
