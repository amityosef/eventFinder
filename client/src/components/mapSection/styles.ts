import { SystemStyleObject } from '@mui/system';

export const containerStyles: SystemStyleObject = {
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 2,
    overflow: 'hidden',
};

export const iframeStyles: SystemStyleObject = {
    width: '100%',
    height: 300,
    border: 'none',
};

export const footerStyles: SystemStyleObject = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 2,
    backgroundColor: '#f8fafc',
};

export const addressContainerStyles: SystemStyleObject = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
};

export const linkStyles: SystemStyleObject = {
    color: 'primary.main',
    fontWeight: 600,
    fontSize: '0.875rem',
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',
    },
};
