import React from 'react';
import { Box, Typography, IconButton, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import { setSelectedBlockId, updateShippingAddressEditorOptions } from '../../../Store/Slice/workspaceSlice';
import EditIcon from '@mui/icons-material/Edit';

interface ShippingAddressFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
  previewMode?: boolean;
}

const ShippingAddressFieldComponent: React.FC<ShippingAddressFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex,
  previewMode = true
}) => {
  const dispatch = useDispatch();
  const { shippingAddressEditorOptions } = useSelector((state: RootState) => state.workspace);
  const [isEditing, setIsEditing] = React.useState(false);

  const handleChange = (field: keyof typeof shippingAddressEditorOptions) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(updateShippingAddressEditorOptions({ [field]: e.target.value }));
  };

  const toggleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(!isEditing);
  };

  return (
    <Box
      onClick={(e) => {
        e.stopPropagation();
        onWidgetClick(e);
        onClick();
        dispatch(setSelectedBlockId(blockId));
      }}

      sx={{
        textAlign: shippingAddressEditorOptions.textAlign || 'left',
        paddingTop: `${shippingAddressEditorOptions.paddingTop || '8'}px`,
        paddingRight: `${shippingAddressEditorOptions.paddingRight || '8'}px`,
        paddingBottom: `${shippingAddressEditorOptions.paddingBottom || '8'}px`,
        paddingLeft: `${shippingAddressEditorOptions.paddingLeft || '8'}px`,
        border: isSelected ? '2px dashed blue' : '',
        borderRadius: 1,
        backgroundColor: shippingAddressEditorOptions.backgroundColor && shippingAddressEditorOptions.backgroundColor !== 'transparent' ? shippingAddressEditorOptions.backgroundColor : '#fff',
        position: 'relative',
      }}
    >


      <Typography variant="h6" gutterBottom sx={{
        fontFamily: shippingAddressEditorOptions.fontFamily === 'inherit' || !shippingAddressEditorOptions.fontFamily ? 'inherit' : shippingAddressEditorOptions.fontFamily,
        fontSize: shippingAddressEditorOptions.fontSize,
        color: shippingAddressEditorOptions.textColor,
      }}>
        SHIP TO:
      </Typography>

      {isEditing ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <TextField
            label="Full Name"
            value={shippingAddressEditorOptions.fullName}
            onChange={handleChange('fullName')}
            size="small"
            fullWidth
          />
          <TextField
            label="Phone"
            value={shippingAddressEditorOptions.phone}
            onChange={handleChange('phone')}
            size="small"
            fullWidth
          />
          <TextField
            label="Email"
            value={shippingAddressEditorOptions.email}
            onChange={handleChange('email')}
            size="small"
            fullWidth
          />
          <TextField
            label="Address Line 1"
            value={shippingAddressEditorOptions.addressLine1}
            onChange={handleChange('addressLine1')}
            size="small"
            fullWidth
          />
          <TextField
            label="Address Line 2"
            value={shippingAddressEditorOptions.addressLine2}
            onChange={handleChange('addressLine2')}
            size="small"
            fullWidth
          />
          <TextField
            label="City"
            value={shippingAddressEditorOptions.city}
            onChange={handleChange('city')}
            size="small"
            fullWidth
          />
          <TextField
            label="State"
            value={shippingAddressEditorOptions.state}
            onChange={handleChange('state')}
            size="small"
            fullWidth
          />
          <TextField
            label="Postal Code"
            value={shippingAddressEditorOptions.postalCode}
            onChange={handleChange('postalCode')}
            size="small"
            fullWidth
          />
          <TextField
            label="Country"
            value={shippingAddressEditorOptions.country}
            onChange={handleChange('country')}
            size="small"
            fullWidth
          />
        </Box>
      ) : (
        <>
          <Typography sx={{
            fontFamily: shippingAddressEditorOptions.fontFamily === 'inherit' || !shippingAddressEditorOptions.fontFamily ? 'inherit' : shippingAddressEditorOptions.fontFamily,
            fontSize: shippingAddressEditorOptions.fontSize,
            color: shippingAddressEditorOptions.textColor,
          }}>
            <strong>Name:</strong> {shippingAddressEditorOptions.fullName || (previewMode ? 'Jane Smith' : '{{shipping_name}}')}
          </Typography>
          <Typography sx={{
            fontFamily: shippingAddressEditorOptions.fontFamily === 'inherit' || !shippingAddressEditorOptions.fontFamily ? 'inherit' : shippingAddressEditorOptions.fontFamily,
            fontSize: shippingAddressEditorOptions.fontSize,
            color: shippingAddressEditorOptions.textColor,
          }}>
            <strong>Phone:</strong> {shippingAddressEditorOptions.phone || (previewMode ? '+1 (555) 987-6543' : '{{shipping_phone}}')}
          </Typography>
          <Typography sx={{
            fontFamily: shippingAddressEditorOptions.fontFamily === 'inherit' || !shippingAddressEditorOptions.fontFamily ? 'inherit' : shippingAddressEditorOptions.fontFamily,
            fontSize: shippingAddressEditorOptions.fontSize,
            color: shippingAddressEditorOptions.textColor,
          }}>
            <strong>Email:</strong> {shippingAddressEditorOptions.email || (previewMode ? 'jane.smith@example.com' : '{{shipping_email}}')}
          </Typography>
          <Typography sx={{
            fontFamily: shippingAddressEditorOptions.fontFamily === 'inherit' || !shippingAddressEditorOptions.fontFamily ? 'inherit' : shippingAddressEditorOptions.fontFamily,
            fontSize: shippingAddressEditorOptions.fontSize,
            color: shippingAddressEditorOptions.textColor,
          }}>
            <strong>Address Line 1:</strong> {shippingAddressEditorOptions.addressLine1 || (previewMode ? '456 Oak Avenue' : '{{shipping_address_1}}')}
          </Typography>
          <Typography sx={{
            fontFamily: shippingAddressEditorOptions.fontFamily === 'inherit' || !shippingAddressEditorOptions.fontFamily ? 'inherit' : shippingAddressEditorOptions.fontFamily,
            fontSize: shippingAddressEditorOptions.fontSize,
            color: shippingAddressEditorOptions.textColor,
          }}>
            <strong>Address Line 2:</strong> {shippingAddressEditorOptions.addressLine2 || (previewMode ? 'Suite 200' : '{{shipping_address_2}}')}
          </Typography>
          <Typography sx={{
            fontFamily: shippingAddressEditorOptions.fontFamily === 'inherit' || !shippingAddressEditorOptions.fontFamily ? 'inherit' : shippingAddressEditorOptions.fontFamily,
            fontSize: shippingAddressEditorOptions.fontSize,
            color: shippingAddressEditorOptions.textColor,
          }}>
            <strong>City:</strong> {shippingAddressEditorOptions.city || (previewMode ? 'Los Angeles' : '{{shipping_city}}')}
          </Typography>
          <Typography sx={{
            fontFamily: shippingAddressEditorOptions.fontFamily === 'inherit' || !shippingAddressEditorOptions.fontFamily ? 'inherit' : shippingAddressEditorOptions.fontFamily,
            fontSize: shippingAddressEditorOptions.fontSize,
            color: shippingAddressEditorOptions.textColor,
          }}>
            <strong>State:</strong> {shippingAddressEditorOptions.state || (previewMode ? 'CA' : '{{shipping_state}}')}
          </Typography>
          <Typography sx={{
            fontFamily: shippingAddressEditorOptions.fontFamily === 'inherit' || !shippingAddressEditorOptions.fontFamily ? 'inherit' : shippingAddressEditorOptions.fontFamily,
            fontSize: shippingAddressEditorOptions.fontSize,
            color: shippingAddressEditorOptions.textColor,
          }}>
            <strong>Postal Code:</strong> {shippingAddressEditorOptions.postalCode || (previewMode ? '90001' : '{{shipping_postcode}}')}
          </Typography>
          <Typography sx={{
            fontFamily: shippingAddressEditorOptions.fontFamily === 'inherit' || !shippingAddressEditorOptions.fontFamily ? 'inherit' : shippingAddressEditorOptions.fontFamily,
            fontSize: shippingAddressEditorOptions.fontSize,
            color: shippingAddressEditorOptions.textColor,
          }}>
            <strong>Country:</strong> {shippingAddressEditorOptions.country || (previewMode ? 'United States' : '{{shipping_country}}')}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default ShippingAddressFieldComponent;