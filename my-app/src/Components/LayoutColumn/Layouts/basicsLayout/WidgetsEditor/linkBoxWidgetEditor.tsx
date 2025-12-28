import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, List, ListItem, ListItemText, Tooltip, Stack, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateLinkBoxEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ChromePicker } from 'react-color';

const LinkBoxWidgetEditor = () => {
  const dispatch = useDispatch();
  const { linkBoxEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const [showColorPicker, setShowColorPicker] = useState(false);

  const [newLink, setNewLink] = useState({ text: '', url: '' });

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

  const handleAddLink = () => {
    if (newLink.text && newLink.url) {
      const updatedLinks = [...(linkBoxEditorOptions.links || []), newLink];
      dispatch(updateLinkBoxEditorOptions({ links: updatedLinks }));
      setNewLink({ text: '', url: '' });
    }
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = [...(linkBoxEditorOptions.links || [])];
    updatedLinks.splice(index, 1);
    dispatch(updateLinkBoxEditorOptions({ links: updatedLinks }));
  };

  const handleChange = (field: string) => (
    e: any
  ) => {
    const value = e.target.value;
    dispatch(updateLinkBoxEditorOptions({ [field]: value }));
  };

  const handleColorChange = (newColor: any) => {
    dispatch(updateLinkBoxEditorOptions({ backgroundColor: newColor.hex }));
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
              Link Box
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Manage a collection of links.
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
            Manage Links
          </Typography>
          <Stack spacing={2}>
            {/* List of existing links */}
            <List sx={{ maxHeight: '200px', overflow: 'auto', border: '1px solid #ddd', borderRadius: 1, p: 0 }}>
              {linkBoxEditorOptions.links?.map((link, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveLink(index)} size="small">
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                  }
                  sx={{ borderBottom: '1px solid #eee', '&:last-child': { borderBottom: 'none' } }}
                >
                  <ListItemText
                    primary={<Typography variant="body2" fontWeight="bold">{link.text}</Typography>}
                    secondary={<Typography variant="caption" color="textSecondary">{link.url}</Typography>}
                  />
                </ListItem>
              ))}
              {(!linkBoxEditorOptions.links || linkBoxEditorOptions.links.length === 0) && (
                <ListItem>
                  <ListItemText primary={<Typography variant="body2" color="textSecondary" align="center">No links added</Typography>} />
                </ListItem>
              )}
            </List>

            {/* Add new link form */}
            <Box sx={{ p: 2, bgcolor: '#fafafa', borderRadius: 1, border: '1px dashed #ccc' }}>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 1, color: '#666', fontWeight: 'bold' }}>Add New Link</Typography>
              <Stack spacing={2} mt={1}>
                <Box>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                    Link Text
                  </Typography>
                  <TextField
                    value={newLink.text}
                    onChange={(e) => setNewLink({ ...newLink, text: e.target.value })}
                    size="small"
                    placeholder="e.g. Home"
                    fullWidth
                    sx={{ bgcolor: 'white' }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                    URL
                  </Typography>
                  <TextField
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    size="small"
                    placeholder="https://example.com"
                    fullWidth
                    sx={{ bgcolor: 'white' }}
                  />
                </Box>
                <Button
                  variant="outlined"
                  onClick={handleAddLink}
                  startIcon={<AddIcon />}
                  disabled={!newLink.text || !newLink.url}
                  fullWidth
                  size="small"
                >
                  Add to List
                </Button>
              </Stack>
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
                  onClick={() => setShowColorPicker(!showColorPicker)}
                >
                  <Box sx={colorSwatchStyle(linkBoxEditorOptions.backgroundColor || '#f9f9f9')} />
                  <Typography variant="caption" sx={{ ml: 1, color: '#666' }}>{linkBoxEditorOptions.backgroundColor || '#f9f9f9'}</Typography>
                </Box>
                {showColorPicker && (
                  <Box sx={{ position: "absolute", zIndex: 10, mt: 1, right: 0, backgroundColor: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", borderRadius: 1, overflow: 'hidden' }}>
                    <Box display="flex" justifyContent="flex-end" mb={0.5}>
                      <IconButton
                        size="small"
                        onClick={() => setShowColorPicker(false)}
                        sx={{ color: "white", backgroundColor: "rgba(0,0,0,0.5)", p: 0.5, '&:hover': { backgroundColor: "rgba(0,0,0,0.7)" } }}
                      >
                        <CloseIcon fontSize="small" sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                    <ChromePicker
                      color={linkBoxEditorOptions.backgroundColor || '#f9f9f9'}
                      onChange={handleColorChange}
                    />
                  </Box>
                )}
              </Box>
            </Box>

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Padding
                </Typography>
                <TextField
                  type="number"
                  value={linkBoxEditorOptions.padding || 10}
                  onChange={handleChange('padding')}
                  size="small"
                  fullWidth
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Border Radius
                </Typography>
                <TextField
                  type="number"
                  value={linkBoxEditorOptions.borderRadius || 5}
                  onChange={handleChange('borderRadius')}
                  size="small"
                  fullWidth
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Box>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default LinkBoxWidgetEditor;