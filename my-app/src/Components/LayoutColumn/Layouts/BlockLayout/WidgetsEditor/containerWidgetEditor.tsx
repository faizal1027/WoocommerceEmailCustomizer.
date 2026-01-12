import React from 'react';
import { Box, Typography, TextField, Tooltip, IconButton, Stack, Divider, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateContainerEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

const ContainerWidgetEditor = () => {
  const dispatch = useDispatch();
  const { containerEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const handleChange = (field: keyof typeof containerEditorOptions) => (
    e: any
  ) => {
    dispatch(updateContainerEditorOptions({ [field]: e.target.value }));
  };

  const handleBorderChange = (field: string) => (e: any) => {
    /*
    NOTE: The Redux slice expects a full border object update or specifically named properties depending on implementation.
    Assuming containerEditorOptions has a 'border' object property based on previous patterns.
    However, if it's nested like sectionEditorOptions, we might need to spread existing border options.
    Let's check the type definition.
    ContainerEditorOptions: { maxWidth, backgroundColor, padding, border: { width, style, color } }
    */
    const currentBorder = containerEditorOptions.border || { width: 1, style: 'solid', color: '#ccc' };
    dispatch(updateContainerEditorOptions({
      border: {
        ...currentBorder,
        [field]: field === 'width' ? parseInt(e.target.value) : e.target.value
      }
    }));
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
              Container
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Edit container style.
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
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>
                Width (%)
              </Typography>
              <TextField
                value={parseInt(containerEditorOptions.maxWidth as string) || 100}
                onChange={(e) => dispatch(updateContainerEditorOptions({ maxWidth: `${e.target.value}%` }))}
                size="small"
                fullWidth
                type="number"
                InputProps={{ inputProps: { min: 1, max: 100 } }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                Padding (px)
              </Typography>
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>Top</Typography>
                  <TextField
                    type="number"
                    value={(typeof containerEditorOptions.padding === 'object' ? containerEditorOptions.padding.top : containerEditorOptions.padding) || 0}
                    onChange={(e) => {
                      const currentPadding = typeof containerEditorOptions.padding === 'object' ? containerEditorOptions.padding : {
                        top: containerEditorOptions.padding || 0,
                        right: containerEditorOptions.padding || 0,
                        bottom: containerEditorOptions.padding || 0,
                        left: containerEditorOptions.padding || 0
                      };
                      dispatch(updateContainerEditorOptions({ padding: { ...currentPadding, top: Number(e.target.value) } }));
                    }}
                    size="small"
                    fullWidth
                  />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>Bottom</Typography>
                  <TextField
                    type="number"
                    value={(typeof containerEditorOptions.padding === 'object' ? containerEditorOptions.padding.bottom : containerEditorOptions.padding) || 0}
                    onChange={(e) => {
                      const currentPadding = typeof containerEditorOptions.padding === 'object' ? containerEditorOptions.padding : {
                        top: containerEditorOptions.padding || 0,
                        right: containerEditorOptions.padding || 0,
                        bottom: containerEditorOptions.padding || 0,
                        left: containerEditorOptions.padding || 0
                      };
                      dispatch(updateContainerEditorOptions({ padding: { ...currentPadding, bottom: Number(e.target.value) } }));
                    }}
                    size="small"
                    fullWidth
                  />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>Left</Typography>
                  <TextField
                    type="number"
                    value={(typeof containerEditorOptions.padding === 'object' ? containerEditorOptions.padding.left : containerEditorOptions.padding) || 0}
                    onChange={(e) => {
                      const currentPadding = typeof containerEditorOptions.padding === 'object' ? containerEditorOptions.padding : {
                        top: containerEditorOptions.padding || 0,
                        right: containerEditorOptions.padding || 0,
                        bottom: containerEditorOptions.padding || 0,
                        left: containerEditorOptions.padding || 0
                      };
                      dispatch(updateContainerEditorOptions({ padding: { ...currentPadding, left: Number(e.target.value) } }));
                    }}
                    size="small"
                    fullWidth
                  />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>Right</Typography>
                  <TextField
                    type="number"
                    value={(typeof containerEditorOptions.padding === 'object' ? containerEditorOptions.padding.right : containerEditorOptions.padding) || 0}
                    onChange={(e) => {
                      const currentPadding = typeof containerEditorOptions.padding === 'object' ? containerEditorOptions.padding : {
                        top: containerEditorOptions.padding || 0,
                        right: containerEditorOptions.padding || 0,
                        bottom: containerEditorOptions.padding || 0,
                        left: containerEditorOptions.padding || 0
                      };
                      dispatch(updateContainerEditorOptions({ padding: { ...currentPadding, right: Number(e.target.value) } }));
                    }}
                    size="small"
                    fullWidth
                  />
                </Box>
              </Box>
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
                value={containerEditorOptions.backgroundColor === 'transparent' ? '#ffffff' : (containerEditorOptions.backgroundColor || '#ffffff')}
                onChange={handleChange('backgroundColor')}
                size="small"
                fullWidth
              />
            </Box>

            <Box border={1} borderColor="#eee" borderRadius={1} p={2}>
              <Typography variant="caption" sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Border</Typography>
              <Stack spacing={2}>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                  <Box>
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>Width (px)</Typography>
                    <TextField
                      type="number"
                      value={containerEditorOptions.border?.width || 0}
                      onChange={handleBorderChange('width')}
                      size="small"
                      fullWidth
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>Color</Typography>
                    <TextField
                      type="color"
                      value={containerEditorOptions.border?.color === 'transparent' ? '#cccccc' : (containerEditorOptions.border?.color || '#cccccc')}
                      onChange={handleBorderChange('color')}
                      size="small"
                      fullWidth
                    />
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>Style</Typography>
                  <FormControl size="small" fullWidth>
                    <Select
                      value={containerEditorOptions.border?.style || 'solid'}
                      onChange={handleBorderChange('style')}
                      MenuProps={{
                        disablePortal: false,
                        anchorOrigin: {
                          vertical: 'bottom',
                          horizontal: 'left',
                        },
                        transformOrigin: {
                          vertical: 'top',
                          horizontal: 'left',
                        },
                        sx: { zIndex: 1300001 },
                        style: { zIndex: 1300001 }
                      }}
                    >
                      <MenuItem value="solid">Solid</MenuItem>
                      <MenuItem value="dashed">Dashed</MenuItem>
                      <MenuItem value="dotted">Dotted</MenuItem>
                      <MenuItem value="none">None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default ContainerWidgetEditor;