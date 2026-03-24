import { Box, Typography } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { containerStyles, iframeStyles, footerStyles, addressContainerStyles, linkStyles } from './styles';
import { consts } from './consts';
import { strings } from './strings';

interface MapSectionProps {
    address: string;
    coordinates?: {
        lat?: number;
        lng?: number;
        type?: string;
        coordinates?: [number, number];
    };
}

export const MapSection = ({ address, coordinates }: MapSectionProps) => {
    const lat = coordinates?.lat ?? coordinates?.coordinates?.[1];
    const lng = coordinates?.lng ?? coordinates?.coordinates?.[0];
    const hasCoordinates = lat !== undefined && lng !== undefined;

    const mapUrl = hasCoordinates
        ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - consts.MAP_ZOOM_OFFSET},${lat - consts.MAP_ZOOM_OFFSET},${lng + consts.MAP_ZOOM_OFFSET},${lat + consts.MAP_ZOOM_OFFSET}&layer=mapnik&marker=${lat},${lng}`
        : `https://www.openstreetmap.org/export/embed.html?bbox=${consts.DEFAULT_BBOX.lng1},${consts.DEFAULT_BBOX.lat1},${consts.DEFAULT_BBOX.lng2},${consts.DEFAULT_BBOX.lat2}&layer=mapnik`;

    const directionsUrl = hasCoordinates
        ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
        : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

    return (
        <Box sx={containerStyles}>
            <Box component="iframe" src={mapUrl} sx={iframeStyles} title="Map" loading="lazy" />
            <Box sx={footerStyles}>
                <Box sx={addressContainerStyles}>
                    <LocationOn color="primary" />
                    <Typography variant="body2">{address}</Typography>
                </Box>
                <Box component="a" href={directionsUrl} target="_blank" rel="noopener noreferrer" sx={linkStyles}>
                    {strings.getDirections}
                </Box>
            </Box>
        </Box>
    );
};
