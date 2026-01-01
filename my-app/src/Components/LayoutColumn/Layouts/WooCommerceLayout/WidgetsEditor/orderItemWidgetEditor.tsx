import React from 'react';
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableRow, TableHead, Tooltip, IconButton, Stack, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { closeEditor, deleteColumnContent, OrderItem, updateOrderItemsEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import CommonStylingControls from '../../../../utils/CommonStylingControls';

const OrderItemsWidgetEditor = () => {
  const dispatch = useDispatch();
  const { orderItemsEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const handleChange = (field: keyof typeof orderItemsEditorOptions) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(updateOrderItemsEditorOptions({ [field]: e.target.value }));
  };

  const renderLabel = (text: string) => (
    <Typography variant="caption" sx={{ marginBottom: 1, display: 'block', fontWeight: 500, color: 'text.secondary' }}>
      {text}
    </Typography>
  );

  const handleItemChange = (index: number, field: keyof OrderItem, value: string) => {
    const newItems = [...orderItemsEditorOptions.items];
    newItems[index] = { ...newItems[index], [field]: field === 'quantity' ? parseInt(value) || 0 : value };
    dispatch(updateOrderItemsEditorOptions({ items: newItems }));
  };



  const removeItem = (index: number) => {
    const newItems = orderItemsEditorOptions.items.filter((_, i) => i !== index);
    dispatch(updateOrderItemsEditorOptions({ items: newItems }));
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

  return (
    <Box sx={{ padding: 2 }}>
      <Stack spacing={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">
              Order Items
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Manage order details and items.
            </Typography>
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

        {/* Section: Order Header */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Order Header
          </Typography>
          <Stack spacing={2}>
            <Box>
              {renderLabel("Order Number")}
              <TextField
                value={orderItemsEditorOptions.orderNumber}
                onChange={handleChange('orderNumber')}
                size="small"
                fullWidth
              />
            </Box>
            <Box>
              {renderLabel("Order Date")}
              <TextField
                value={orderItemsEditorOptions.orderDate}
                onChange={handleChange('orderDate')}
                size="small"
                fullWidth
              />
            </Box>
          </Stack>
        </Box>

        <Divider />



        {/* Section: Order Totals */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Totals & Payment
          </Typography>
          <Stack spacing={2}>
            <Box>
              {renderLabel("Subtotal")}
              <TextField
                value={orderItemsEditorOptions.subtotal}
                onChange={handleChange('subtotal')}
                size="small"
                fullWidth
              />
            </Box>
            <Box>
              {renderLabel("Discount")}
              <TextField
                value={orderItemsEditorOptions.discount}
                onChange={handleChange('discount')}
                size="small"
                fullWidth
              />
            </Box>
            <Box>
              {renderLabel("Payment Method")}
              <TextField
                value={orderItemsEditorOptions.paymentMethod}
                onChange={handleChange('paymentMethod')}
                size="small"
                fullWidth
              />
            </Box>
            <Box>
              {renderLabel("Total")}
              <TextField
                value={orderItemsEditorOptions.total}
                onChange={handleChange('total')}
                size="small"
                fullWidth
              />
            </Box>
          </Stack>
        </Box>
        <Divider />
        <CommonStylingControls
          options={orderItemsEditorOptions}
          onUpdate={(updatedOptions) => dispatch(updateOrderItemsEditorOptions(updatedOptions))}
        />
      </Stack>
    </Box>
  );
};

export default OrderItemsWidgetEditor;