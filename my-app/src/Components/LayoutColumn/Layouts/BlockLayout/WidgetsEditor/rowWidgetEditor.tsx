import React from 'react';
import { Box, Typography, TextField, Tooltip, IconButton, Stack, Divider, Slider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateRowEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

const RowWidgetEditor = () => {
  const dispatch = useDispatch();
  const { rowEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const handleChange = (field: keyof typeof rowEditorOptions) => (
    e: any
  ) => {
    dispatch(updateRowEditorOptions({ [field]: e.target.value }));
  };

  const handleSliderChange = (field: keyof typeof rowEditorOptions) => (
    event: Event,
    newValue: number | number[]
  ) => {
    dispatch(updateRowEditorOptions({ [field]: newValue as number }));
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
              Row Layout
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Edit row layout settings.
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
            Layout
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Columns: {rowEditorOptions.columns}
              </Typography>
              <Slider
                value={rowEditorOptions.columns || 1}
                min={1}
                max={4}
                step={1}
                marks
                onChange={handleSliderChange('columns')}
                valueLabelDisplay="auto"
              />
            </Box>

            <Box>
              <Typography variant="caption" color="textSecondary">
                Gap: {rowEditorOptions.gap}px
              </Typography>
              <Slider
                value={rowEditorOptions.gap || 0}
                min={0}
                max={50}
                step={1}
                onChange={handleSliderChange('gap')}
                valueLabelDisplay="auto"
              />
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Style
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>Background Color</Typography>
              <TextField
                type="color"
                value={rowEditorOptions.backgroundColor === 'transparent' ? '#ffffff' : (rowEditorOptions.backgroundColor || '#ffffff')}
                onChange={handleChange('backgroundColor')}
                size="small"
                fullWidth
              />
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default RowWidgetEditor;