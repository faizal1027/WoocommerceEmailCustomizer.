import React, { useState } from 'react';
import { Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Tooltip, IconButton, SelectChangeEvent, Stack, Divider, Popover } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateSectionEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { ChromePicker } from 'react-color';

const SectionWidgetEditor = () => {
  const dispatch = useDispatch();
  const { sectionEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const [bgAnchorEl, setBgAnchorEl] = useState<null | HTMLElement>(null);
  const [borderAnchorEl, setBorderAnchorEl] = useState<null | HTMLElement>(null);

  const openBgPicker = Boolean(bgAnchorEl);
  const openBorderPicker = Boolean(borderAnchorEl);

  const handleBgClick = (event: React.MouseEvent<HTMLElement>) => {
    setBgAnchorEl(event.currentTarget);
  };

  const handleBorderClick = (event: React.MouseEvent<HTMLElement>) => {
    setBorderAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setBgAnchorEl(null);
    setBorderAnchorEl(null);
  };

  if (!sectionEditorOptions) return null;

  // Handler for TextField inputs
  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;

    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const currentParent = (sectionEditorOptions as any)?.[parent];

      dispatch(updateSectionEditorOptions({
        [parent]: {
          ...(currentParent || {}),
          [child]: value,
        },
      } as any));
    } else {
      dispatch(updateSectionEditorOptions({ [field]: value } as any));
    }
  };

  const handleColorChange = (field: string, newColor: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const currentParent = (sectionEditorOptions as any)?.[parent];

      dispatch(updateSectionEditorOptions({
        [parent]: {
          ...(currentParent || {}),
          [child]: newColor.hex,
        },
      } as any));
    } else {
      dispatch(updateSectionEditorOptions({ [field]: newColor.hex } as any));
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

  // Handler for Select components
  const handleSelectChange = (field: string) => (
    e: SelectChangeEvent
  ) => {
    const value = e.target.value;

    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const currentParent = (sectionEditorOptions as any)?.[parent];

      dispatch(updateSectionEditorOptions({
        [parent]: {
          ...(currentParent || {}),
          [child]: value,
        },
      } as any));
    } else {
      dispatch(updateSectionEditorOptions({ [field]: value } as any));
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
              Section
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Customize section layout and style.
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
            Background
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Background Color
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
                  onClick={handleBgClick}
                >
                  <Box sx={colorSwatchStyle(sectionEditorOptions.backgroundColor || '#f5f5f5')} />
                  <Typography variant="caption" sx={{ ml: 1, color: '#666' }}>{sectionEditorOptions.backgroundColor || '#f5f5f5'}</Typography>
                </Box>
                <Popover
                  open={openBgPicker}
                  anchorEl={bgAnchorEl}
                  onClose={handleClose}
                  sx={{ zIndex: 99999 }}
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
                    color={sectionEditorOptions.backgroundColor || '#f5f5f5'}
                    onChange={(color) => handleColorChange('backgroundColor', color)}
                  />
                </Popover>
              </Box>
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Padding
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Top
              </Typography>
              <TextField
                type="number"
                value={sectionEditorOptions.padding?.top || 20}
                onChange={handleChange('padding.top')}
                size="small"
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Bottom
              </Typography>
              <TextField
                type="number"
                value={sectionEditorOptions.padding?.bottom || 20}
                onChange={handleChange('padding.bottom')}
                size="small"
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Left
              </Typography>
              <TextField
                type="number"
                value={sectionEditorOptions.padding?.left || 20}
                onChange={handleChange('padding.left')}
                size="small"
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Right
              </Typography>
              <TextField
                type="number"
                value={sectionEditorOptions.padding?.right || 20}
                onChange={handleChange('padding.right')}
                size="small"
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Box>
          </Box>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Border
          </Typography>
          <Stack spacing={2}>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Width
                </Typography>
                <TextField
                  type="number"
                  value={sectionEditorOptions.border?.width || 1}
                  onChange={handleChange('border.width')}
                  size="small"
                  fullWidth
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Style
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={sectionEditorOptions.border?.style || 'solid'}
                    onChange={handleSelectChange('border.style')}
                    MenuProps={{
                      disablePortal: false,
                      sx: { zIndex: 1300001 },
                      style: { zIndex: 1300001 }
                    }}
                  >
                    <MenuItem value="solid">Solid</MenuItem>
                    <MenuItem value="dashed">Dashed</MenuItem>
                    <MenuItem value="dotted">Dotted</MenuItem>
                    <MenuItem value="none">None</MenuItem>
                  </Select>
                </FormControl>
              </Box>
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
                    onClick={handleBorderClick}
                  >
                    <Box sx={colorSwatchStyle(sectionEditorOptions.border?.color || '#ddd')} />
                    <Typography variant="caption" sx={{ ml: 1, color: '#666' }}>{sectionEditorOptions.border?.color || '#ddd'}</Typography>
                  </Box>
                  <Popover
                    open={openBorderPicker}
                    anchorEl={borderAnchorEl}
                    onClose={handleClose}
                    sx={{ zIndex: 1300001 }}
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
                      color={sectionEditorOptions.border?.color || '#ddd'}
                      onChange={(color) => handleColorChange('border.color', color)}
                    />
                  </Popover>
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Radius
                </Typography>
                <TextField
                  type="number"
                  value={sectionEditorOptions.border?.radius || 0}
                  onChange={handleChange('border.radius')}
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

export default SectionWidgetEditor;