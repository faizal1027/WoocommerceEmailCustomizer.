import React, { useState } from 'react';
import { Box, Typography, TextField, Tooltip, IconButton, Stack, Divider, InputAdornment } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateTestimonialEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from '@mui/icons-material/Image';
import { ChromePicker } from 'react-color';
import CropOriginalIcon from "@mui/icons-material/CropOriginal";
import { Button } from '@mui/material';

const TestimonialWidgetEditor = () => {
  const dispatch = useDispatch();
  const { testimonialEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);

  const handleChange = (field: keyof typeof testimonialEditorOptions) => (
    e: any
  ) => {
    dispatch(updateTestimonialEditorOptions({ [field]: e.target.value }));
  };

  const handleBrowseImage = () => {
    const wp = (window as any).wp;
    if (wp && wp.media) {
      const mediaFrame = wp.media({
        title: 'Select Author Image',
        button: {
          text: 'Insert into Email',
        },
        multiple: false,
      });

      mediaFrame.on('select', () => {
        const attachment = mediaFrame.state().get('selection').first().toJSON();
        const imageUrl = attachment.url;
        dispatch(updateTestimonialEditorOptions({ authorImage: imageUrl }));
      });

      mediaFrame.open();
    } else {
      alert('WordPress Media Library is not available.');
    }
  };

  const handleColorChange = (field: string, newColor: any) => {
    dispatch(updateTestimonialEditorOptions({ [field]: newColor.hex }));
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
              Testimonial
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Edit testimonial content.
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
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Quote
              </Typography>
              <TextField
                multiline
                rows={3}
                value={testimonialEditorOptions.quote || 'This product changed my life! Highly recommended.'}
                onChange={handleChange('quote')}
                size="small"
                fullWidth
              />
            </Box>

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Author Name
                </Typography>
                <TextField
                  value={testimonialEditorOptions.author || 'John Doe'}
                  onChange={handleChange('author')}
                  size="small"
                  fullWidth
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Title/Role
                </Typography>
                <TextField
                  value={testimonialEditorOptions.authorTitle || 'Happy Customer'}
                  onChange={handleChange('authorTitle')}
                  size="small"
                  fullWidth
                />
              </Box>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Author Image URL
              </Typography>
              <TextField
                value={testimonialEditorOptions.authorImage || 'https://cdn.tools.unlayer.com/image/placeholder.png'}
                onChange={handleChange('authorImage')}
                size="small"
                fullWidth
                placeholder="https://example.com/avatar.jpg"
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
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Background Color
              </Typography>
              <Box position="relative">
                <Box
                  sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: 1, p: '4px 8px', height: '40px' }}
                  onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                >
                  <Box sx={colorSwatchStyle(testimonialEditorOptions.backgroundColor || '#f8f9fa')} />
                  <Typography variant="caption" sx={{ ml: 1, color: '#666' }}>{testimonialEditorOptions.backgroundColor || '#f8f9fa'}</Typography>
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
                      color={testimonialEditorOptions.backgroundColor || '#f8f9fa'}
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
                  <Box sx={colorSwatchStyle(testimonialEditorOptions.textColor || '#333333')} />
                  <Typography variant="caption" sx={{ ml: 1, color: '#666' }}>{testimonialEditorOptions.textColor || '#333333'}</Typography>
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
                      color={testimonialEditorOptions.textColor || '#333333'}
                      onChange={(color) => handleColorChange('textColor', color)}
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

export default TestimonialWidgetEditor;