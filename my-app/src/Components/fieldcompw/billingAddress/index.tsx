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
import { updateBillingAddressEditorOptions, setSelectedBlockId, defaultBillingAddressEditorOptions, BillingAddressEditorOptions } from '../../../Store/Slice/workspaceSlice';
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
  widgetData?: any;
}

const fallback = (value: string, placeholder: string) => value?.trim() || placeholder;

const BillingAddressFieldComponent: React.FC<BillingAddressFieldComponentProps> = ({
  isSelected,
  onClick,
  onWidgetClick,
  blockId,
  columnIndex,
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
    ? { ...defaultBillingAddressEditorOptions, ...JSON.parse(widget.contentData) }
    : defaultBillingAddressEditorOptions;

  const [isEditing, setIsEditing] = React.useState(false);

  const handleChange =
    (field: keyof BillingAddressEditorOptions) =>
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
      <Box sx={{
        display: 'flex',
        justifyContent:
          content.textAlign === 'center' ? 'center' :
            content.textAlign === 'right' ? 'flex-end' :
              'flex-start',
        alignItems: 'center'
      }}>
        <Typography variant="h6" sx={{
          fontFamily: content.fontFamily === 'inherit' || !content.fontFamily ? 'inherit' : content.fontFamily,
          fontSize: content.fontSize,
          color: content.textColor,
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
              value={content[field as keyof BillingAddressEditorOptions]}
              onChange={handleChange(field as keyof BillingAddressEditorOptions)}
              size="small"
              fullWidth
            />
          ))}
        </Box>
      ) : (
        <Box sx={{ mt: 1 }}>
          <Typography sx={{
            fontFamily: content.fontFamily === 'inherit' || !content.fontFamily ? 'inherit' : content.fontFamily,
            fontSize: content.fontSize,
            color: content.textColor,
            fontWeight: content.fontWeight,
            lineHeight: content.lineHeight || undefined,
            marginBottom: '4px',
          }}><strong>Name:</strong> {fallback(content.fullName, previewMode ? 'John Doe' : '{{billing_name}}')}</Typography>
          <Typography sx={{
            fontFamily: content.fontFamily === 'inherit' || !content.fontFamily ? 'inherit' : content.fontFamily,
            fontSize: content.fontSize,
            color: content.textColor,
            fontWeight: content.fontWeight,
            lineHeight: content.lineHeight || undefined,
            marginBottom: '4px',
          }}><strong>Phone:</strong> {fallback(content.phone, previewMode ? '+1 (555) 123-4567' : '{{billing_phone}}')}</Typography>
          <Typography sx={{
            fontFamily: content.fontFamily === 'inherit' || !content.fontFamily ? 'inherit' : content.fontFamily,
            fontSize: content.fontSize,
            color: content.textColor,
            fontWeight: content.fontWeight,
            lineHeight: content.lineHeight || undefined,
            marginBottom: '4px',
          }}><strong>Email:</strong> {fallback(content.email, previewMode ? 'john.doe@example.com' : '{{billing_email}}')}</Typography>
          <Typography sx={{
            fontFamily: content.fontFamily === 'inherit' || !content.fontFamily ? 'inherit' : content.fontFamily,
            fontSize: content.fontSize,
            color: content.textColor,
            fontWeight: content.fontWeight,
            lineHeight: content.lineHeight || undefined,
            marginBottom: '4px',
          }}><strong>Address Line 1:</strong> {fallback(content.addressLine1, previewMode ? '123 Main Street' : '{{billing_address_1}}')}</Typography>
          <Typography sx={{
            fontFamily: content.fontFamily === 'inherit' || !content.fontFamily ? 'inherit' : content.fontFamily,
            fontSize: content.fontSize,
            color: content.textColor,
            fontWeight: content.fontWeight,
            lineHeight: content.lineHeight || undefined,
            marginBottom: '4px',
          }}><strong>Address Line 2:</strong> {fallback(content.addressLine2, previewMode ? 'Apt 4B' : '{{billing_address_2}}')}</Typography>
          <Typography sx={{
            fontFamily: content.fontFamily === 'inherit' || !content.fontFamily ? 'inherit' : content.fontFamily,
            fontSize: content.fontSize,
            color: content.textColor,
            fontWeight: content.fontWeight,
            lineHeight: content.lineHeight || undefined,
            marginBottom: '4px',
          }}><strong>City:</strong> {fallback(content.city, previewMode ? 'New York' : '{{billing_city}}')}</Typography>
          <Typography sx={{
            fontFamily: content.fontFamily === 'inherit' || !content.fontFamily ? 'inherit' : content.fontFamily,
            fontSize: content.fontSize,
            color: content.textColor,
            fontWeight: content.fontWeight,
            lineHeight: content.lineHeight || undefined,
            marginBottom: '4px',
          }}><strong>State:</strong> {fallback(content.state, previewMode ? 'NY' : '{{billing_state}}')}</Typography>
          <Typography sx={{
            fontFamily: content.fontFamily === 'inherit' || !content.fontFamily ? 'inherit' : content.fontFamily,
            fontSize: content.fontSize,
            color: content.textColor,
            fontWeight: content.fontWeight,
            lineHeight: content.lineHeight || undefined,
            marginBottom: '4px',
          }}><strong>Postal Code:</strong> {fallback(content.postalCode, previewMode ? '10001' : '{{billing_postcode}}')}</Typography>
          <Typography sx={{
            fontFamily: content.fontFamily === 'inherit' || !content.fontFamily ? 'inherit' : content.fontFamily,
            fontSize: content.fontSize,
            color: content.textColor,
            fontWeight: content.fontWeight,
            lineHeight: content.lineHeight || undefined,
            marginBottom: '4px',
          }}><strong>Country:</strong> {fallback(content.country, previewMode ? 'United States' : '{{billing_country}}')}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default BillingAddressFieldComponent;
