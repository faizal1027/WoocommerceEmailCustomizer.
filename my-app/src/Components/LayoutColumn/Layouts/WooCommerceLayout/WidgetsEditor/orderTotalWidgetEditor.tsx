import React from 'react';
import { Box, Typography, TextField, Stack, Divider, Tooltip, IconButton, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateOrderTotalEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CommonStylingControls from '../../../../utils/CommonStylingControls';

const OrderTotalWidgetEditor = () => {
    const dispatch = useDispatch();
    const { orderTotalEditorOptions } = useSelector((state: RootState) => state.workspace);
    const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
        (state: RootState) => state.workspace
    );

    const handleChange = (field: keyof typeof orderTotalEditorOptions) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        dispatch(updateOrderTotalEditorOptions({ [field]: e.target.value }));
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
                        <Typography variant="h6">Order Total</Typography>
                        <Typography variant="body2" color="textSecondary">Customize total display.</Typography>
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
                        value={orderTotalEditorOptions.label}
                        onChange={handleChange('label')}
                        size="small"
                        fullWidth
                        placeholder="Total"
                    />
                </Box>

                <Box>
                    {renderLabel("Value (Placeholder)")}
                    <TextField
                        value={orderTotalEditorOptions.value}
                        onChange={handleChange('value')}
                        size="small"
                        fullWidth
                        placeholder="{{order_total}}"
                        helperText="Use {{order_total}} for dynamic data"
                    />
                </Box>

                <CommonStylingControls
                    options={orderTotalEditorOptions}
                    onUpdate={(updatedOptions) => dispatch(updateOrderTotalEditorOptions(updatedOptions))}
                />

                <Box>
                    {renderLabel("Spacing (px)")}
                    <TextField
                        type="number"
                        value={orderTotalEditorOptions.spacing || 0}
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

export default OrderTotalWidgetEditor;
