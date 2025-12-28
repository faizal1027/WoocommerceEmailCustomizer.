import React, { useState } from 'react';
import { Box, Typography, TextField, Switch, FormControlLabel, Tooltip, IconButton, Button, Stack, Divider, List, ListItem, ListItemText } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateRadioEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const RadioWidgetEditor = () => {
  const dispatch = useDispatch();
  const { radioEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const [newOption, setNewOption] = useState('');

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

  const handleAddOption = () => {
    if (newOption) {
      const updatedOptions = [...(radioEditorOptions.options || []), newOption];
      dispatch(updateRadioEditorOptions({ options: updatedOptions }));
      setNewOption('');
    }
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = [...(radioEditorOptions.options || [])];
    updatedOptions.splice(index, 1);
    dispatch(updateRadioEditorOptions({ options: updatedOptions }));
  };

  const handleChange = (field: keyof typeof radioEditorOptions) => (
    e: any
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    dispatch(updateRadioEditorOptions({ [field]: value }));
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
              Radio Group
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Edit radio buttons.
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
                Group Label
              </Typography>
              <TextField
                value={radioEditorOptions.label || 'Radio Group'}
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
                value={radioEditorOptions.name || 'radio_group'}
                onChange={handleChange('name')}
                size="small"
                fullWidth
                placeholder="Used for form submission"
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
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Add Option
              </Typography>
              <Box display="flex" gap={2}>
                <TextField
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  size="small"
                  placeholder="Option 1"
                  fullWidth
                />
                <Button
                  variant="outlined"
                  onClick={handleAddOption}
                  startIcon={<AddIcon />}
                  disabled={!newOption}
                  size="small"
                >
                  Add
                </Button>
              </Box>
            </Box>

            <List sx={{ maxHeight: '150px', overflow: 'auto', border: '1px solid #eee', borderRadius: 1, p: 0 }}>
              {radioEditorOptions.options?.map((option: any, index: number) => (
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
                    primary={option}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
              {(!radioEditorOptions.options || radioEditorOptions.options.length === 0) && (
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
            Settings
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={radioEditorOptions.required || false}
                  onChange={handleChange('required')}
                  color="primary"
                  size="small"
                />
              }
              label={<Typography variant="body2">Required</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={radioEditorOptions.inline || false}
                  onChange={handleChange('inline')}
                  color="primary"
                  size="small"
                />
              }
              label={<Typography variant="body2">Inline Layout</Typography>}
            />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default RadioWidgetEditor;