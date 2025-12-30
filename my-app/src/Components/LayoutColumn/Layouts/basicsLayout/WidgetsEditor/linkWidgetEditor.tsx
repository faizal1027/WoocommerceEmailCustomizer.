import React, { useState } from 'react';
import { Box, Typography, TextField, Switch, FormControlLabel, Tooltip, IconButton, Stack, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateLinkEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ColorPicker from "../../../../utils/ColorPicker";

const LinkWidgetEditor = () => {
  const dispatch = useDispatch();
  const { linkEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );


  const handleChange = (field: keyof typeof linkEditorOptions) => (
    e: any
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    dispatch(updateLinkEditorOptions({ [field]: value }));
  };

  const handleColorChange = (newColor: string) => {
    dispatch(updateLinkEditorOptions({ color: newColor }));
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
              Link
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Edit link properties.
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
            Content
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Link Text
              </Typography>
              <TextField
                value={linkEditorOptions.text || 'Click here'}
                onChange={handleChange('text')}
                size="small"
                fullWidth
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                URL
              </Typography>
              <TextField
                value={linkEditorOptions.url || '#'}
                onChange={handleChange('url')}
                size="small"
                fullWidth
                placeholder="https://example.com"
              />
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Appearance
          </Typography>
          <Stack spacing={2}>
            <ColorPicker
              label="Color"
              value={linkEditorOptions.color || '#007bff'}
              onChange={handleColorChange}
            />

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Font Size (px)
              </Typography>
              <TextField
                type="number"
                value={linkEditorOptions.fontSize || 14}
                onChange={handleChange('fontSize')}
                size="small"
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={linkEditorOptions.underline || false}
                  onChange={handleChange('underline')}
                  color="primary"
                  size="small"
                />
              }
              label={<Typography variant="body2">Underline Link</Typography>}
            />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default LinkWidgetEditor;