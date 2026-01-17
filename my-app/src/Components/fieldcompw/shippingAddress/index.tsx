import React from 'react';
import { Box, Typography, IconButton, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import { setSelectedBlockId, updateShippingAddressEditorOptions, defaultShippingAddressEditorOptions, ShippingAddressEditorOptions } from '../../../Store/Slice/workspaceSlice';
import EditIcon from '@mui/icons-material/Edit';

interface ShippingAddressFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
  previewMode?: boolean;
  widgetData?: any;
}

const ShippingAddressFieldComponent: React.FC<ShippingAddressFieldComponentProps> = ({
  blockId,
  columnIndex,
  isSelected,
  onClick,
  onWidgetClick,
  widgetIndex,
  previewMode = true,
  widgetData
}) => {
  const { blocks } = useSelector((state: RootState) => state.workspace);
  const dispatch = useDispatch();

  const storeBlock = blocks.find((b) => b.id === blockId);
  const storeColumn = storeBlock?.columns[columnIndex];
  const storeWidget = storeColumn?.widgetContents[widgetIndex];

  const widget = widgetData || storeWidget;

  const content = widget?.contentData
    ? { ...defaultShippingAddressEditorOptions, ...JSON.parse(widget.contentData) }
    : defaultShippingAddressEditorOptions;

  const [isEditing, setIsEditing] = React.useState(false);

  const handleChange = (field: keyof ShippingAddressEditorOptions) => (
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
        width: '100%',
        boxSizing: 'border-box',
        textAlign: content.textAlign || 'left',
        padding: content.padding || '16px',
        border: '',
        borderRadius: 1,
        backgroundColor: content.backgroundColor && content.backgroundColor !== 'transparent' ? content.backgroundColor : '#fff',
        position: 'relative',
      }}
    >


      <Typography variant="h6" gutterBottom sx={{
        fontFamily: content.fontFamily === 'inherit' || !content.fontFamily ? 'inherit' : content.fontFamily,
        fontSize: content.fontSize,
        color: content.textColor,
      }}>
        SHIP TO:
      </Typography>

      {isEditing ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <TextField
            label="Full Name"
            value={content.fullName}
            onChange={handleChange('fullName')}
            size="small"
            fullWidth
          />
          <TextField
            label="Phone"
            value={content.phone}
            onChange={handleChange('phone')}
            size="small"
            fullWidth
          />
          <TextField
            label="Email"
            value={content.email}
            onChange={handleChange('email')}
            size="small"
            fullWidth
          />
          <TextField
            label="Address Line 1"
            value={content.addressLine1}
            onChange={handleChange('addressLine1')}
            size="small"
            fullWidth
          />
          <TextField
            label="Address Line 2"
            value={content.addressLine2}
            onChange={handleChange('addressLine2')}
            size="small"
            fullWidth
          />
          <TextField
            label="City"
            value={content.city}
            onChange={handleChange('city')}
            size="small"
            fullWidth
          />
          <TextField
            label="State"
            value={content.state}
            onChange={handleChange('state')}
            size="small"
            fullWidth
          />
          <TextField
            label="Postal Code"
            value={content.postalCode}
            onChange={handleChange('postalCode')}
            size="small"
            fullWidth
          />
          <TextField
            label="Country"
            value={content.country}
            onChange={handleChange('country')}
            size="small"
            fullWidth
          />
        </Box>
      ) : (
        <>
          <Typography sx={{
            fontFamily: content.fontFamily === 'inherit' || !content.fontFamily ? 'inherit' : content.fontFamily,
            fontSize: content.fontSize,
            color: content.textColor,
            fontWeight: content.fontWeight,
            lineHeight: content.lineHeight || undefined,
            marginBottom: '4px',
          }}>
            <strong>Name:</strong> {content.fullName || (previewMode ? 'Jane Smith' : '{{shipping_name}}')}
          </Typography>
          <Typography sx={{
            fontFamily: content.fontFamily === 'inherit' || !content.fontFamily ? 'inherit' : content.fontFamily,
            fontSize: content.fontSize,
            color: content.textColor,
            fontWeight: content.fontWeight,
            lineHeight: content.lineHeight || undefined,
            marginBottom: '4px',
          }}>
            <strong>Phone:</strong> {content.phone || (previewMode ? '+1 (555) 987-6543' : '{{shipping_phone}}')}
          </Typography>
          <Typography sx={{
            fontFamily: content.fontFamily === 'inherit' || !content.fontFamily ? 'inherit' : content.fontFamily,
            fontSize: content.fontSize,
            color: content.textColor,
            fontWeight: content.fontWeight,
            lineHeight: content.lineHeight || undefined,
            marginBottom: '4px',
          }}>
            <strong>Email:</strong> {content.email || (previewMode ? 'jane.smith@example.com' : '{{shipping_email}}')}
          </Typography>
          <Typography sx={{
            fontFamily: content.fontFamily === 'inherit' || !content.fontFamily ? 'inherit' : content.fontFamily,
            fontSize: content.fontSize,
            color: content.textColor,
            fontWeight: content.fontWeight,
            lineHeight: content.lineHeight || undefined,
            marginBottom: '4px',
          }}>
            <strong>Address Line 1:</strong> {content.addressLine1 || (previewMode ? '456 Oak Avenue' : '{{shipping_address_1}}')}
          </Typography>
          <Typography sx={{
            fontFamily: content.fontFamily === 'inherit' || !content.fontFamily ? 'inherit' : content.fontFamily,
            fontSize: content.fontSize,
            color: content.textColor,
            fontWeight: content.fontWeight,
            lineHeight: content.lineHeight || undefined,
            marginBottom: '4px',
          }}>
            <strong>Address Line 2:</strong> {content.addressLine2 || (previewMode ? 'Suite 200' : '{{shipping_address_2}}')}
          </Typography>
          <Typography sx={{
            fontFamily: content.fontFamily === 'inherit' || !content.fontFamily ? 'inherit' : content.fontFamily,
            fontSize: content.fontSize,
            color: content.textColor,
            fontWeight: content.fontWeight,
            lineHeight: content.lineHeight || undefined,
            marginBottom: '4px',
          }}>
            <strong>City:</strong> {content.city || (previewMode ? 'Los Angeles' : '{{shipping_city}}')}
          </Typography>
          <Typography sx={{
            fontFamily: content.fontFamily === 'inherit' || !content.fontFamily ? 'inherit' : content.fontFamily,
            fontSize: content.fontSize,
            color: content.textColor,
            fontWeight: content.fontWeight,
            lineHeight: content.lineHeight || undefined,
            marginBottom: '4px',
          }}>
            <strong>State:</strong> {content.state || (previewMode ? 'CA' : '{{shipping_state}}')}
          </Typography>
          <Typography sx={{
            fontFamily: content.fontFamily === 'inherit' || !content.fontFamily ? 'inherit' : content.fontFamily,
            fontSize: content.fontSize,
            color: content.textColor,
            fontWeight: content.fontWeight,
            lineHeight: content.lineHeight || undefined,
            marginBottom: '4px',
          }}>
            <strong>Postal Code:</strong> {content.postalCode || (previewMode ? '90001' : '{{shipping_postcode}}')}
          </Typography>
          <Typography sx={{
            fontFamily: content.fontFamily === 'inherit' || !content.fontFamily ? 'inherit' : content.fontFamily,
            fontSize: content.fontSize,
            color: content.textColor,
            fontWeight: content.fontWeight,
            lineHeight: content.lineHeight || undefined,
            marginBottom: '4px',
          }}>
            <strong>Country:</strong> {content.country || (previewMode ? 'United States' : '{{shipping_country}}')}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default ShippingAddressFieldComponent;