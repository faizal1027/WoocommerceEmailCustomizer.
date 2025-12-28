import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, List, ListItem, ListItemText, Tooltip, Stack, Divider, InputAdornment } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateNavbarEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ChromePicker } from 'react-color';

const NavbarWidgetEditor = () => {
  const dispatch = useDispatch();
  const { navbarEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const [newItem, setNewItem] = useState({ text: '', url: '#', icon: '' });
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);

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

  const handleAddItem = () => {
    if (newItem.text) {
      const updatedItems = [...(navbarEditorOptions.items || []), newItem];
      dispatch(updateNavbarEditorOptions({ items: updatedItems }));
      setNewItem({ text: '', url: '#', icon: '' });
    }
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...(navbarEditorOptions.items || [])];
    updatedItems.splice(index, 1);
    dispatch(updateNavbarEditorOptions({ items: updatedItems }));
  };

  const handleChange = (field: string) => (
    e: any
  ) => {
    dispatch(updateNavbarEditorOptions({ [field]: e.target.value }));
  };

  const handleColorChange = (field: string, newColor: any) => {
    dispatch(updateNavbarEditorOptions({ [field]: newColor.hex }));
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
              Navbar
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Edit navigation links.
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
            Menu Items
          </Typography>
          <Stack spacing={2}>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Text
                </Typography>
                <TextField
                  value={newItem.text}
                  onChange={(e) => setNewItem({ ...newItem, text: e.target.value })}
                  size="small"
                  placeholder="Home"
                  fullWidth
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  URL
                </Typography>
                <TextField
                  value={newItem.url}
                  onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                  size="small"
                  placeholder="#"
                  fullWidth
                />
              </Box>
            </Box>
            <Button
              variant="outlined"
              onClick={handleAddItem}
              startIcon={<AddIcon />}
              disabled={!newItem.text}
              size="small"
              fullWidth
            >
              Add Item
            </Button>

            <List sx={{ maxHeight: '150px', overflow: 'auto', border: '1px solid #eee', borderRadius: 1, p: 0 }}>
              {navbarEditorOptions.items?.map((item, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveItem(index)} size="small">
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                  }
                  sx={{ borderBottom: '1px solid #eee', py: 0.5 }}
                >
                  <ListItemText
                    primary={item.text}
                    secondary={item.url}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
              {(!navbarEditorOptions.items || navbarEditorOptions.items.length === 0) && (
                <ListItem>
                  <ListItemText primary="No items added" primaryTypographyProps={{ variant: 'caption', color: 'textSecondary', align: 'center' }} />
                </ListItem>
              )}
            </List>
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
                  <Box sx={colorSwatchStyle(navbarEditorOptions.backgroundColor || '#343a40')} />
                  <Typography variant="caption" sx={{ ml: 1, color: '#666' }}>{navbarEditorOptions.backgroundColor || '#343a40'}</Typography>
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
                      color={navbarEditorOptions.backgroundColor || '#343a40'}
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
                  <Box sx={colorSwatchStyle(navbarEditorOptions.textColor || '#ffffff')} />
                  <Typography variant="caption" sx={{ ml: 1, color: '#666' }}>{navbarEditorOptions.textColor || '#ffffff'}</Typography>
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
                      color={navbarEditorOptions.textColor || '#ffffff'}
                      onChange={(color) => handleColorChange('textColor', color)}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Stack>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
            Height (px)
          </Typography>
          <TextField
            type="number"
            value={navbarEditorOptions.height || 60}
            onChange={handleChange('height')}
            size="small"
            fullWidth
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default NavbarWidgetEditor;