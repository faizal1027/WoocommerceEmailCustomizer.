import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, List, ListItem, ListItemText, Tooltip, Select, MenuItem, FormControl, InputLabel, Stack, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateSocialFollowEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ChromePicker } from 'react-color';

const SocialFollowWidgetEditor = () => {
  const dispatch = useDispatch();
  const { socialFollowEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const [newPlatform, setNewPlatform] = useState({ name: '', url: '', icon: 'facebook' });
  const [showColorPicker, setShowColorPicker] = useState(false);

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

  const handleAddPlatform = () => {
    if (newPlatform.name && newPlatform.url) {
      const updatedPlatforms = [...(socialFollowEditorOptions.platforms || []), newPlatform];
      dispatch(updateSocialFollowEditorOptions({ platforms: updatedPlatforms }));
      setNewPlatform({ name: '', url: '', icon: 'facebook' });
    }
  };

  const handleRemovePlatform = (index: number) => {
    const updatedPlatforms = [...(socialFollowEditorOptions.platforms || [])];
    updatedPlatforms.splice(index, 1);
    dispatch(updateSocialFollowEditorOptions({ platforms: updatedPlatforms }));
  };

  const handleChange = (field: string) => (
    e: any
  ) => {
    let value = e.target.value;
    if (field === 'iconSize' || field === 'spacing') {
      value = Number(value);
    }
    dispatch(updateSocialFollowEditorOptions({ [field]: value }));
  };

  const handleColorChange = (newColor: any) => {
    dispatch(updateSocialFollowEditorOptions({ iconColor: newColor.hex }));
  };

  const colorSwatchStyle = (bgColor: string) => ({
    width: 30,
    height: 30,
    backgroundColor: bgColor,
    borderRadius: 1,
    border: "1px solid #ccc",
    cursor: "pointer",
  });

  const iconOptions = [
    'facebook', 'twitter', 'instagram', 'linkedin', 'youtube',
    'pinterest', 'tiktok', 'whatsapp', 'telegram', 'github'
  ];

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
              Social Follow
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Manage social links to follow.
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
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Manage Social Links
          </Typography>
          <Stack spacing={2}>
            {/* List of existing platforms */}
            <List sx={{ maxHeight: '200px', overflow: 'auto', border: '1px solid #ddd', borderRadius: 1, p: 0 }}>
              {socialFollowEditorOptions.platforms?.map((platform, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemovePlatform(index)} size="small">
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                  }
                  sx={{ borderBottom: '1px solid #eee', '&:last-child': { borderBottom: 'none' } }}
                >
                  <ListItemText
                    primary={<Typography variant="body2" fontWeight="bold">{platform.name}</Typography>}
                    secondary={<Typography variant="caption" color="textSecondary">{platform.url}</Typography>}
                  />
                </ListItem>
              ))}
              {(!socialFollowEditorOptions.platforms || socialFollowEditorOptions.platforms.length === 0) && (
                <ListItem>
                  <ListItemText primary={<Typography variant="body2" color="textSecondary" align="center">No platforms added</Typography>} />
                </ListItem>
              )}
            </List>

            {/* Add new platform form */}
            <Box sx={{ p: 2, bgcolor: '#fafafa', borderRadius: 1, border: '1px dashed #ccc' }}>
              <Typography variant="caption" fontWeight="bold" gutterBottom>Add New Platform</Typography>
              <Stack spacing={2} mt={1}>
                <Box>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                    Name
                  </Typography>
                  <TextField
                    value={newPlatform.name}
                    onChange={(e) => setNewPlatform({ ...newPlatform, name: e.target.value })}
                    size="small"
                    placeholder="e.g. Facebook"
                    fullWidth
                    sx={{ bgcolor: 'white' }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                    URL
                  </Typography>
                  <TextField
                    value={newPlatform.url}
                    onChange={(e) => setNewPlatform({ ...newPlatform, url: e.target.value })}
                    size="small"
                    placeholder="https://facebook.com/username"
                    fullWidth
                    sx={{ bgcolor: 'white' }}
                  />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                    Icon
                  </Typography>
                  <FormControl size="small" fullWidth sx={{ bgcolor: 'white' }}>
                    <Select
                      value={newPlatform.icon}
                      onChange={(e) => setNewPlatform({ ...newPlatform, icon: e.target.value })}
                      MenuProps={{
                        disablePortal: false,
                        sx: { zIndex: 1300001 },
                        style: { zIndex: 1300001 }
                      }}
                    >
                      {iconOptions.map((icon) => (
                        <MenuItem key={icon} value={icon}>
                          {icon}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Button
                  variant="outlined"
                  onClick={handleAddPlatform}
                  startIcon={<AddIcon />}
                  disabled={!newPlatform.name || !newPlatform.url}
                  fullWidth
                  size="small"
                >
                  Add Platform
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Appearance
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Icon Color
              </Typography>
              <Box position="relative">
                <Box
                  sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: 1, p: '4px 8px', height: '40px' }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                >
                  <Box sx={colorSwatchStyle(socialFollowEditorOptions.iconColor || '#000000')} />
                  <Typography variant="caption" sx={{ ml: 1, color: '#666' }}>{socialFollowEditorOptions.iconColor || '#000000'}</Typography>
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
                      color={socialFollowEditorOptions.iconColor || '#000000'}
                      onChange={handleColorChange}
                    />
                  </Box>
                )}
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Icon Size (px)
              </Typography>
              <TextField
                type="number"
                value={socialFollowEditorOptions.iconSize || 24}
                onChange={handleChange('iconSize')}
                size="small"
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Spacing (px)
              </Typography>
              <TextField
                type="number"
                value={socialFollowEditorOptions.spacing || 10}
                onChange={handleChange('spacing')}
                size="small"
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default SocialFollowWidgetEditor;