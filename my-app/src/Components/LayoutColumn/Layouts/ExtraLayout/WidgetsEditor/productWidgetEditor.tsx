import { Box, Typography, TextField, Tooltip, IconButton, Stack, Divider, InputAdornment, Button, Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateProductEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';
import CropOriginalIcon from "@mui/icons-material/CropOriginal";

const ProductWidgetEditor = () => {
  const dispatch = useDispatch();
  const { productEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const handleChange = (field: keyof typeof productEditorOptions) => (
    e: any
  ) => {
    dispatch(updateProductEditorOptions({ [field]: e.target.value }));
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
        dispatch(updateProductEditorOptions({ imageUrl: imageUrl }));
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
              Product
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Edit product details.
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
                Product Name
              </Typography>
              <TextField
                value={productEditorOptions.name || 'Product Name'}
                onChange={handleChange('name')}
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
                value={productEditorOptions.description || 'Product description goes here'}
                onChange={handleChange('description')}
                size="small"
                fullWidth
              />
            </Box>
            <Box display="grid" gridTemplateColumns="2fr 1fr" gap={2}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Price
                </Typography>
                <TextField
                  type="number"
                  value={productEditorOptions.price || 99.99}
                  onChange={handleChange('price')}
                  size="small"
                  placeholder="99.99"
                  fullWidth
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Currency
                </Typography>
                <Select
                  value={productEditorOptions.currency || '$'}
                  onChange={handleChange('currency')}
                  size="small"
                  fullWidth
                  MenuProps={{ disablePortal: true }}
                >
                  {['$', '€', '£', '¥', '₹', 'Rp', 'R$', 'AED', 'sar', 'Fr'].map((symbol) => (
                    <MenuItem key={symbol} value={symbol}>
                      {symbol}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Image
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Image URL
              </Typography>
              <TextField
                value={productEditorOptions.imageUrl || 'https://cdn.tools.unlayer.com/image/placeholder.png'}
                onChange={handleChange('imageUrl')}
                size="small"
                fullWidth
                placeholder="https://example.com/product.jpg"
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
            Button
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Button Text
              </Typography>
              <TextField
                value={productEditorOptions.buttonText || 'Add to Cart'}
                onChange={handleChange('buttonText')}
                size="small"
                fullWidth
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Button Link
              </Typography>
              <TextField
                value={productEditorOptions.buttonLink || '#'}
                onChange={handleChange('buttonLink')}
                size="small"
                fullWidth
                placeholder="https://example.com/buy"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LinkIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Stack>
        </Box>
      </Stack >
    </Box >
  );
};

export default ProductWidgetEditor;