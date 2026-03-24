import { SystemStyleObject } from '@mui/system';

export const searchSectionStyles: SystemStyleObject = {
  position: 'relative',
  marginTop: -8,
  zIndex: 10,
  marginBottom: 8,
};

export const searchWrapperStyles: SystemStyleObject = {
  backgroundColor: 'background.paper',
  borderRadius: 4,
  padding: 4,
  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
};

export const featuredSectionStyles: SystemStyleObject = {
  py: 8,
};

export const sectionHeaderStyles: SystemStyleObject = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 4,
};

export const viewAllButtonStyles: SystemStyleObject = {
  borderRadius: 2,
};

export const ctaSectionStyles: SystemStyleObject = {
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: 'white',
  py: 10,
  marginTop: 8,
};

export const ctaButtonsStyles: SystemStyleObject = {
  display: 'flex',
  justifyContent: 'center',
  gap: 2,
  flexWrap: 'wrap',
};

export const ctaOutlineButtonStyles: SystemStyleObject = {
  borderColor: 'white',
  color: 'white',
  '&:hover': {
    borderColor: 'white',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
};
