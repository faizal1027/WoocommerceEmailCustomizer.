import React from 'react';
import { Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Tooltip, IconButton, Stack, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateFormEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

const FormWidgetEditor = () => {
  const dispatch = useDispatch();
  const { formEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const handleChange = (field: keyof typeof formEditorOptions) => (
    e: any
  ) => {
    dispatch(updateFormEditorOptions({ [field]: e.target.value }));
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
              Form
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Edit form settings.
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
                Form Title
              </Typography>
              <TextField
                value={formEditorOptions.title || 'Contact Us'}
                onChange={handleChange('title')}
                size="small"
                fullWidth
              />
            </Box>

            <Box display="grid" gridTemplateColumns="1fr 2fr" gap={2}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Method
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={formEditorOptions.method || 'POST'}
                    onChange={handleChange('method')}
                  >
                    <MenuItem value="GET">GET</MenuItem>
                    <MenuItem value="POST">POST</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Submit URL
                </Typography>
                <TextField
                  value={formEditorOptions.submitUrl || 'https://example.com/submit'}
                  onChange={handleChange('submitUrl')}
                  size="small"
                  fullWidth
                  placeholder="https://example.com/form-submit"
                />
              </Box>
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Button
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Submit Button Text
              </Typography>
              <TextField
                value={formEditorOptions.submitText || 'Submit'}
                onChange={handleChange('submitText')}
                size="small"
                fullWidth
              />
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Messages
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Success Message
              </Typography>
              <TextField
                value={formEditorOptions.successMessage || 'Thank you! Your form has been submitted.'}
                onChange={handleChange('successMessage')}
                size="small"
                fullWidth
                multiline
                rows={2}
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Error Message
              </Typography>
              <TextField
                value={formEditorOptions.errorMessage || 'There was an error submitting the form. Please try again.'}
                onChange={handleChange('errorMessage')}
                size="small"
                fullWidth
                multiline
                rows={2}
              />
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default FormWidgetEditor;