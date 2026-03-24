import { SystemStyleObject } from '@mui/system';

export const containerStyles: SystemStyleObject = {
  py: 4,
  minHeight: 'calc(100vh - 200px)',
};

export const searchHeaderStyles: SystemStyleObject = {
  marginBottom: 4,
};

export const resultsHeaderStyles: SystemStyleObject = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: 2,
  marginBottom: 4,
};

export const controlsStyles: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
};

export const paginationStyles: SystemStyleObject = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: 6,
};

export const drawerStyles: SystemStyleObject = {
  width: 320,
  padding: 2,
};

export const drawerHeaderStyles: SystemStyleObject = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 2,
};
