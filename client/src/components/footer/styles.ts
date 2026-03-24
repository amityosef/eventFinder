import { SystemStyleObject } from '@mui/system';

export const footerStyles: SystemStyleObject = {
  backgroundColor: '#f8fafc',
  paddingTop: 6,
  paddingBottom: 4,
  marginTop: 'auto',
};

export const brandSectionStyles: SystemStyleObject = {
  marginBottom: 2,
};

export const logoStyles: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
};

export const logoIconStyles: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  borderRadius: 2,
  backgroundColor: 'primary.main',
  color: 'white',
};

export const socialLinksStyles: SystemStyleObject = {
  display: 'flex',
  gap: 1,
  marginTop: 2,
};

export const socialButtonStyles: SystemStyleObject = {
  backgroundColor: 'rgba(99, 102, 241, 0.1)',
  color: 'primary.main',
  '&:hover': {
    backgroundColor: 'primary.main',
    color: 'white',
  },
};

export const linkListStyles: SystemStyleObject = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
};

export const linkStyles: React.CSSProperties = {
  textDecoration: 'none',
  color: '#64748b',
  fontSize: '0.875rem',
  transition: 'color 0.2s',
};

export const contactListStyles: SystemStyleObject = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
};

export const contactItemStyles: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

export const contactIconStyles: SystemStyleObject = {
  color: 'primary.main',
};

export const copyrightStyles: SystemStyleObject = {
  display: 'flex',
  flexDirection: { xs: 'column', sm: 'row' },
  justifyContent: 'space-between',
  alignItems: { xs: 'center', sm: 'flex-start' },
  gap: 2,
};

export const legalLinksStyles: SystemStyleObject = {
  display: 'flex',
  gap: 3,
};

export const legalLinkStyles: React.CSSProperties = {
  textDecoration: 'none',
  color: '#64748b',
  fontSize: '0.875rem',
};
