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
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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

  return (
    <Box sx={{ bgcolor: '#f9f9f9', height: '100%' }}>
      {/* Editor Header */}
      <Box sx={{ p: '15px 20px', bgcolor: '#fff', borderBottom: '1px solid #e7e9eb' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#495157' }}>Billing Address</Typography>
          <Box display="flex" gap={1}>
            <Tooltip title="Close">
              <IconButton onClick={handleCloseEditor} size="small" sx={{ p: 0.5 }}>
                <CloseIcon fontSize="small" sx={{ color: '#a4afb7', fontSize: '18px' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={handleDeleteContent} size="small" sx={{ p: 0.5 }}>
                <DeleteIcon fontSize="small" sx={{ color: '#a4afb7', fontSize: '18px' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Typography sx={{ fontSize: '11px', color: '#6d7882', fontStyle: 'italic' }}>
          Style the billing address section.
        </Typography>
      </Box>

      {/* Editor Sections */}
      <Box sx={{ height: 'calc(100% - 70px)', overflowY: 'auto' }}>
        {/* Style Section */}
        <Accordion defaultExpanded disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Style</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
            <Stack spacing={2.5}>
              <CommonStylingControls
                options={billingAddressEditorOptions}
                onUpdate={(updatedOptions) => dispatch(updateBillingAddressEditorOptions(updatedOptions))}
                showPadding={true}
                showFontWeight={true}
                showLineHeight={true}
                showTypography={true}
              />
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default BillingAddressWidgetEditor;