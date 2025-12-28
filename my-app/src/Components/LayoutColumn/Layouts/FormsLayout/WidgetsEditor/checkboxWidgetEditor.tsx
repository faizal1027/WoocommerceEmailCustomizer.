import React from 'react';
import { Box, Typography, TextField, Switch, FormControlLabel, Tooltip, IconButton, Stack, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateCheckboxEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

const CheckboxWidgetEditor = () => {
  const dispatch = useDispatch();
  const { checkboxEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const handleChange = (field: keyof typeof checkboxEditorOptions) => (
    e: any
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    dispatch(updateCheckboxEditorOptions({ [field]: value }));
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
              Checkbox
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Edit checkbox details.
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
                value={checkboxEditorOptions.label || 'I agree to terms'}
                onChange={handleChange('label')}
                size="small"
                fullWidth
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Value
              </Typography>
              <TextField
                value={checkboxEditorOptions.value || 'yes'}
                onChange={handleChange('value')}
                size="small"
                fullWidth
                helperText="Value sent on form submission"
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Field Name
              </Typography>
              <TextField
                value={checkboxEditorOptions.name || 'terms'}
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
            Settings
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={checkboxEditorOptions.checked || false}
                  onChange={handleChange('checked')}
                  color="primary"
                  size="small"
                />
              }
              label={<Typography variant="body2">Checked by Default</Typography>}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={checkboxEditorOptions.required || false}
                  onChange={handleChange('required')}
                  color="primary"
                  size="small"
                />
              }
              label={<Typography variant="body2">Required Field</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={checkboxEditorOptions.inline || false}
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

export default CheckboxWidgetEditor;