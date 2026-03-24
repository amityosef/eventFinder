import { SystemStyleObject } from '@mui/system';

export const containerStyles: SystemStyleObject = {
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 2,
    overflow: 'hidden',
};

export const headerStyles: SystemStyleObject = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 2,
    backgroundColor: '#f8fafc',
};

export const weekDaysGridStyles: SystemStyleObject = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    borderBottom: '1px solid',
    borderColor: 'divider',
};

export const weekDayCellStyles: SystemStyleObject = {
    py: 1,
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '0.875rem',
    color: 'text.secondary',
};

export const calendarGridStyles: SystemStyleObject = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
};

export const dayCellStyles: SystemStyleObject = {
    py: 1.5,
    textAlign: 'center',
    position: 'relative',
};

export const todayIndicatorStyles: SystemStyleObject = {
    position: 'absolute',
    bottom: 4,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 4,
    height: 4,
    borderRadius: '50%',
    backgroundColor: 'primary.main',
};

export const legendStyles: SystemStyleObject = {
    display: 'flex',
    gap: 2,
    padding: 2,
    borderTop: '1px solid',
    borderColor: 'divider',
    backgroundColor: '#f8fafc',
};

export const availableChipStyles: SystemStyleObject = {
    backgroundColor: '#dcfce7',
    color: '#166534',
};

export const bookedChipStyles: SystemStyleObject = {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
};

export const holdChipStyles: SystemStyleObject = {
    backgroundColor: '#fef3c7',
    color: '#92400e',
};

export const skeletonStyles: SystemStyleObject = {
    borderRadius: 2,
};
