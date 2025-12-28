import { Box, Typography, TextField, Tooltip, IconButton, Stack, Divider, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateImageBoxEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CropOriginalIcon from "@mui/icons-material/CropOriginal";

const ImageBoxWidgetEditor = () => {
  const dispatch = useDispatch();
  const { imageBoxEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const handleChange = (field: keyof typeof imageBoxEditorOptions) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(updateImageBoxEditorOptions({ [field]: e.target.value }));
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
        dispatch(updateImageBoxEditorOptions({ src: imageUrl }));
      });

      mediaFrame.open();
    } else {
      alert('WordPress Media Library is not available.');
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
              Image Box
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Customize image box style.
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
            Image Source
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Image URL
              </Typography>
              <TextField
                value={imageBoxEditorOptions.src || 'https://cdn.tools.unlayer.com/image/placeholder.png'}
                onChange={handleChange('src')}
                size="small"
                fullWidth
                placeholder="https://example.com/image.jpg"
                sx={{ mb: 1 }}
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

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Alt Text
              </Typography>
              <TextField
                value={imageBoxEditorOptions.alt || 'Image'}
                onChange={handleChange('alt')}
                size="small"
                fullWidth
              />
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Dimensions
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Width
                </Typography>
                <TextField
                  value={imageBoxEditorOptions.width || '100%'}
                  onChange={handleChange('width')}
                  size="small"
                  placeholder="100%"
                  fullWidth
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Height
                </Typography>
                <TextField
                  value={imageBoxEditorOptions.height || 'auto'}
                  onChange={handleChange('height')}
                  size="small"
                  placeholder="auto"
                  fullWidth
                />
              </Box>
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Content
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Link (optional)
              </Typography>
              <TextField
                value={imageBoxEditorOptions.link || ''}
                onChange={handleChange('link')}
                size="small"
                fullWidth
                placeholder="https://example.com"
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Caption (optional)
              </Typography>
              <TextField
                value={imageBoxEditorOptions.caption || ''}
                onChange={handleChange('caption')}
                size="small"
                fullWidth
                placeholder="Image description"
              />
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default ImageBoxWidgetEditor;