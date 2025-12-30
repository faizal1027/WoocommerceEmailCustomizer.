import React, { useState } from 'react';
import { Box, Typography, TextField, Slider, Tooltip, IconButton, Stack, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateProgressBarEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ColorPicker from "../../../../utils/ColorPicker";

const ProgressBarWidgetEditor = () => {
  const dispatch = useDispatch();
  const { progressBarEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const handleChange = (field: keyof typeof progressBarEditorOptions) => (
    e: any
  ) => {
    const value = e.target.value;
    dispatch(updateProgressBarEditorOptions({ [field]: value }));
  };

  const handleSliderChange = (value: number) => {
    dispatch(updateProgressBarEditorOptions({ progress: value }));
  };

  const handleColorChange = (field: string, newColor: string) => {
    dispatch(updateProgressBarEditorOptions({ [field]: newColor }));
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
              Progress Bar
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Edit progress bar settings.
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
            Settings
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Title
              </Typography>
              <TextField
                value={progressBarEditorOptions.title || 'Progress'}
                onChange={handleChange('title')}
                size="small"
                fullWidth
              />
            </Box>

            <Box>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#666' }}>Progress</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#666' }}>{progressBarEditorOptions.progress || 50}%</Typography>
              </Box>
              <Slider
                value={progressBarEditorOptions.progress || 50}
                onChange={(_, value) => handleSliderChange(value as number)}
                valueLabelDisplay="auto"
                min={0}
                max={100}
                size="small"
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Height (px)
              </Typography>
              <TextField
                type="number"
                value={progressBarEditorOptions.height || 20}
                onChange={handleChange('height')}
                size="small"
                fullWidth
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Colors
          </Typography>
          <Stack spacing={2}>
            <ColorPicker
              label="Bar Color"
              value={progressBarEditorOptions.barColor || '#007bff'}
              onChange={(color) => handleColorChange('barColor', color)}
            />

            <ColorPicker
              label="Background Color"
              value={progressBarEditorOptions.backgroundColor || '#e9ecef'}
              onChange={(color) => handleColorChange('backgroundColor', color)}
            />

          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default ProgressBarWidgetEditor;