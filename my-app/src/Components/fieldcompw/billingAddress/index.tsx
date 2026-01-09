import React from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Store/store';
import { updateBillingAddressEditorOptions } from '../../../Store/Slice/workspaceSlice';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

interface BillingAddressFieldComponentProps {
  blockId: string;
  columnIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onWidgetClick: (e: React.MouseEvent) => void;
  widgetIndex: number;
  previewMode?: boolean;
}

const fallback = (value: string, placeholder: string) => value?.trim() || placeholder;

const BillingAddressFieldComponent: React.FC<BillingAddressFieldComponentProps> = ({
  isSelected,
  onClick,
  onWidgetClick,
  blockId,
  columnIndex,
  widgetIndex,
  previewMode = true
}) => {
  const dispatch = useDispatch();
  const { billingAddressEditorOptions } = useSelector(
    (state: RootState) => state.workspace
  );
  const [isEditing, setIsEditing] = React.useState(false);

  const handleChange =
    (field: keyof typeof billingAddressEditorOptions) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateBillingAddressEditorOptions({ [field]: e.target.value }));
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
      }}
      sx={{
        textAlign: billingAddressEditorOptions.textAlign || 'left',
        padding: billingAddressEditorOptions.padding || '16px',
        border: isSelected ? '2px dashed blue' : '',
        borderRadius: 1,
        backgroundColor: billingAddressEditorOptions.backgroundColor && billingAddressEditorOptions.backgroundColor !== 'transparent' ? billingAddressEditorOptions.backgroundColor : '#fff',
        position: 'relative',
      }}
    >
      <Box sx={{
        display: 'flex',
        justifyContent:
          billingAddressEditorOptions.textAlign === 'center' ? 'center' :
            billingAddressEditorOptions.textAlign === 'right' ? 'flex-end' :
              'flex-start',
        alignItems: 'center'
      }}>
        <Typography variant="h6" sx={{
          fontFamily: billingAddressEditorOptions.fontFamily === 'inherit' || !billingAddressEditorOptions.fontFamily ? 'inherit' : billingAddressEditorOptions.fontFamily,
          fontSize: billingAddressEditorOptions.fontSize,
          color: billingAddressEditorOptions.textColor,
          fontWeight: 'bold',
        }}>BILL TO:</Typography>
      </Box>

      {isEditing ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
            },
            gap: '10px',
          }}
        >
          {[
            'fullName',
            'phone',
            'email',
            'addressLine1',
            'addressLine2',
            'city',
            'state',
            'postalCode',
            'country',
          ].map((field) => (
            <TextField
              key={field}
              label={field
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase())}
              value={billingAddressEditorOptions[field as keyof typeof billingAddressEditorOptions]}
              onChange={handleChange(field as keyof typeof billingAddressEditorOptions)}
              size="small"
              fullWidth
            />
          ))}
        </Box>
      ) : (
        <Box sx={{ mt: 1 }}>
          <Typography sx={{
            fontFamily: billingAddressEditorOptions.fontFamily === 'inherit' || !billingAddressEditorOptions.fontFamily ? 'inherit' : billingAddressEditorOptions.fontFamily,
            fontSize: billingAddressEditorOptions.fontSize,
            color: billingAddressEditorOptions.textColor,
          }}><strong>Name:</strong> {fallback(billingAddressEditorOptions.fullName, previewMode ? 'John Doe' : '{{billing_name}}')}</Typography>
          <Typography sx={{
            fontFamily: billingAddressEditorOptions.fontFamily === 'inherit' || !billingAddressEditorOptions.fontFamily ? 'inherit' : billingAddressEditorOptions.fontFamily,
            fontSize: billingAddressEditorOptions.fontSize,
            color: billingAddressEditorOptions.textColor,
          }}><strong>Phone:</strong> {fallback(billingAddressEditorOptions.phone, previewMode ? '+1 (555) 123-4567' : '{{billing_phone}}')}</Typography>
          <Typography sx={{
            fontFamily: billingAddressEditorOptions.fontFamily === 'inherit' || !billingAddressEditorOptions.fontFamily ? 'inherit' : billingAddressEditorOptions.fontFamily,
            fontSize: billingAddressEditorOptions.fontSize,
            color: billingAddressEditorOptions.textColor,
          }}><strong>Email:</strong> {fallback(billingAddressEditorOptions.email, previewMode ? 'john.doe@example.com' : '{{billing_email}}')}</Typography>
          <Typography sx={{
            fontFamily: billingAddressEditorOptions.fontFamily === 'inherit' || !billingAddressEditorOptions.fontFamily ? 'inherit' : billingAddressEditorOptions.fontFamily,
            fontSize: billingAddressEditorOptions.fontSize,
            color: billingAddressEditorOptions.textColor,
          }}><strong>Address Line 1:</strong> {fallback(billingAddressEditorOptions.addressLine1, previewMode ? '123 Main Street' : '{{billing_address_1}}')}</Typography>
          <Typography sx={{
            fontFamily: billingAddressEditorOptions.fontFamily === 'inherit' || !billingAddressEditorOptions.fontFamily ? 'inherit' : billingAddressEditorOptions.fontFamily,
            fontSize: billingAddressEditorOptions.fontSize,
            color: billingAddressEditorOptions.textColor,
          }}><strong>Address Line 2:</strong> {fallback(billingAddressEditorOptions.addressLine2, previewMode ? 'Apt 4B' : '{{billing_address_2}}')}</Typography>
          <Typography sx={{
            fontFamily: billingAddressEditorOptions.fontFamily === 'inherit' || !billingAddressEditorOptions.fontFamily ? 'inherit' : billingAddressEditorOptions.fontFamily,
            fontSize: billingAddressEditorOptions.fontSize,
            color: billingAddressEditorOptions.textColor,
          }}><strong>City:</strong> {fallback(billingAddressEditorOptions.city, previewMode ? 'New York' : '{{billing_city}}')}</Typography>
          <Typography sx={{
            fontFamily: billingAddressEditorOptions.fontFamily === 'inherit' || !billingAddressEditorOptions.fontFamily ? 'inherit' : billingAddressEditorOptions.fontFamily,
            fontSize: billingAddressEditorOptions.fontSize,
            color: billingAddressEditorOptions.textColor,
          }}><strong>State:</strong> {fallback(billingAddressEditorOptions.state, previewMode ? 'NY' : '{{billing_state}}')}</Typography>
          <Typography sx={{
            fontFamily: billingAddressEditorOptions.fontFamily === 'inherit' || !billingAddressEditorOptions.fontFamily ? 'inherit' : billingAddressEditorOptions.fontFamily,
            fontSize: billingAddressEditorOptions.fontSize,
            color: billingAddressEditorOptions.textColor,
          }}><strong>Postal Code:</strong> {fallback(billingAddressEditorOptions.postalCode, previewMode ? '10001' : '{{billing_postcode}}')}</Typography>
          <Typography sx={{
            fontFamily: billingAddressEditorOptions.fontFamily === 'inherit' || !billingAddressEditorOptions.fontFamily ? 'inherit' : billingAddressEditorOptions.fontFamily,
            fontSize: billingAddressEditorOptions.fontSize,
            color: billingAddressEditorOptions.textColor,
          }}><strong>Country:</strong> {fallback(billingAddressEditorOptions.country, previewMode ? 'United States' : '{{billing_country}}')}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default BillingAddressFieldComponent;
