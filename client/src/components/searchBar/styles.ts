import { SystemStyleObject } from '@mui/system';

export const containerStyles: SystemStyleObject = {
  width: '100%',
  maxWidth: 800,
  mx: 'auto',
};

export const containerCompactStyles: SystemStyleObject = {
  width: '100%',
};

export const searchBarStyles: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  borderRadius: 3,
  padding: 1,
  paddingLeft: 2,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  border: '2px solid transparent',
  transition: 'all 0.3s ease',
  '&:focus-within': {
    border: '2px solid',
    borderColor: 'primary.main',
    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.2)',
  },
};

export const searchBarCompactStyles: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  borderRadius: 2,
  padding: 0.5,
  paddingLeft: 1.5,
  border: '1px solid',
  borderColor: 'divider',
  '&:focus-within': {
    borderColor: 'primary.main',
  },
};

export const inputWrapperStyles: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  flex: 1,
  gap: 1,
};

export const aiIconStyles: SystemStyleObject = {
  color: 'primary.main',
  fontSize: 24,
};

export const inputStyles: SystemStyleObject = {
  flex: 1,
  fontSize: '1rem',
  '& input': {
    py: 1,
  },
};

export const filterButtonStyles: SystemStyleObject = {
  color: 'text.secondary',
  mx: 1,
  '&:hover': {
    backgroundColor: 'action.hover',
  },
};

export const searchButtonStyles: SystemStyleObject = {
  borderRadius: 2,
  px: 3,
  py: 1.2,
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
  },
};

export const filtersPanelStyles: SystemStyleObject = {
  marginTop: 2,
  padding: 3,
  borderRadius: 2,
  backgroundColor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
};
