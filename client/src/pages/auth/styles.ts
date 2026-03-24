import { SystemStyleObject } from '@mui/system';

export const containerStyles: SystemStyleObject = {
  minHeight: 'calc(100vh - 160px)',
  display: 'flex',
  alignItems: 'center',
  py: 4,
  backgroundColor: '#f8fafc',
};

export const paperStyles: SystemStyleObject = {
  padding: 4,
  borderRadius: 3,
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
};

export const logoStyles: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 1.5,
  marginBottom: 4,
};

export const logoIconStyles: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: 2,
  backgroundColor: 'primary.main',
  color: 'white',
};

export const googleLoginContainerStyles: SystemStyleObject = {
  display: 'flex',
  justifyContent: 'center',
};

export const submitButtonStyles: SystemStyleObject = {
  py: 1.5,
  borderRadius: 2,
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
  },
};

