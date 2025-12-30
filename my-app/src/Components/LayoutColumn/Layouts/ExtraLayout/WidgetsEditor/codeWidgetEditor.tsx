import React, { useState } from 'react';
import { Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Tooltip, IconButton, Stack, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateCodeEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ColorPicker from "../../../../utils/ColorPicker";

const CodeWidgetEditor = () => {
  const dispatch = useDispatch();
  const { codeEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const handleChange = (field: keyof typeof codeEditorOptions) => (
    e: any
  ) => {
    dispatch(updateCodeEditorOptions({ [field]: e.target.value }));
  };

  const handleLanguageChange = (e: any) => {
    console.log('Language Change Event:', e);
    console.log('New Value:', e.target.value);
    dispatch(updateCodeEditorOptions({ language: e.target.value }));
  };

  const handleColorChange = (field: string, newColor: string) => {
    dispatch(updateCodeEditorOptions({ [field]: newColor }));
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

  const languageOptions = ['javascript', 'html', 'css', 'python', 'java', 'php', 'sql', 'json', 'xml'];

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
              Code
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Edit code snippet.
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
            Code
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Language
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={codeEditorOptions.language || 'javascript'}
                  onChange={handleLanguageChange}
                  MenuProps={{ disablePortal: true }}
                >
                  {languageOptions.map((lang) => (
                    <MenuItem key={lang} value={lang}>
                      {lang.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Content
              </Typography>
              <TextField
                multiline
                rows={6}
                value={codeEditorOptions.content || 'console.log("Hello World");'}
                onChange={handleChange('content')}
                size="small"
                fullWidth
                placeholder="Enter your code here"
                sx={{
                  fontFamily: 'monospace',
                  '& .MuiInputBase-input': { fontFamily: 'monospace' }
                }}
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
              label="Background Color"
              value={codeEditorOptions.backgroundColor || '#1e1e1e'}
              onChange={(color) => handleColorChange('backgroundColor', color)}
            />

            <ColorPicker
              label="Text Color"
              value={codeEditorOptions.textColor || '#d4d4d4'}
              onChange={(color) => handleColorChange('textColor', color)}
            />

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Font Size (px)
              </Typography>
              <TextField
                type="number"
                value={codeEditorOptions.fontSize || 14}
                onChange={handleChange('fontSize')}
                size="small"
                fullWidth
                InputProps={{ inputProps: { min: 8 } }}
              />
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default CodeWidgetEditor;