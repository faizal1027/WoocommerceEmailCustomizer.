import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, List, ListItem, ListItemText, Select, MenuItem, FormControl, InputLabel, Tooltip, Stack, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateGroupEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const GroupWidgetEditor = () => {
  const dispatch = useDispatch();
  const { groupEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const [newElement, setNewElement] = useState('');

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

  const handleAddElement = () => {
    if (newElement) {
      const updatedElements = [...(groupEditorOptions.elements || []), newElement];
      dispatch(updateGroupEditorOptions({ elements: updatedElements }));
      setNewElement('');
    }
  };

  const handleRemoveElement = (index: number) => {
    const updatedElements = [...(groupEditorOptions.elements || [])];
    updatedElements.splice(index, 1);
    dispatch(updateGroupEditorOptions({ elements: updatedElements }));
  };

  const handleChange = (field: string) => (
    e: any
  ) => {
    let value = e.target.value;
    if (field === 'spacing') {
      value = parseInt(value, 10) || 0;
    }
    dispatch(updateGroupEditorOptions({ [field]: value }));
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
              Group
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Manage grouped elements.
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
            Elements
          </Typography>
          <Stack spacing={2}>
            <Box display="flex" gap={2}>
              <TextField
                label="New Element"
                value={newElement}
                onChange={(e) => setNewElement(e.target.value)}
                size="small"
                fullWidth
              />
              <Button
                variant="outlined"
                onClick={handleAddElement}
                startIcon={<AddIcon />}
                disabled={!newElement}
                size="small"
              >
                Add
              </Button>
            </Box>

            <List sx={{ maxHeight: '150px', overflow: 'auto', border: '1px solid #eee', borderRadius: 1, p: 0 }}>
              {groupEditorOptions.elements?.map((element: string, index: number) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveElement(index)} size="small">
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                  }
                  sx={{ borderBottom: '1px solid #eee', py: 0.5 }}
                >
                  <ListItemText
                    primary={element}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
              {(!groupEditorOptions.elements || groupEditorOptions.elements.length === 0) && (
                <ListItem>
                  <ListItemText primary="No elements in group" primaryTypographyProps={{ variant: 'caption', color: 'textSecondary', align: 'center' }} />
                </ListItem>
              )}
            </List>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Layout
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Spacing (px)"
              type="number"
              value={groupEditorOptions.spacing || 0}
              onChange={handleChange('spacing')}
              size="small"
              fullWidth
            />

            <FormControl size="small" fullWidth>
              <InputLabel>Alignment</InputLabel>
              <Select
                value={groupEditorOptions.alignment || 'left'}
                label="Alignment"
                onChange={handleChange('alignment')}
              >
                <MenuItem value="left">Left</MenuItem>
                <MenuItem value="center">Center</MenuItem>
                <MenuItem value="right">Right</MenuItem>
                <MenuItem value="space-between">Space Between</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>Direction</InputLabel>
              <Select
                value={groupEditorOptions.direction || 'row'}
                label="Direction"
                onChange={handleChange('direction')}
              >
                <MenuItem value="row">Horizontal (Row)</MenuItem>
                <MenuItem value="column">Vertical (Column)</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default GroupWidgetEditor;