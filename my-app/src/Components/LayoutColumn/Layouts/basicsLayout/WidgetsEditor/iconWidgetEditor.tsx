import React, { useState } from 'react';
import { Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Tooltip, IconButton, Stack, Divider, Popover, ToggleButtonGroup, ToggleButton } from '@mui/material';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateIconEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ColorPicker from "../../../../utils/ColorPicker";

const IconWidgetEditor = () => {
  const dispatch = useDispatch();
  const { iconEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const handleChange = (field: keyof typeof iconEditorOptions) => (
    e: any
  ) => {
    let value = e.target ? e.target.value : e;
    if (field === 'size') {
      value = Number(value);
    }
    dispatch(updateIconEditorOptions({ [field]: value }));
  };

  const handleColorChange = (newColor: string) => {
    dispatch(updateIconEditorOptions({ color: newColor }));
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
                <ColorPicker
                  label=""
                  value={iconEditorOptions.color || '#000000'}
                  onChange={handleColorChange}
                />
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
            Layout
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Alignment
              </Typography>
              <ToggleButtonGroup
                value={iconEditorOptions.alignment || 'left'}
                exclusive
                onChange={(e, newAlignment) => {
                  if (newAlignment !== null) {
                    handleChange('alignment')(newAlignment);
                  }
                }}
                size="small"
                fullWidth
              >
                <ToggleButton value="left">
                  <FormatAlignLeftIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="center">
                  <FormatAlignCenterIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="right">
                  <FormatAlignRightIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="justify">
                  <FormatAlignJustifyIcon fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 1, color: '#666' }}>
                Padding (px)
              </Typography>
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <Box>
                  <Typography variant="caption" sx={{ fontSize: '0.65rem', display: 'block', mb: 0.5, color: '#888' }}>
                    Top
                  </Typography>
                  <TextField
                    type="number"
                    value={iconEditorOptions.paddingTop || 0}
                    onChange={handleChange('paddingTop')}
                    size="small"
                    fullWidth
                  />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontSize: '0.65rem', display: 'block', mb: 0.5, color: '#888' }}>
                    Right
                  </Typography>
                  <TextField
                    type="number"
                    value={iconEditorOptions.paddingRight || 0}
                    onChange={handleChange('paddingRight')}
                    size="small"
                    fullWidth
                  />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontSize: '0.65rem', display: 'block', mb: 0.5, color: '#888' }}>
                    Bottom
                  </Typography>
                  <TextField
                    type="number"
                    value={iconEditorOptions.paddingBottom || 0}
                    onChange={handleChange('paddingBottom')}
                    size="small"
                    fullWidth
                  />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontSize: '0.65rem', display: 'block', mb: 0.5, color: '#888' }}>
                    Left
                  </Typography>
                  <TextField
                    type="number"
                    value={iconEditorOptions.paddingLeft || 0}
                    onChange={handleChange('paddingLeft')}
                    size="small"
                    fullWidth
                  />
                </Box>
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