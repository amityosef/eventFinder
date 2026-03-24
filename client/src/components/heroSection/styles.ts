import { SystemStyleObject } from '@mui/system';

export const heroContainerStyles: SystemStyleObject = {
    position: 'relative',
    minHeight: { xs: 400, md: 500 },
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("/hero-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.3,
    },
};

export const decorativeElement1Styles: SystemStyleObject = {
    position: 'absolute',
    top: '10%',
    right: '10%',
    width: 300,
    height: 300,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
    filter: 'blur(40px)',
};

export const decorativeElement2Styles: SystemStyleObject = {
    position: 'absolute',
    bottom: '20%',
    left: '5%',
    width: 200,
    height: 200,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
    filter: 'blur(30px)',
};

export const contentContainerStyles: SystemStyleObject = {
    position: 'relative',
    zIndex: 1,
};

export const contentBoxStyles: SystemStyleObject = {
    maxWidth: 700,
};

export const titleStyles: SystemStyleObject = {
    fontSize: { xs: '2.5rem', md: '3.5rem' },
    fontWeight: 800,
    color: 'white',
    marginBottom: 2,
    lineHeight: 1.2,
};

export const subtitleStyles: SystemStyleObject = {
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
    fontWeight: 400,
    lineHeight: 1.6,
};
