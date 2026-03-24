import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { Venue } from '@/types';
import { toolbarStyles, venueSelectStyles } from './availabilityTab.styles';

interface AvailabilityToolbarTexts {
    title: string;
    venueLabel: string;
}

interface AvailabilityToolbarProps {
    venues: Venue[];
    selectedVenue: string;
    onVenueChange: (value: string) => void;
    texts: AvailabilityToolbarTexts;
}

export const AvailabilityToolbar = ({
    venues,
    selectedVenue,
    onVenueChange,
    texts,
}: AvailabilityToolbarProps) => {
    return (
        <Box sx={toolbarStyles}>
            <Typography variant="h6" fontWeight={600}>
                {texts.title}
            </Typography>
            <FormControl size="small" sx={venueSelectStyles}>
                <InputLabel>{texts.venueLabel}</InputLabel>
                <Select
                    value={selectedVenue}
                    label={texts.venueLabel}
                    onChange={(event) => onVenueChange(event.target.value)}
                >
                    {venues.map((venue) => (
                        <MenuItem key={venue._id} value={venue._id}>
                            {venue.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};
