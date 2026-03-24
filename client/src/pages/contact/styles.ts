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

export const subtitleExtraStyles: SystemStyleObject = {
    marginBottom: 3,
};

export const formCardStyles: SystemStyleObject = {
    padding: 4,
};

export const infoCardStyles: SystemStyleObject = {
    padding: 4,
    height: '100%',
    backgroundColor: 'primary.main',
    color: 'white',
};

export const infoDescriptionStyles: SystemStyleObject = {
    opacity: 0.9,
    marginBottom: 4,
};

export const infoItemStyles: SystemStyleObject = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 2,
    marginBottom: 3,
};

export const infoIconStyles: SystemStyleObject = {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 1,
    borderRadius: 2,
};

export const infoItemSubtitleStyles: SystemStyleObject = {
    opacity: 0.8,
};

export const infoItemBodyStyles: SystemStyleObject = {
    opacity: 0.8,
};

export const submitButtonStyles: SystemStyleObject = {
    py: 1.5,
    fontSize: '1rem',
    fontWeight: 600,
};

export const mapContainerStyles: SystemStyleObject = {
    height: 300,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
};

export const socialLinksStyles: SystemStyleObject = {
    display: 'flex',
    gap: 1,
    marginTop: 3,
};

export const socialButtonStyles: SystemStyleObject = {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: 'white',
    '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
};
