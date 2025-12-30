import React from 'react';
import { Box, Typography, TextField, Tooltip, IconButton, Stack, Divider, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateLabelEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ColorPicker from "../../../../utils/ColorPicker";

const LabelWidgetEditor = () => {
  const dispatch = useDispatch();
  const { labelEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const handleChange = (field: keyof typeof labelEditorOptions) => (
    e: any
  ) => {
    dispatch(updateLabelEditorOptions({ [field]: e.target.value }));
  };

  const handleColorChange = (newColor: string) => {
    dispatch(updateLabelEditorOptions({ color: newColor }));
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
              Label
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Edit label properties.
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
                Label Text
              </Typography>
              <TextField
                value={labelEditorOptions.text || 'Label'}
                onChange={handleChange('text')}
                size="small"
                fullWidth
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                For (ID)
              </Typography>
              <TextField
                value={labelEditorOptions.for || ''}
                onChange={handleChange('for')}
                size="small"
                fullWidth
                helperText="ID of the input this label is for"
              />
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Style
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Type
              </Typography>
              <FormControl size="small" fullWidth>
                <Select
                  value={labelEditorOptions.type || 'normal'}
                  onChange={handleChange('type')}
                >
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="required">Required (*)</MenuItem>
                  <MenuItem value="optional">Optional</MenuItem>
                  <MenuItem value="error">Error Label</MenuItem>
                  <MenuItem value="warning">Warning Label</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Font Size
                </Typography>
                <TextField
                  type="number"
                  value={labelEditorOptions.fontSize || 14}
                  onChange={handleChange('fontSize')}
                  size="small"
                  fullWidth
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Font Weight
                </Typography>
                <FormControl size="small" fullWidth>
                  <Select
                    value={labelEditorOptions.fontWeight || 'normal'}
                    onChange={handleChange('fontWeight')}
                  >
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="bold">Bold</MenuItem>
                    <MenuItem value="500">Medium</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <ColorPicker
              label="Color"
              value={labelEditorOptions.color || '#000000'}
              onChange={handleColorChange}
            />

          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default LabelWidgetEditor;