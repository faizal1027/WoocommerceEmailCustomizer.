import React, { useState } from 'react';
import { Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Tooltip, IconButton, Stack, Divider, Popover } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateIconEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { ChromePicker } from 'react-color';

const IconWidgetEditor = () => {
  const dispatch = useDispatch();
  const { iconEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openColorPicker = Boolean(anchorEl);

  const handleColorClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleColorClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (field: keyof typeof iconEditorOptions) => (
    e: any
  ) => {
    let value = e.target ? e.target.value : e;
    if (field === 'size') {
      value = Number(value);
    }
    dispatch(updateIconEditorOptions({ [field]: value }));
  };

  const handleColorChange = (newColor: any) => {
    dispatch(updateIconEditorOptions({ color: newColor.hex }));
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

  const iconTypes = [
    'star', 'heart', 'check', 'info', 'warning', 'error',
    'facebook', 'twitter', 'instagram', 'linkedin', 'youtube',
    'home', 'mail', 'phone', 'location', 'calendar', 'user'
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
              Icon
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Customize icon and style.
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
            Icon Settings
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Type
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={iconEditorOptions.iconType || 'star'}
                  onChange={handleChange('iconType')}
                  MenuProps={{
                    disablePortal: true,
                    sx: { zIndex: 1300001 },
                    style: { zIndex: 1300001 }
                  }}
                >
                  {iconTypes.map((icon) => (
                    <MenuItem key={icon} value={icon}>
                      {icon}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Color
                </Typography>
                <Box position="relative">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid #ccc',
                      borderRadius: 1,
                      p: '4px 8px',
                      height: '40px'
                    }}
                    onClick={handleColorClick}
                  >
                    <Box sx={colorSwatchStyle(iconEditorOptions.color || '#000000')} />
                    <Typography variant="caption" sx={{ ml: 1, color: '#666' }}>{iconEditorOptions.color || '#000000'}</Typography>
                  </Box>
                  <Popover
                    open={openColorPicker}
                    anchorEl={anchorEl}
                    onClose={handleColorClose}
                    sx={{ zIndex: 1300001 }}
                    disablePortal={true}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <ChromePicker
                      color={iconEditorOptions.color || '#000000'}
                      onChange={handleColorChange}
                    />
                  </Popover>
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Size (px)
                </Typography>
                <TextField
                  type="number"
                  value={iconEditorOptions.size || 24}
                  onChange={handleChange('size')}
                  size="small"
                  fullWidth
                />
              </Box>
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Link
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                URL (optional)
              </Typography>
              <TextField
                value={iconEditorOptions.link || ''}
                onChange={handleChange('link')}
                size="small"
                fullWidth
                placeholder="https://example.com"
              />
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default IconWidgetEditor;