import { SystemStyleObject } from '@mui/system';

export const containerStyles: SystemStyleObject = {
  py: 4,
  minHeight: 'calc(100vh - 160px)',
  backgroundColor: '#f8fafc',
};

export const headerStyles: SystemStyleObject = {
  marginBottom: 4,
};

export const userInfoStyles: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
};

export const avatarStyles: SystemStyleObject = {
  width: 64,
  height: 64,
  backgroundColor: 'primary.main',
  fontSize: '1.5rem',
};

export const statCardStyles: SystemStyleObject = {
  padding: 3,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
};

export const statIconStyles: SystemStyleObject = {
  width: 48,
  height: 48,
  borderRadius: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 1,
};

export const tabsContainerStyles: SystemStyleObject = {
  borderRadius: 2,
  padding: 3,
};

export const tabsStyles: SystemStyleObject = {
  borderBottom: '1px solid',
  borderColor: 'divider',
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 500,
    minHeight: 48,
  },
};
