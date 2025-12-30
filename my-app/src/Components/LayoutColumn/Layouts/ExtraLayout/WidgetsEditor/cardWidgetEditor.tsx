import React, { useState } from 'react';
import { Box, Typography, TextField, Tooltip, IconButton, Stack, Divider, InputAdornment, FormControl, InputLabel, OutlinedInput, Popover, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateCardEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import { PlaceholderSelect } from "../../../../utils/PlaceholderSelect";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from '@mui/icons-material/Image';
import ColorPicker from "../../../../utils/ColorPicker";
import CropOriginalIcon from "@mui/icons-material/CropOriginal";

const CardWidgetEditor = () => {
  const dispatch = useDispatch();
  const { cardEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const handleChange = (field: keyof typeof cardEditorOptions) => (
    e: any
  ) => {
    dispatch(updateCardEditorOptions({ [field]: e.target.value }));
  };

  const handleBrowseImage = () => {
    const wp = (window as any).wp;
    if (wp && wp.media) {
      const mediaFrame = wp.media({
        title: 'Select Image',
        button: {
          text: 'Insert into Email',
        },
        multiple: false,
      });

      mediaFrame.on('select', () => {
        const attachment = mediaFrame.state().get('selection').first().toJSON();
        const imageUrl = attachment.url;
        dispatch(updateCardEditorOptions({ imageUrl: imageUrl }));
      });

      mediaFrame.open();
    } else {
      alert('WordPress Media Library is not available.');
    }
  };

  const handleColorChange = (field: string, newColor: string) => {
    dispatch(updateCardEditorOptions({ [field]: newColor }));
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
              Card
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Edit card content.
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
            Content
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#666' }}>
                  Title
                </Typography>
                <PlaceholderSelect
                  onSelect={(ph) => handleChange('title')({ target: { value: (cardEditorOptions.title || '') + ph } })}
                  label="Variables"
                />
              </Box>
              <TextField
                value={cardEditorOptions.title || 'Card Title'}
                onChange={handleChange('title')}
                size="small"
                fullWidth
              />
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#666' }}>
                  Content
                </Typography>
                <PlaceholderSelect
                  onSelect={(ph) => handleChange('content')({ target: { value: (cardEditorOptions.content || '') + ph } })}
                  label="Variables"
                />
              </Box>
              <TextField
                multiline
                rows={3}
                value={cardEditorOptions.content || 'This is the card content. You can put any information here.'}
                onChange={handleChange('content')}
                size="small"
                fullWidth
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Image URL (optional)
              </Typography>
              <TextField
                value={cardEditorOptions.imageUrl || ''}
                onChange={handleChange('imageUrl')}
                size="small"
                fullWidth
                placeholder="https://example.com/image.jpg"
                sx={{ mb: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ImageIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CropOriginalIcon />}
                size="small"
                onClick={handleBrowseImage}
                sx={{ border: '1px solid #ccc', bgcolor: 'white', color: 'text.primary' }}
              >
                Browse Media Library
              </Button>
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
              label="Background"
              value={cardEditorOptions.backgroundColor || '#ffffff'}
              onChange={(color) => handleColorChange('backgroundColor', color)}
            />

            <ColorPicker
              label="Text Color"
              value={cardEditorOptions.textColor || '#333333'}
              onChange={(color) => handleColorChange('textColor', color)}
            />

          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Border Settings
          </Typography>
          <Stack spacing={2}>
            <ColorPicker
              label="Border Color"
              value={cardEditorOptions.borderColor || '#ddd'}
              onChange={(color) => handleColorChange('borderColor', color)}
            />

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Border Radius (px)
              </Typography>
              <TextField
                type="number"
                value={cardEditorOptions.borderRadius || 8}
                onChange={handleChange('borderRadius')}
                size="small"
                fullWidth
              />
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default CardWidgetEditor;