import React from 'react';
import { Box, Typography, TextField, Stack, Divider, Tooltip, IconButton, MenuItem, ToggleButton } from '@mui/material';
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

                {/* Section: Column Ratio */}
                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>Column ratio</Typography>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Last column width (%)</Typography>
                        <TextField
                            type="number"
                            value={orderTotalEditorOptions?.lastColumnWidth || 30}
                            onChange={handleChange('lastColumnWidth' as any)}
                            size="small"
                            sx={{ width: '80px' }}
                            InputProps={{ inputProps: { min: 10, max: 90 }, style: { fontSize: '12px' } }}
                        />
                    </Box>
                </Box>

                <Divider />

                <CommonStylingControls
                    options={orderTotalEditorOptions}
                    onUpdate={(updatedOptions) => dispatch(updateOrderTotalEditorOptions(updatedOptions))}
                    showLabelAlign={true}
                    showValueAlign={true}
                    showTextAlign={false}
                    showFontWeight={true}
                    showLineHeight={true}
                />

                <Divider />

                {/* Section: Border */}
                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>Border</Typography>
                    <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} alignItems="end">
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>Border width</Typography>
                            <TextField
                                type="number"
                                value={orderTotalEditorOptions?.borderWidth || 0}
                                onChange={handleChange('borderWidth' as any)}
                                size="small"
                                fullWidth
                                InputProps={{ style: { fontSize: '12px', height: '40px' } }}
                            />
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                                Border color
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1} height="40px">
                                <input
                                    type="color"
                                    value={orderTotalEditorOptions?.borderColor === 'transparent' ? '#eeeeee' : (orderTotalEditorOptions?.borderColor || '#eeeeee')}
                                    onChange={(e) => dispatch(updateOrderTotalEditorOptions({ borderColor: e.target.value }))}
                                    style={{
                                        width: '40px',
                                        height: '100%',
                                        border: '1px solid #c4c4c4',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        padding: '0 2px',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <ToggleButton
                                    value="transparent"
                                    selected={orderTotalEditorOptions?.borderColor === 'transparent'}
                                    onChange={() => {
                                        const newColor = orderTotalEditorOptions?.borderColor === 'transparent' ? '#eeeeee' : 'transparent';
                                        dispatch(updateOrderTotalEditorOptions({ borderColor: newColor }));
                                    }}
                                    size="small"
                                    sx={{ height: '100%', flexGrow: 1, minWidth: '45px', border: '1px solid #c4c4c4' }}
                                >
                                    <Typography variant="caption" sx={{ fontSize: '10px', fontWeight: 'bold' }}>NONE</Typography>
                                </ToggleButton>
                            </Box>
                        </Box>
                    </Box>
                </Box>

            </Stack>
        </Box>
    );
};

export default OrderTotalWidgetEditor;
