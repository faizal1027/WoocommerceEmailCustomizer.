import React from 'react';
import { Box, Typography, TextField, Stack, Divider, Tooltip, IconButton, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateShippingMethodEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CommonStylingControls from '../../../../utils/CommonStylingControls';

const ShippingMethodWidgetEditor = () => {
    const dispatch = useDispatch();
    const { shippingMethodEditorOptions } = useSelector((state: RootState) => state.workspace);
    const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
        (state: RootState) => state.workspace
    );

    const handleChange = (field: keyof typeof shippingMethodEditorOptions) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        dispatch(updateShippingMethodEditorOptions({ [field]: e.target.value }));
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
                        <Typography variant="h6">Shipping Method</Typography>
                        <Typography variant="body2" color="textSecondary">Customize shipping method display.</Typography>
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
                        value={shippingMethodEditorOptions.label}
                        onChange={handleChange('label')}
                        size="small"
                        fullWidth
                        placeholder="Shipping Method"
                    />
                </Box>

                <Box>
                    {renderLabel("Value (Placeholder)")}
                    <TextField
                        value={shippingMethodEditorOptions.value}
                        onChange={handleChange('value')}
                        size="small"
                        fullWidth
                        placeholder="{{shipping_method}}"
                        helperText="Use {{shipping_method}} for dynamic data"
                    />
                </Box>

                <CommonStylingControls
                    options={shippingMethodEditorOptions}
                    onUpdate={(updatedOptions) => dispatch(updateShippingMethodEditorOptions(updatedOptions))}
                />

                <Box>
                    {renderLabel("Spacing (px)")}
                    <TextField
                        type="number"
                        value={shippingMethodEditorOptions.spacing || 0}
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

export default ShippingMethodWidgetEditor;
