import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { format } from 'date-fns';
import { AvailabilityStatus } from '@/types';

interface AvailabilityDialogTexts {
    editAvailability: string;
    status: string;
    available: string;
    booked: string;
    onHold: string;
    notes: string;
    cancel: string;
    save: string;
}

interface AvailabilityDialogProps {
    open: boolean;
    selectedDate: Date | null;
    status: AvailabilityStatus;
    notes: string;
    isSaving: boolean;
    onStatusChange: (status: AvailabilityStatus) => void;
    onNotesChange: (notes: string) => void;
    onClose: () => void;
    onSave: () => void;
    texts: AvailabilityDialogTexts;
}

export const AvailabilityDialog = ({
    open,
    selectedDate,
    status,
    notes,
    isSaving,
    onStatusChange,
    onNotesChange,
    onClose,
    onSave,
    texts,
}: AvailabilityDialogProps) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                {texts.editAvailability}
                {' - '}
                {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}
            </DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ marginTop: 2, marginBottom: 2 }}>
                    <InputLabel>{texts.status}</InputLabel>
                    <Select
                        value={status}
                        label={texts.status}
                        onChange={(event) => onStatusChange(event.target.value as AvailabilityStatus)}
                    >
                        <MenuItem value="available">{texts.available}</MenuItem>
                        <MenuItem value="booked">{texts.booked}</MenuItem>
                        <MenuItem value="hold">{texts.onHold}</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    label={texts.notes}
                    multiline
                    rows={3}
                    value={notes}
                    onChange={(event) => onNotesChange(event.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{texts.cancel}</Button>
                <Button variant="contained" onClick={onSave} disabled={isSaving}>
                    {texts.save}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
