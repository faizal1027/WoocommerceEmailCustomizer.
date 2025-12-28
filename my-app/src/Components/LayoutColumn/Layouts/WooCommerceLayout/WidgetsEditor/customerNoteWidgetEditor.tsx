import React from 'react';
import { Box, Typography, TextField, Stack, Divider, Tooltip, IconButton, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateCustomerNoteEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CommonStylingControls from '../../../../utils/CommonStylingControls';

const CustomerNoteWidgetEditor = () => {
    const dispatch = useDispatch();
    const { customerNoteEditorOptions } = useSelector((state: RootState) => state.workspace);
    const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
        (state: RootState) => state.workspace
    );

    const handleChange = (field: keyof typeof customerNoteEditorOptions) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        dispatch(updateCustomerNoteEditorOptions({ [field]: e.target.value }));
    };

    const handleCloseEditor = () => {
        dispatch(closeEditor());
    };

    const handleDeleteContent = () => {
        if (selectedBlockForEditor && selectedColumnIndex !== null && selectedWidgetIndex !== null) {
            dispatch(
                deleteColumnContent({
                    blockId: selectedBlockForEditor,
                    columnIndex: selectedColumnIndex,
                    widgetIndex: selectedWidgetIndex,
                })
            );
        }
    };

    const renderLabel = (text: string) => (
        <Typography variant="caption" sx={{ marginBottom: 1, display: 'block', fontWeight: 500, color: 'text.secondary' }}>
            {text}
        </Typography>
    );

    return (
        <Box sx={{ padding: 2 }}>
            <Stack spacing={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h6">Customer Note</Typography>
                        <Typography variant="body2" color="textSecondary">Customize customer note display.</Typography>
                    </Box>
                    <Box display="flex" gap={1}>
                        <Tooltip title="Close" placement="bottom">
                            <IconButton onClick={handleCloseEditor} size="small" sx={{ bgcolor: '#eee' }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" placement="bottom">
                            <IconButton onClick={handleDeleteContent} size="small" sx={{ bgcolor: '#eee' }}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                <Divider />

                <Box>
                    {renderLabel("Label")}
                    <TextField
                        value={customerNoteEditorOptions.label}
                        onChange={handleChange('label')}
                        size="small"
                        fullWidth
                        placeholder="Customer Note"
                    />
                </Box>

                <Box>
                    {renderLabel("Value (Placeholder)")}
                    <TextField
                        value={customerNoteEditorOptions.value}
                        onChange={handleChange('value')}
                        size="small"
                        fullWidth
                        placeholder="{{customer_note}}"
                        helperText="Use {{customer_note}} for dynamic data"
                    />
                </Box>

                <CommonStylingControls
                    options={customerNoteEditorOptions}
                    onUpdate={(updatedOptions) => dispatch(updateCustomerNoteEditorOptions(updatedOptions))}
                />

                <Box>
                    {renderLabel("Spacing (px)")}
                    <TextField
                        type="number"
                        value={customerNoteEditorOptions.spacing || 0}
                        onChange={handleChange('spacing' as any)}
                        size="small"
                        fullWidth
                        InputProps={{ inputProps: { min: 0 } }}
                    />
                </Box>
            </Stack>
        </Box>
    );
};

export default CustomerNoteWidgetEditor;
