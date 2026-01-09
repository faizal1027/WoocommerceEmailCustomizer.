import React from 'react';
import { Box, Typography, TextField, Stack, Divider, Tooltip, IconButton, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateOrderSubtotalEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CommonStylingControls from '../../../../utils/CommonStylingControls';

const OrderSubtotalWidgetEditor = () => {
    const dispatch = useDispatch();
    const { orderSubtotalEditorOptions } = useSelector((state: RootState) => state.workspace);
    const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
        (state: RootState) => state.workspace
    );

    const handleChange = (field: keyof typeof orderSubtotalEditorOptions) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        dispatch(updateOrderSubtotalEditorOptions({ [field]: e.target.value }));
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
                        <Typography variant="h6">Order Subtotal</Typography>
                        <Typography variant="body2" color="textSecondary">Customize subtotal display.</Typography>
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
                        value={orderSubtotalEditorOptions.label}
                        onChange={handleChange('label')}
                        size="small"
                        fullWidth
                        placeholder="Order Totals"
                    />
                </Box>

                <Box>
                    {renderLabel("Value (Placeholder)")}
                    <TextField
                        value={orderSubtotalEditorOptions.value}
                        onChange={handleChange('value')}
                        size="small"
                        fullWidth
                        placeholder="{{order_totals_table}}"
                        helperText="Use {{order_totals_table}} for dynamic data"
                    />
                </Box>

                <Divider />
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Translations</Typography>

                <Stack spacing={2}>
                    <Box>
                        {renderLabel("Subtotal Label")}
                        <TextField
                            value={orderSubtotalEditorOptions.subtotalLabel || 'Subtotal'}
                            onChange={handleChange('subtotalLabel' as any)}
                            size="small"
                            fullWidth
                        />
                    </Box>
                    <Box>
                        {renderLabel("Discount Label")}
                        <TextField
                            value={orderSubtotalEditorOptions.discountLabel || 'Discount'}
                            onChange={handleChange('discountLabel' as any)}
                            size="small"
                            fullWidth
                        />
                    </Box>
                    <Box>
                        {renderLabel("Shipping Label")}
                        <TextField
                            value={orderSubtotalEditorOptions.shippingLabel || 'Shipping'}
                            onChange={handleChange('shippingLabel' as any)}
                            size="small"
                            fullWidth
                        />
                    </Box>
                    <Box>
                        {renderLabel("Refunded Fully Label")}
                        <TextField
                            value={orderSubtotalEditorOptions.refundedFullyLabel || 'Order fully refunded'}
                            onChange={handleChange('refundedFullyLabel' as any)}
                            size="small"
                            fullWidth
                        />
                    </Box>
                    <Box>
                        {renderLabel("Refunded Partial Label")}
                        <TextField
                            value={orderSubtotalEditorOptions.refundedPartialLabel || 'Refund'}
                            onChange={handleChange('refundedPartialLabel' as any)}
                            size="small"
                            fullWidth
                        />
                    </Box>
                </Stack>
                <Divider />

                <CommonStylingControls
                    options={orderSubtotalEditorOptions}
                    onUpdate={(updatedOptions) => dispatch(updateOrderSubtotalEditorOptions(updatedOptions))}
                    showLabelAlign={true}
                    showValueAlign={true}
                    showTextAlign={false}
                />

                <Box>
                    {renderLabel("Spacing (px)")}
                    <TextField
                        type="number"
                        value={orderSubtotalEditorOptions.spacing || 0}
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

export default OrderSubtotalWidgetEditor;
