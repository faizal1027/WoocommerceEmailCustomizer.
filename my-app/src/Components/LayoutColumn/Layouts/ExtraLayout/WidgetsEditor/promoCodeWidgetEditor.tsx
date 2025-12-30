import React, { useState } from 'react';
import { Box, Typography, TextField, Tooltip, IconButton, Stack, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updatePromoCodeEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ColorPicker from "../../../../utils/ColorPicker";

const PromoCodeWidgetEditor = () => {
  const dispatch = useDispatch();
  const { promoCodeEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );


  const handleChange = (field: keyof typeof promoCodeEditorOptions) => (
    e: any
  ) => {
    dispatch(updatePromoCodeEditorOptions({ [field]: e.target.value }));
  };

  const handleColorChange = (field: string, newColor: string) => {
    dispatch(updatePromoCodeEditorOptions({ [field]: newColor }));
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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h6">
              Promo Code
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Edit promo code details.
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" gap={1}>
            <Tooltip title="close" placement="bottom">
              <IconButton
                onClick={handleCloseEditor}
                sx={{
                  backgroundColor: "#9e9e9e",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#757575",
                  },
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  padding: 0,
                  minWidth: "unset",
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete" placement="bottom">
              <IconButton
                onClick={handleDeleteContent}
                sx={{
                  backgroundColor: "#9e9e9e",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#757575",
                  },
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  padding: 0,
                  minWidth: "unset",
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Details
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Promo Code
              </Typography>
              <TextField
                value={promoCodeEditorOptions.code || 'SAVE20'}
                onChange={handleChange('code')}
                size="small"
                fullWidth
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Description
              </Typography>
              <TextField
                multiline
                rows={2}
                value={promoCodeEditorOptions.description || 'Use this code to get 20% off your purchase!'}
                onChange={handleChange('description')}
                size="small"
                fullWidth
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Valid Until
              </Typography>
              <TextField
                value={promoCodeEditorOptions.validUntil || 'December 31, 2024'}
                onChange={handleChange('validUntil')}
                size="small"
                fullWidth
              />
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Appearance
          </Typography>
          <Stack spacing={2}>
            <ColorPicker
              label="Background Color"
              value={promoCodeEditorOptions.backgroundColor || '#fff3cd'}
              onChange={(color) => handleColorChange('backgroundColor', color)}
            />

            <ColorPicker
              label="Text Color"
              value={promoCodeEditorOptions.textColor || '#856404'}
              onChange={(color) => handleColorChange('textColor', color)}
            />

            <ColorPicker
              label="Border Color"
              value={promoCodeEditorOptions.borderColor || '#ffeaa7'}
              onChange={(color) => handleColorChange('borderColor', color)}
            />

          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default PromoCodeWidgetEditor;