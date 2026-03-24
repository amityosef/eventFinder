import { SystemStyleObject } from '@mui/system';

export const containerStyles: SystemStyleObject = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'background.default',
  zIndex: 9999,
};

export const contentStyles: SystemStyleObject = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
};

export const logoContainerStyles: SystemStyleObject = {
  marginBottom: 3,
};

export const logoStyles: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 80,
  height: 80,
  borderRadius: 3,
  backgroundColor: 'primary.main',
  color: 'white',
  animation: 'pulse 1.5s ease-in-out infinite',
  '@keyframes pulse': {
    '0%, 100%': {
      transform: 'scale(1)',
      opacity: 1,
    },
    '50%': {
      transform: 'scale(0.95)',
      opacity: 0.8,
    },
  },
};

export const spinnerStyles: SystemStyleObject = {
  color: 'primary.main',
};

export const loadingTextStyles: SystemStyleObject = {
  marginTop: 2,
};
