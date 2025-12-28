import React from 'react';
import { Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Tooltip, IconButton, Stack, Divider, Switch, FormControlLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateAlertEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import { PlaceholderSelect } from "../../../../utils/PlaceholderSelect";
import CloseIcon from "@mui/icons-material/Close";

const AlertWidgetEditor = () => {
  const dispatch = useDispatch();
  const { alertEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const handleChange = (field: keyof typeof alertEditorOptions) => (
    e: any
  ) => {
    dispatch(updateAlertEditorOptions({ [field]: e.target.value }));
  };

  const handleSwitchChange = (field: keyof typeof alertEditorOptions) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(updateAlertEditorOptions({ [field]: e.target.checked }));
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
              Alert
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Edit alert message.
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
                Type
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={alertEditorOptions.type || 'info'}
                  onChange={handleChange('type')}
                >
                  <MenuItem value="success">Success</MenuItem>
                  <MenuItem value="info">Info</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                  <MenuItem value="error">Error</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#666' }}>
                  Title
                </Typography>
                <PlaceholderSelect
                  onSelect={(ph) => handleChange('title')({ target: { value: (alertEditorOptions.title || '') + ph } })}
                  label="Variables"
                />
              </Box>
              <TextField
                value={alertEditorOptions.title || 'Alert Title'}
                onChange={handleChange('title')}
                size="small"
                fullWidth
              />
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#666' }}>
                  Message
                </Typography>
                <PlaceholderSelect
                  onSelect={(ph) => handleChange('message')({ target: { value: (alertEditorOptions.message || '') + ph } })}
                  label="Variables"
                />
              </Box>
              <TextField
                multiline
                rows={3}
                value={alertEditorOptions.message || 'This is an alert message.'}
                onChange={handleChange('message')}
                size="small"
                fullWidth
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Icon (optional)
              </Typography>
              <TextField
                value={alertEditorOptions.icon || ''}
                onChange={handleChange('icon')}
                size="small"
                fullWidth
                placeholder="emoji or icon name"
              />
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Settings
          </Typography>
          <Stack spacing={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={alertEditorOptions.dismissible || false}
                  onChange={handleSwitchChange('dismissible')}
                  color="primary"
                  size="small"
                />
              }
              label={<Typography variant="body2">Dismissible</Typography>}
            />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default AlertWidgetEditor;