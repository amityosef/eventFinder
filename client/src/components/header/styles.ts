import { SystemStyleObject } from '@mui/system';

export const appBarStyles: SystemStyleObject = {
  backgroundColor: 'background.paper',
  color: 'text.primary',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
};

export const toolbarStyles: SystemStyleObject = {
  justifyContent: 'space-between',
  py: 1,
};

export const logoStyles: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  color: 'primary.main',
};

export const logoIconStyles: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: 2,
  backgroundColor: 'primary.main',
  color: 'white',
};

export const logoTextStyles: SystemStyleObject = {
  fontWeight: 700,
  fontSize: '1.5rem',
  color: 'text.primary',
  display: { xs: 'none', sm: 'block' },
};

export const navLinksStyles: SystemStyleObject = {
  display: 'flex',
  gap: 1,
  mr: 'auto',
  ml: 4,
};

export const navLinkStyles: SystemStyleObject = {
  color: 'text.secondary',
  fontWeight: 500,
  px: 2,
  '&:hover': {
    color: 'primary.main',
    backgroundColor: 'transparent',
  },
};

export const authSectionStyles: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

export const iconButtonStyles: SystemStyleObject = {
  color: 'text.secondary',
  '&:hover': {
    color: 'primary.main',
    backgroundColor: 'action.hover',
  },
};

export const loginButtonStyles: SystemStyleObject = {
  color: 'text.secondary',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: 'transparent',
    color: 'primary.main',
  },
};

export const registerButtonStyles: SystemStyleObject = {
  borderRadius: 2,
  px: 3,
  fontWeight: 600,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
  },
};

export const avatarButtonStyles: SystemStyleObject = {
  padding: 0.5,
};

export const avatarStyles: SystemStyleObject = {
  width: 36,
  height: 36,
  backgroundColor: 'primary.main',
  fontSize: '1rem',
};

export const menuStyles: SystemStyleObject = {
  '& .MuiPaper-root': {
    minWidth: 180,
    borderRadius: 2,
    marginTop: 1,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
};

export const menuButtonStyles: SystemStyleObject = {
  mr: -1,
};

export const drawerStyles: SystemStyleObject = {
  width: 280,
  paddingTop: 2,
};
