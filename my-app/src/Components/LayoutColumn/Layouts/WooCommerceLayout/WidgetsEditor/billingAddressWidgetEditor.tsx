import React from 'react';
import {
  Box, Typography, TextField, MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  Tooltip,
  IconButton,
  Stack,
  Divider,
  InputLabel
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { closeEditor, deleteColumnContent, updateBillingAddressEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import CommonStylingControls from '../../../../utils/CommonStylingControls';

const fontFamilies = ['Global', 'Arial', 'Roboto', 'Times New Roman', 'Verdana'];
const fontWeights = ['Normal', 'Bold', 'Lighter', 'Bolder'];

const BillingAddressWidgetEditor = () => {
  const dispatch = useDispatch();
  const { billingAddressEditorOptions, selectedWidgetIndex } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const handleChange = (field: keyof typeof billingAddressEditorOptions) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(updateBillingAddressEditorOptions({ [field]: e.target.value }));
    };

  const handleTextAlignChange = (_: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    if (newAlignment !== null) {
      dispatch(updateBillingAddressEditorOptions({ textAlign: newAlignment }));
    }
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

  const {
    fontFamily,
    fontWeight,
    fontSize,
    textColor,
    textAlign,
    lineHeight,
    letterSpacing,
    padding,
  } = billingAddressEditorOptions;

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
            <Typography variant="h6">
              Billing Address
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Style the billing address section.
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

        {/* Styling Controls */}
        <CommonStylingControls
          options={billingAddressEditorOptions}
          onUpdate={(updatedOptions) => dispatch(updateBillingAddressEditorOptions(updatedOptions))}
          showPadding={true} // Enable standard padding control
        />

        <Divider />

      </Stack>
    </Box>
  );
};

export default BillingAddressWidgetEditor;