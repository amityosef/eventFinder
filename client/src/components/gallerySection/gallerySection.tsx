import { useState } from 'react';
import { Box, IconButton, Dialog, useMediaQuery, useTheme } from '@mui/material';
import { ChevronLeft, ChevronRight, Close, ZoomIn } from '@mui/icons-material';
import { GalleryImage } from '@/types';
import {
    galleryGridStyles,
    emptyGalleryStyles,
    emptyIconStyles,
    mainImageContainerStyles,
    mainImageStyles,
    zoomOverlayStyles,
    zoomIconStyles,
    additionalImageContainerStyles,
    additionalImageStyles,
    remainingCountStyles,
    lightboxPaperStyles,
    lightboxContainerStyles,
    closeButtonStyles,
    prevButtonStyles,
    nextButtonStyles,
    lightboxImageStyles,
    counterStyles,
} from './styles';
import { consts } from './consts';

interface GallerySectionProps {
    images: (GalleryImage | string)[];
    venueName: string;
}

const getImageUrl = (image: GalleryImage | string, size: 'original' | 'medium' | 'thumbnail' = 'medium'): string => {
    if (typeof image === 'string') return image;
    return image[size] || image.original || '';
};

export const GallerySection = ({ images, venueName }: GallerySectionProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const displayImages = images.slice(0, consts.MAX_DISPLAY_IMAGES);
    const remainingCount = images.length - consts.MAX_DISPLAY_IMAGES;

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'Escape') setLightboxOpen(false);
    };

    if (images.length === 0) {
        return (
            <Box sx={emptyGalleryStyles}>
                <ZoomIn sx={emptyIconStyles} />
            </Box>
        );
    }

    return (
        <>
            <Box
                sx={{
                    ...galleryGridStyles,
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
                    gridTemplateRows: isMobile ? '250px' : 'repeat(2, 200px)',
                }}
                onClick={() => setLightboxOpen(true)}
            >
                <Box
                    sx={{
                        ...mainImageContainerStyles,
                        gridColumn: isMobile ? '1' : '1 / 3',
                        gridRow: isMobile ? '1' : '1 / 3',
                    }}
                >
                    <Box component="img" src={getImageUrl(displayImages[0], 'medium')} alt={venueName} sx={mainImageStyles} />
                    <Box className="zoom-overlay" sx={zoomOverlayStyles}>
                        <ZoomIn sx={zoomIconStyles} />
                    </Box>
                </Box>

                {!isMobile &&
                    displayImages.slice(1).map((image, index) => (
                        <Box key={index} sx={additionalImageContainerStyles}>
                            <Box
                                component="img"
                                src={getImageUrl(image, 'medium')}
                                alt={`${venueName} ${index + 2}`}
                                sx={additionalImageStyles}
                            />
                            {index === 3 && remainingCount > 0 && (
                                <Box sx={remainingCountStyles}>+{remainingCount}</Box>
                            )}
                        </Box>
                    ))}
            </Box>

            <Dialog
                open={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                maxWidth={false}
                fullScreen
                PaperProps={{ sx: lightboxPaperStyles }}
                onKeyDown={handleKeyDown}
            >
                <Box sx={lightboxContainerStyles}>
                    <IconButton onClick={() => setLightboxOpen(false)} sx={closeButtonStyles}>
                        <Close />
                    </IconButton>

                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePrev();
                        }}
                        sx={prevButtonStyles}
                    >
                        <ChevronLeft />
                    </IconButton>

                    <Box
                        component="img"
                        src={getImageUrl(images[currentIndex], 'original')}
                        alt={`${venueName} ${currentIndex + 1}`}
                        sx={lightboxImageStyles}
                    />

                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                        }}
                        sx={nextButtonStyles}
                    >
                        <ChevronRight />
                    </IconButton>

                    <Box sx={counterStyles}>
                        {currentIndex + 1} / {images.length}
                    </Box>
                </Box>
            </Dialog>
        </>
    );
};
