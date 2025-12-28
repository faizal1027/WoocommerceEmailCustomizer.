import React, { useState } from 'react';
import { Box, Typography, TextField, Switch, FormControlLabel, Tooltip, IconButton, Button, Stack, Divider, List, ListItem, ListItemText } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateSelectEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { ChromePicker } from 'react-color';

const SelectWidgetEditor = () => {
  const dispatch = useDispatch();
  const { selectEditorOptions } = useSelector((state: RootState) => (state as any).workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const [newOption, setNewOption] = useState({ label: '', value: '' });
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

  const handleColorClick = (field: string) => (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl({ ...anchorEl, [field]: event.currentTarget });
  };

  const handleColorClose = (field: string) => () => {
    setAnchorEl({ ...anchorEl, [field]: null });
  };

  const handleColorChange = (field: string) => (newColor: any) => {
    dispatch(updateSelectEditorOptions({ [field]: newColor.hex }));
  };

  const handleAddOption = () => {
    if (newOption.label && newOption.value) {
      const currentOptions = selectEditorOptions.options || [];
      const updatedOptions = [...currentOptions, newOption];
      dispatch(updateSelectEditorOptions({ options: updatedOptions }));
      setNewOption({ label: '', value: '' });
    }
  };

  const handleRemoveOption = (index: number) => {
    const currentOptions = selectEditorOptions.options || [];
    const updatedOptions = currentOptions.filter((_: any, i: number) => i !== index);
    dispatch(updateSelectEditorOptions({ options: updatedOptions }));
  };

  const handleChange = (field: string) => (
    e: any
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    dispatch(updateSelectEditorOptions({ [field]: value }));
  };

  const colorSwatchStyle = (bgColor: string) => ({
    width: 30,
    height: 30,
    backgroundColor: bgColor,
    borderRadius: 1,
    border: "1px solid #ccc",
    cursor: "pointer",
  });

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
              Select Field
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Edit dropdown options.
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
            General
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Label
              </Typography>
              <TextField
                value={selectEditorOptions.label || 'Select Option'}
                onChange={handleChange('label')}
                size="small"
                fullWidth
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Field Name
              </Typography>
              <TextField
                value={selectEditorOptions.name || 'select_field'}
                onChange={handleChange('name')}
                size="small"
                fullWidth
                placeholder="Used for form submission"
                helperText="Unique identifier for this field"
              />
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Options
          </Typography>
          <Stack spacing={2}>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Option Label
                </Typography>
                <TextField
                  value={newOption.label}
                  onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
                  size="small"
                  placeholder="Option Label"
                  fullWidth
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Option Value
                </Typography>
                <TextField
                  value={newOption.value}
                  onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                  size="small"
                  placeholder="Option Value"
                  fullWidth
                />
              </Box>
            </Box>
            <Button
              variant="outlined"
              onClick={handleAddOption}
              startIcon={<AddIcon />}
              disabled={!newOption.label || !newOption.value}
              size="small"
              fullWidth
            >
              Add Option
            </Button>

            <List sx={{ maxHeight: '150px', overflow: 'auto', border: '1px solid #eee', borderRadius: 1, p: 0 }}>
              {selectEditorOptions.options?.map((option: any, index: number) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveOption(index)} size="small">
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                  }
                  sx={{ borderBottom: '1px solid #eee', py: 0.5 }}
                >
                  <ListItemText
                    primary={option.label}
                    secondary={option.value}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
              {(!selectEditorOptions.options || selectEditorOptions.options.length === 0) && (
                <ListItem>
                  <ListItemText primary="No options added" primaryTypographyProps={{ variant: 'caption', color: 'textSecondary', align: 'center' }} />
                </ListItem>
              )}
            </List>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Validation
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={selectEditorOptions.required || false}
                  onChange={handleChange('required')}
                  color="primary"
                  size="small"
                />
              }
              label={<Typography variant="body2">Required Field</Typography>}
            />
          </Stack>
        </Box>
        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Style
          </Typography>
          <Stack spacing={2}>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Font Color
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
                    onClick={handleColorClick('color')}
                  >
                    <Box sx={colorSwatchStyle(selectEditorOptions.color || '#000000')} />
                    <Typography variant="caption" sx={{ ml: 1, color: '#666' }}>{selectEditorOptions.color || '#000000'}</Typography>
                  </Box>
                  <Tooltip title="Close Picker" placement="top">
                    <Box
                      component="span"
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: anchorEl['color'] ? 'block' : 'none'
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={handleColorClose('color')}
                        sx={{ p: 0.5 }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Tooltip>
                  {anchorEl['color'] && (
                    <Box sx={{ position: "absolute", zIndex: 10, mt: 1, left: 0 }}>
                      <ChromePicker
                        color={selectEditorOptions.color || '#000000'}
                        onChange={handleColorChange('color')}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
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
                    onClick={handleColorClick('backgroundColor')}
                  >
                    <Box sx={colorSwatchStyle(selectEditorOptions.backgroundColor || '#ffffff')} />
                    <Typography variant="caption" sx={{ ml: 1, color: '#666' }}>{selectEditorOptions.backgroundColor || '#ffffff'}</Typography>
                  </Box>
                  {anchorEl['backgroundColor'] && (
                    <Box sx={{ position: "absolute", zIndex: 10, mt: 1, left: 0 }}>
                      <Box display="flex" justifyContent="flex-end" mb={0.5} sx={{ backgroundColor: 'white', border: '1px solid #ccc', borderBottom: 'none' }}>
                        <IconButton size="small" onClick={handleColorClose('backgroundColor')}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <ChromePicker
                        color={selectEditorOptions.backgroundColor || '#ffffff'}
                        onChange={handleColorChange('backgroundColor')}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Border Color
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
                    onClick={handleColorClick('borderColor')}
                  >
                    <Box sx={colorSwatchStyle(selectEditorOptions.borderColor || '#cccccc')} />
                    <Typography variant="caption" sx={{ ml: 1, color: '#666' }}>{selectEditorOptions.borderColor || '#cccccc'}</Typography>
                  </Box>
                  {anchorEl['borderColor'] && (
                    <Box sx={{ position: "absolute", zIndex: 10, mt: 1, left: 0 }}>
                      <Box display="flex" justifyContent="flex-end" mb={0.5} sx={{ backgroundColor: 'white', border: '1px solid #ccc', borderBottom: 'none' }}>
                        <IconButton size="small" onClick={handleColorClose('borderColor')}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <ChromePicker
                        color={selectEditorOptions.borderColor || '#cccccc'}
                        onChange={handleColorChange('borderColor')}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Border Radius
                </Typography>
                <TextField
                  type="number"
                  value={parseInt(selectEditorOptions.borderRadius?.toString() || '4')}
                  onChange={handleChange('borderRadius')}
                  size="small"
                  fullWidth
                />
              </Box>
            </Box>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Width
                </Typography>
                <TextField
                  type="text"
                  value={selectEditorOptions.width || '100%'}
                  onChange={handleChange('width')}
                  size="small"
                  fullWidth
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Height
                </Typography>
                <TextField
                  type="text"
                  value={selectEditorOptions.height || 'auto'}
                  onChange={handleChange('height')}
                  size="small"
                  fullWidth
                />
              </Box>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default SelectWidgetEditor;