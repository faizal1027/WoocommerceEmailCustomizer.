import React, { useState } from 'react';
import { Box, Typography, TextField, Slider, Tooltip, IconButton, Stack, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateProgressEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ColorPicker from "../../../../utils/ColorPicker";

const ProgressWidgetEditor = () => {
  const dispatch = useDispatch();
  const { progressEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const handleChange = (field: keyof typeof progressEditorOptions) => (
    e: any
  ) => {
    const value = e.target.value;
    dispatch(updateProgressEditorOptions({ [field]: value }));
  };

  const handleSliderChange = (value: number) => {
    dispatch(updateProgressEditorOptions({ value: value }));
  };

  const handleColorChange = (newColor: string) => {
    dispatch(updateProgressEditorOptions({ color: newColor }));
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
              Progress
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Edit progress details.
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
                Label
              </Typography>
              <TextField
                value={progressEditorOptions.label || 'Progress'}
                onChange={handleChange('label')}
                size="small"
                fullWidth
              />
            </Box>

            <Box>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#666' }}>Value</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#666' }}>{progressEditorOptions.value || 75}%</Typography>
              </Box>
              <Slider
                value={progressEditorOptions.value || 75}
                onChange={(_, value) => handleSliderChange(value as number)}
                valueLabelDisplay="auto"
                min={Number(progressEditorOptions.min) || 0}
                max={Number(progressEditorOptions.max) || 100}
                size="small"
              />
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Range
          </Typography>
          <Stack spacing={2}>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Min Value
                </Typography>
                <TextField
                  type="number"
                  value={progressEditorOptions.min || 0}
                  onChange={handleChange('min')}
                  size="small"
                  fullWidth
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Max Value
                </Typography>
                <TextField
                  type="number"
                  value={progressEditorOptions.max || 100}
                  onChange={handleChange('max')}
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
            Appearance
          </Typography>
          <Stack spacing={2}>
            <ColorPicker
              label="Color"
              value={progressEditorOptions.color || '#007bff'}
              onChange={handleColorChange}
            />

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Show Value
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={progressEditorOptions.showValue ? 'true' : 'false'}
                  onChange={(e) => handleChange('showValue')({ target: { value: e.target.value === 'true' } })}
                >
                  <MenuItem value="true">Yes</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default ProgressWidgetEditor;