import React from 'react';
import { Box, Typography, TextField, Tooltip, IconButton, Stack, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { closeEditor, deleteColumnContent, updateShippingAddressEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import CommonStylingControls from '../../../../utils/CommonStylingControls';

const ShippingAddressWidgetEditor = () => {
  const dispatch = useDispatch();
  const { shippingAddressEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const handleChange = (field: keyof typeof shippingAddressEditorOptions) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(updateShippingAddressEditorOptions({ [field]: e.target.value }));
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
              Shipping Address
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Edit the shipping address fields.
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

        {/* Section: Contact Details */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Contact Details
          </Typography>
          <Stack spacing={2}>
            <Box>
              {renderLabel("Full Name")}
              <TextField
                value={shippingAddressEditorOptions.fullName}
                onChange={handleChange('fullName')}
                size="small"
                fullWidth
              />
            </Box>
            <Box>
              {renderLabel("Email")}
              <TextField
                value={shippingAddressEditorOptions.email}
                onChange={handleChange('email')}
                size="small"
                fullWidth
              />
            </Box>
            <Box>
              {renderLabel("Phone")}
              <TextField
                value={shippingAddressEditorOptions.phone}
                onChange={handleChange('phone')}
                size="small"
                fullWidth
              />
            </Box>
          </Stack>
        </Box>

        <Divider />

        {/* Section: Address Fields */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Address Fields
          </Typography>
          <Stack spacing={2}>
            <Box>
              {renderLabel("Address Line 1")}
              <TextField
                value={shippingAddressEditorOptions.addressLine1}
                onChange={handleChange('addressLine1')}
                size="small"
                fullWidth
              />
            </Box>
            <Box>
              {renderLabel("Address Line 2")}
              <TextField
                value={shippingAddressEditorOptions.addressLine2}
                onChange={handleChange('addressLine2')}
                size="small"
                fullWidth
              />
            </Box>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                {renderLabel("City")}
                <TextField
                  value={shippingAddressEditorOptions.city}
                  onChange={handleChange('city')}
                  size="small"
                  fullWidth
                />
              </Box>
              <Box>
                {renderLabel("State")}
                <TextField
                  value={shippingAddressEditorOptions.state}
                  onChange={handleChange('state')}
                  size="small"
                  fullWidth
                />
              </Box>
            </Box>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                {renderLabel("Postal Code")}
                <TextField
                  value={shippingAddressEditorOptions.postalCode}
                  onChange={handleChange('postalCode')}
                  size="small"
                  fullWidth
                />
              </Box>
              <Box>
                {renderLabel("Country")}
                <TextField
                  value={shippingAddressEditorOptions.country}
                  onChange={handleChange('country')}
                  size="small"
                  fullWidth
                />
              </Box>
            </Box>
          </Stack>
        </Box>
        <Divider />

        {/* Section: Spacing */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Spacing (Padding)
          </Typography>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <Box>
              {renderLabel("Top")}
              <TextField
                type="number"
                value={shippingAddressEditorOptions.paddingTop || ''}
                onChange={handleChange('paddingTop')}
                size="small"
                fullWidth
              />
            </Box>
            <Box>
              {renderLabel("Right")}
              <TextField
                type="number"
                value={shippingAddressEditorOptions.paddingRight || ''}
                onChange={handleChange('paddingRight')}
                size="small"
                fullWidth
              />
            </Box>
            <Box>
              {renderLabel("Bottom")}
              <TextField
                type="number"
                value={shippingAddressEditorOptions.paddingBottom || ''}
                onChange={handleChange('paddingBottom')}
                size="small"
                fullWidth
              />
            </Box>
            <Box>
              {renderLabel("Left")}
              <TextField
                type="number"
                value={shippingAddressEditorOptions.paddingLeft || ''}
                onChange={handleChange('paddingLeft')}
                size="small"
                fullWidth
              />
            </Box>
          </Box>
        </Box>
        <Divider />
        <CommonStylingControls
          options={shippingAddressEditorOptions}
          onUpdate={(updatedOptions) => dispatch(updateShippingAddressEditorOptions(updatedOptions))}
        />
      </Stack>
    </Box>
  );
};

export default ShippingAddressWidgetEditor;