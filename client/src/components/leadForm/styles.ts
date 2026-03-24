import { SystemStyleObject } from '@mui/system';

export const paperStyles: SystemStyleObject = {
    padding: 3,
    borderRadius: 3,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    border: '1px solid',
    borderColor: 'divider',
};

export const priceHeaderStyles: SystemStyleObject = {
    marginBottom: 3,
    paddingBottom: 3,
    borderBottom: '1px solid',
    borderColor: 'divider',
};

export const priceBoxStyles: SystemStyleObject = {
    display: 'flex',
    alignItems: 'baseline',
    gap: 1,
};

export const priceDescriptionStyles: SystemStyleObject = {
    marginBottom: 3,
};

export const formContainerStyles: SystemStyleObject = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
};

export const submitButtonStyles: SystemStyleObject = {
    marginTop: 1,
    borderRadius: 2,
    py: 1.5,
    fontWeight: 600,
};
