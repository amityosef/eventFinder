import { SystemStyleObject } from '@mui/system';

export const containerStyles: SystemStyleObject = {
    minHeight: '80vh',
    py: 6,
};

export const headerStyles: SystemStyleObject = {
    textAlign: 'center',
    marginBottom: 6,
};

export const titleStyles: SystemStyleObject = {
    fontWeight: 700,
    marginBottom: 2,
    color: 'text.primary',
};

export const subtitleStyles: SystemStyleObject = {
    color: 'text.secondary',
    maxWidth: 600,
    mx: 'auto',
};

export const sectionStyles: SystemStyleObject = {
    marginBottom: 6,
};

export const sectionTitleStyles: SystemStyleObject = {
    fontWeight: 600,
    marginBottom: 3,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
};

export const cardStyles: SystemStyleObject = {
    padding: 4,
    height: '100%',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
    },
};

export const iconWrapperStyles: SystemStyleObject = {
    width: 64,
    height: 64,
    borderRadius: 2,
    backgroundColor: 'primary.main',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
};

export const teamMemberCardStyles: SystemStyleObject = {
    textAlign: 'center',
    padding: 3,
};

export const avatarStyles: SystemStyleObject = {
    width: 120,
    height: 120,
    mx: 'auto',
    marginBottom: 2,
    backgroundColor: 'primary.light',
    fontSize: '2.5rem',
};

export const statCardStyles: SystemStyleObject = {
    textAlign: 'center',
    padding: 3,
    backgroundColor: 'primary.main',
    color: 'white',
    borderRadius: 3,
};

export const statNumberStyles: SystemStyleObject = {
    fontSize: '2.5rem',
    fontWeight: 700,
};

export const statLabelStyles: SystemStyleObject = {
    opacity: 0.9,
};
