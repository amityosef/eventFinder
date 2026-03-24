import { SystemStyleObject } from '@mui/system';

export const containerStyles: SystemStyleObject = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    textAlign: 'center',
    padding: 4,
};

export const iconStyles: SystemStyleObject = {
    fontSize: 64,
    color: 'error.main',
    marginBottom: 2,
};

export const titleStyles: SystemStyleObject = {
    fontWeight: 600,
    marginBottom: 1,
};

export const descriptionStyles: SystemStyleObject = {
    color: 'text.secondary',
    marginBottom: 3,
};

export const detailsDescriptionStyles: SystemStyleObject = {
    marginBottom: 4,
};

export const buttonStyles: SystemStyleObject = {
    px: 4,
};

export const detailsContainerStyles: SystemStyleObject = {
    width: '100%',
    maxWidth: 600,
    marginTop: 4,
};

export const accordionSummaryStyles: SystemStyleObject = {
    backgroundColor: 'action.hover',
    borderRadius: 1,
    '&:hover': {
        backgroundColor: 'action.selected',
    },
};

export const accordionTitleContainerStyles: SystemStyleObject = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    marginBottom: 1,
};

export const errorDetailsStyles: SystemStyleObject = {
    backgroundColor: '#f5f5f5',
    padding: 2,
    borderRadius: 1,
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    overflow: 'auto',
    maxHeight: 300,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
};

export const buttonsContainerStyles: SystemStyleObject = {
    display: 'flex',
    gap: 2,
};

export const copyButtonStyles: SystemStyleObject = {
    borderRadius: 2,
};
