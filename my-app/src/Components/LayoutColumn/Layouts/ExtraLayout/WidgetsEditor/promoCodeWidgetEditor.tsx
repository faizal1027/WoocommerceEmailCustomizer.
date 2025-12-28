import React, { useState } from 'react';
import { Box, Typography, TextField, Tooltip, IconButton, Stack, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updatePromoCodeEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { ChromePicker } from 'react-color';

const PromoCodeWidgetEditor = () => {
  const dispatch = useDispatch();
  const { promoCodeEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBorderColorPicker, setShowBorderColorPicker] = useState(false);

  const handleChange = (field: keyof typeof promoCodeEditorOptions) => (
    e: any
  ) => {
    dispatch(updatePromoCodeEditorOptions({ [field]: e.target.value }));
  };

  const handleColorChange = (field: string, newColor: any) => {
    dispatch(updatePromoCodeEditorOptions({ [field]: newColor.hex }));
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

  const colorSwatchStyle = (bgColor: string) => ({
    width: 30,
    height: 30,
    backgroundColor: bgColor,
    borderRadius: 1,
    border: "1px solid #ccc",
    cursor: "pointer",
  });

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
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Background Color
              </Typography>
              <Box position="relative">
                <Box
                  sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: 1, p: '4px 8px', height: '40px' }}
                  onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                >
                  <Box sx={colorSwatchStyle(promoCodeEditorOptions.backgroundColor || '#fff3cd')} />
                  <Typography variant="caption" sx={{ ml: 1, color: '#666' }}>{promoCodeEditorOptions.backgroundColor || '#fff3cd'}</Typography>
                </Box>
                {showBgColorPicker && (
                  <Box sx={{ position: "absolute", zIndex: 10, mt: 1, right: 0, backgroundColor: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", borderRadius: 1, overflow: 'hidden' }}>
                    <Box display="flex" justifyContent="flex-end" mb={0.5}>
                      <IconButton
                        size="small"
                        onClick={() => setShowBgColorPicker(false)}
                        sx={{ color: "white", backgroundColor: "rgba(0,0,0,0.5)", p: 0.5, '&:hover': { backgroundColor: "rgba(0,0,0,0.7)" } }}
                      >
                        <CloseIcon fontSize="small" sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                    <ChromePicker
                      color={promoCodeEditorOptions.backgroundColor || '#fff3cd'}
                      onChange={(color) => handleColorChange('backgroundColor', color)}
                    />
                  </Box>
                )}
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Text Color
              </Typography>
              <Box position="relative">
                <Box
                  sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: 1, p: '4px 8px', height: '40px' }}
                  onClick={() => setShowTextColorPicker(!showTextColorPicker)}
                >
                  <Box sx={colorSwatchStyle(promoCodeEditorOptions.textColor || '#856404')} />
                  <Typography variant="caption" sx={{ ml: 1, color: '#666' }}>{promoCodeEditorOptions.textColor || '#856404'}</Typography>
                </Box>
                {showTextColorPicker && (
                  <Box sx={{ position: "absolute", zIndex: 10, mt: 1, right: 0, backgroundColor: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", borderRadius: 1, overflow: 'hidden' }}>
                    <Box display="flex" justifyContent="flex-end" mb={0.5}>
                      <IconButton
                        size="small"
                        onClick={() => setShowTextColorPicker(false)}
                        sx={{ color: "white", backgroundColor: "rgba(0,0,0,0.5)", p: 0.5, '&:hover': { backgroundColor: "rgba(0,0,0,0.7)" } }}
                      >
                        <CloseIcon fontSize="small" sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                    <ChromePicker
                      color={promoCodeEditorOptions.textColor || '#856404'}
                      onChange={(color) => handleColorChange('textColor', color)}
                    />
                  </Box>
                )}
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Border Color
              </Typography>
              <Box position="relative">
                <Box
                  sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: 1, p: '4px 8px', height: '40px' }}
                  onClick={() => setShowBorderColorPicker(!showBorderColorPicker)}
                >
                  <Box sx={colorSwatchStyle(promoCodeEditorOptions.borderColor || '#ffeaa7')} />
                  <Typography variant="caption" sx={{ ml: 1, color: '#666' }}>{promoCodeEditorOptions.borderColor || '#ffeaa7'}</Typography>
                </Box>
                {showBorderColorPicker && (
                  <Box sx={{ position: "absolute", zIndex: 10, mt: 1, right: 0, backgroundColor: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", borderRadius: 1, overflow: 'hidden' }}>
                    <Box display="flex" justifyContent="flex-end" mb={0.5}>
                      <IconButton
                        size="small"
                        onClick={() => setShowBorderColorPicker(false)}
                        sx={{ color: "white", backgroundColor: "rgba(0,0,0,0.5)", p: 0.5, '&:hover': { backgroundColor: "rgba(0,0,0,0.7)" } }}
                      >
                        <CloseIcon fontSize="small" sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                    <ChromePicker
                      color={promoCodeEditorOptions.borderColor || '#ffeaa7'}
                      onChange={(color) => handleColorChange('borderColor', color)}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default PromoCodeWidgetEditor;