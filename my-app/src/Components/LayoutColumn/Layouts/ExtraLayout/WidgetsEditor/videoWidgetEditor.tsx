import React from 'react';
import { Box, Typography, TextField, Switch, FormControlLabel, Tooltip, IconButton, Stack, Divider, Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateVideoEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

const VideoWidgetEditor = () => {
  const dispatch = useDispatch();
  const { videoEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const handleChange = (field: keyof typeof videoEditorOptions) => (
    e: any
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    dispatch(updateVideoEditorOptions({ [field]: value }));
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
              Video
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Configure video settings.
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
            Video Source
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Video URL
              </Typography>
              <TextField
                value={videoEditorOptions.url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
                onChange={handleChange('url')}
                size="small"
                fullWidth
                placeholder="YouTube or Vimeo URL"
              />
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Dimensions
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Width
                </Typography>
                <Box display="flex">
                  <TextField
                    value={parseInt(videoEditorOptions.width) || 0}
                    onChange={(e) => {
                      const val = e.target.value;
                      const unit = videoEditorOptions.width.includes('%') ? '%' : 'px';
                      handleChange('width')({ target: { value: `${val}${unit}` } });
                    }}
                    type="number"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                      }
                    }}
                    fullWidth
                  />
                  <Select
                    value={videoEditorOptions.width.includes('%') ? '%' : 'px'}
                    onChange={(e) => {
                      const val = parseInt(videoEditorOptions.width) || 0;
                      const unit = e.target.value;
                      handleChange('width')({ target: { value: `${val}${unit}` } });
                    }}
                    size="small"
                    sx={{
                      width: '70px',
                      '& .MuiOutlinedInput-root': {
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        marginLeft: '-1px'
                      },
                      '& fieldset': {
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                      }
                    }}
                  >
                    <MenuItem value="px">px</MenuItem>
                    <MenuItem value="%">%</MenuItem>
                  </Select>
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Height
                </Typography>
                <Box display="flex">
                  <TextField
                    value={parseInt(videoEditorOptions.height) || 0}
                    onChange={(e) => {
                      const val = e.target.value;
                      const unit = videoEditorOptions.height.includes('%') ? '%' : 'px';
                      handleChange('height')({ target: { value: `${val}${unit}` } });
                    }}
                    type="number"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                      }
                    }}
                    fullWidth
                  />
                  <Select
                    value={videoEditorOptions.height.includes('%') ? '%' : 'px'}
                    onChange={(e) => {
                      const val = parseInt(videoEditorOptions.height) || 0;
                      const unit = e.target.value;
                      handleChange('height')({ target: { value: `${val}${unit}` } });
                    }}
                    size="small"
                    sx={{
                      width: '70px',
                      '& .MuiOutlinedInput-root': {
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        marginLeft: '-1px'
                      },
                      '& fieldset': {
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                      }
                    }}
                  >
                    <MenuItem value="px">px</MenuItem>
                    <MenuItem value="%">%</MenuItem>
                  </Select>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Playback
          </Typography>
          <Stack spacing={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={videoEditorOptions.autoplay || false}
                  onChange={handleChange('autoplay')}
                  color="primary"
                  size="small"
                />
              }
              label={<Typography variant="body2">Autoplay</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={videoEditorOptions.controls || true}
                  onChange={handleChange('controls')}
                  color="primary"
                  size="small"
                />
              }
              label={<Typography variant="body2">Show Controls</Typography>}
            />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default VideoWidgetEditor;