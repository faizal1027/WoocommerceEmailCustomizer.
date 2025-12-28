import React from 'react';
import { Box, Typography, TextField, Button, Tooltip, IconButton, Stack, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateTaxBillingEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CommonStylingControls from '../../../../utils/CommonStylingControls';

const TaxBillingWidgetEditor = () => {
  const dispatch = useDispatch();
  const { taxBillingEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const handleChange = (field: keyof typeof taxBillingEditorOptions) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(updateTaxBillingEditorOptions({ [field]: e.target.value }));
  };

  const renderLabel = (text: string) => (
    <Typography variant="caption" sx={{ marginBottom: 1, display: 'block', fontWeight: 500, color: 'text.secondary' }}>
      {text}
    </Typography>
  );

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
              Tax & Billing
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Manage tax and billing information.
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

        {/* Section: Order Information */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Order Information
          </Typography>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <Box>
              {renderLabel("Order Number")}
              <TextField
                value={taxBillingEditorOptions.orderNumber || ''}
                onChange={handleChange('orderNumber')}
                size="small"
                placeholder="12345"
                fullWidth
              />
            </Box>
            <Box>
              {renderLabel("Order Date")}
              <TextField
                value={taxBillingEditorOptions.orderDate || ''}
                onChange={handleChange('orderDate')}
                size="small"
                placeholder="2024-01-15"
                fullWidth
              />
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Section: Order Totals */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Order Totals
          </Typography>
          <Stack spacing={2}>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                {renderLabel("Subtotal")}
                <TextField
                  value={taxBillingEditorOptions.orderSubtotal || ''}
                  onChange={handleChange('orderSubtotal')}
                  size="small"
                  placeholder="$100.00"
                  fullWidth
                />
              </Box>
              <Box>
                {renderLabel("Shipping")}
                <TextField
                  value={taxBillingEditorOptions.orderShipping || ''}
                  onChange={handleChange('orderShipping')}
                  size="small"
                  placeholder="$10.00"
                  fullWidth
                />
              </Box>
            </Box>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                {renderLabel("Discount")}
                <TextField
                  value={taxBillingEditorOptions.orderDiscount || ''}
                  onChange={handleChange('orderDiscount')}
                  size="small"
                  placeholder="$0.00"
                  fullWidth
                />
              </Box>
              <Box>
                {renderLabel("Tax Rate")}
                <TextField
                  value={taxBillingEditorOptions.taxRate || ''}
                  onChange={handleChange('taxRate')}
                  size="small"
                  placeholder="8%"
                  fullWidth
                />
              </Box>
            </Box>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                {renderLabel("Tax Amount")}
                <TextField
                  value={taxBillingEditorOptions.orderTax || ''}
                  onChange={handleChange('orderTax')}
                  size="small"
                  placeholder="$8.00"
                  fullWidth
                />
              </Box>
              <Box>
                {renderLabel("Total")}
                <TextField
                  value={taxBillingEditorOptions.orderTotal || ''}
                  onChange={handleChange('orderTotal')}
                  size="small"
                  placeholder="$118.00"
                  fullWidth
                />
              </Box>
            </Box>
          </Stack>
        </Box>

        <Divider />

        {/* Section: Billing Address */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Billing Address
          </Typography>
          <Stack spacing={2}>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                {renderLabel("First Name")}
                <TextField
                  value={taxBillingEditorOptions.billingFirstName || ''}
                  onChange={handleChange('billingFirstName')}
                  size="small"
                  placeholder="John"
                  fullWidth
                />
              </Box>
              <Box>
                {renderLabel("Last Name")}
                <TextField
                  value={taxBillingEditorOptions.billingLastName || ''}
                  onChange={handleChange('billingLastName')}
                  size="small"
                  placeholder="Doe"
                  fullWidth
                />
              </Box>
            </Box>
            <Box>
              {renderLabel("Address")}
              <TextField
                value={taxBillingEditorOptions.billingAddress1 || ''}
                onChange={handleChange('billingAddress1')}
                size="small"
                placeholder="123 Main St"
                fullWidth
              />
            </Box>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                {renderLabel("City")}
                <TextField
                  value={taxBillingEditorOptions.billingCity || ''}
                  onChange={handleChange('billingCity')}
                  size="small"
                  placeholder="New York"
                  fullWidth
                />
              </Box>
              <Box>
                {renderLabel("State")}
                <TextField
                  value={taxBillingEditorOptions.billingState || ''}
                  onChange={handleChange('billingState')}
                  size="small"
                  placeholder="NY"
                  fullWidth
                />
              </Box>
            </Box>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                {renderLabel("Postcode")}
                <TextField
                  value={taxBillingEditorOptions.billingPostcode || ''}
                  onChange={handleChange('billingPostcode')}
                  size="small"
                  placeholder="10001"
                  fullWidth
                />
              </Box>
              <Box>
                {renderLabel("Country")}
                <TextField
                  value={taxBillingEditorOptions.billingCountry || ''}
                  onChange={handleChange('billingCountry')}
                  size="small"
                  placeholder="USA"
                  fullWidth
                />
              </Box>
            </Box>
          </Stack>
        </Box>
        <Divider />
        <CommonStylingControls
          options={taxBillingEditorOptions}
          onUpdate={(updatedOptions) => dispatch(updateTaxBillingEditorOptions(updatedOptions))}
        />
      </Stack >
    </Box >
  );
};

export default TaxBillingWidgetEditor;