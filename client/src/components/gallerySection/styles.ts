import { SystemStyleObject } from '@mui/system';

export const galleryGridStyles: SystemStyleObject = {
    display: 'grid',
    gap: 1,
    maxHeight: { xs: 250, md: 410 },
    overflow: 'hidden',
    cursor: 'pointer',
};

export const emptyGalleryStyles: SystemStyleObject = {
    height: { xs: 250, md: 400 },
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

export const emptyIconStyles: SystemStyleObject = {
    fontSize: 60,
    color: '#94a3b8',
};

export const mainImageContainerStyles: SystemStyleObject = {
    position: 'relative',
    '&:hover .zoom-overlay': {
        opacity: 1,
    },
};

export const mainImageStyles: SystemStyleObject = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
};

export const zoomOverlayStyles: SystemStyleObject = {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.2s',
};

export const zoomIconStyles: SystemStyleObject = {
    color: 'white',
    fontSize: 40,
};

export const additionalImageContainerStyles: SystemStyleObject = {
    position: 'relative',
    '&:hover': {
        '& img': { transform: 'scale(1.05)' },
    },
};

export const additionalImageStyles: SystemStyleObject = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s',
};

export const remainingCountStyles: SystemStyleObject = {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 600,
};

export const lightboxPaperStyles: SystemStyleObject = {
    backgroundColor: 'rgba(0,0,0,0.95)',
};

export const lightboxContainerStyles: SystemStyleObject = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
};

export const closeButtonStyles: SystemStyleObject = {
    position: 'absolute',
    top: 20,
    right: 20,
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.1)',
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
};

export const prevButtonStyles: SystemStyleObject = {
    position: 'absolute',
    left: 20,
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.1)',
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
};

export const nextButtonStyles: SystemStyleObject = {
    position: 'absolute',
    right: 20,
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.1)',
    '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
};

export const lightboxImageStyles: SystemStyleObject = {
    maxWidth: '90%',
    maxHeight: '90%',
    objectFit: 'contain',
};

export const counterStyles: SystemStyleObject = {
    position: 'absolute',
    bottom: 20,
    color: 'white',
    fontSize: '0.875rem',
};
