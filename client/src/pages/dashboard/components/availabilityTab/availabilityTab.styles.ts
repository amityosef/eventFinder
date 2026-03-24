import { SxProps, Theme } from '@mui/material';

export const toolbarStyles: SxProps<Theme> = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
};

export const venueSelectStyles: SxProps<Theme> = {
    minWidth: 200,
};

export const calendarContainerStyles: SxProps<Theme> = {
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 2,
    overflow: 'hidden',
};

export const calendarHeaderStyles: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 2,
    backgroundColor: '#f8fafc',
};

export const weekDaysGridStyles: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    borderBottom: '1px solid',
    borderColor: 'divider',
};

export const dayHeaderCellStyles: SxProps<Theme> = {
    py: 1,
    textAlign: 'center',
    fontWeight: 600,
    color: 'text.secondary',
};

export const daysGridStyles: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
};

export const dayCellBaseStyles: SxProps<Theme> = {
    padding: 2,
    textAlign: 'center',
    cursor: 'pointer',
    borderBottom: '1px solid',
    borderRight: '1px solid',
    borderColor: 'divider',
};

export const emptyPaddingCellStyles: SxProps<Theme> = {
    padding: 2,
};
