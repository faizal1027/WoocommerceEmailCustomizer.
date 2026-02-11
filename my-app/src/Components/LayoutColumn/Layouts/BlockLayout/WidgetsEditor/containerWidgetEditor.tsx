import React from 'react';
import { Box, Typography, TextField, Tooltip, IconButton, Stack, Divider, Select, MenuItem, FormControl, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
    <Box sx={{ bgcolor: '#f9f9f9', height: '100%' }}>
      {/* Editor Header */}
      <Box sx={{ p: '15px 20px', bgcolor: '#fff', borderBottom: '1px solid #e7e9eb' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#495157' }}>Container</Typography>
          <Box display="flex" gap={1}>
            <Tooltip title="Close">
              <IconButton onClick={handleCloseEditor} size="small" sx={{ p: 0.5 }}>
                <CloseIcon fontSize="small" sx={{ color: '#a4afb7', fontSize: '18px' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={handleDeleteContent} size="small" sx={{ p: 0.5 }}>
                <DeleteIcon fontSize="small" sx={{ color: '#a4afb7', fontSize: '18px' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Typography sx={{ fontSize: '11px', color: '#6d7882', fontStyle: 'italic' }}>
          Edit container style.
        </Typography>
      </Box>

      {/* Editor Sections */}
      <Box sx={{ height: 'calc(100% - 70px)', overflowY: 'auto' }}>
        {/* Layout Section */}
        <Accordion defaultExpanded disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Layout</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Width (%)</Typography>
                <TextField
                  value={parseInt(containerEditorOptions.maxWidth as string) || 100}
                  onChange={(e) => dispatch(updateContainerEditorOptions({ maxWidth: `${e.target.value}%` }))}
                  size="small"
                  fullWidth
                  type="number"
                  InputProps={{ inputProps: { min: 1, max: 100 }, sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 1 }}>Padding (px)</Typography>
                <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1}>
                  {['top', 'right', 'bottom', 'left'].map((side) => {
                    const sideVal = (typeof containerEditorOptions.padding === 'object'
                      ? (containerEditorOptions.padding as any)[side]
                      : containerEditorOptions.padding) || 0;
                    return (
                      <Box key={side}>
                        <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>{side.toUpperCase()}</Typography>
                        <TextField
                          type="number"
                          size="small"
                          fullWidth
                          value={sideVal}
                          onChange={(e) => {
                            const currentPadding = typeof containerEditorOptions.padding === 'object' ? containerEditorOptions.padding : {
                              top: containerEditorOptions.padding || 0,
                              right: containerEditorOptions.padding || 0,
                              bottom: containerEditorOptions.padding || 0,
                              left: containerEditorOptions.padding || 0
                            };
                            dispatch(updateContainerEditorOptions({ padding: { ...currentPadding, [side]: Number(e.target.value) } }));
                          }}
                          InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Style Section */}
        <Accordion defaultExpanded disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Style</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 1 }}>Background Color</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <input
                    type="color"
                    value={containerEditorOptions.backgroundColor === 'transparent' ? '#ffffff' : (containerEditorOptions.backgroundColor || '#ffffff')}
                    onChange={(e) => dispatch(updateContainerEditorOptions({ backgroundColor: e.target.value }))}
                    style={{
                      width: '100%',
                      height: '35px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      padding: '0 2px'
                    }}
                  />
                </Box>
              </Box>

              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 1.5 }}>Border</Typography>
                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={2}>
                  <Box>
                    <Typography sx={{ fontSize: '13px', color: '#666', mb: 0.5 }}>Width (px)</Typography>
                    <TextField
                      type="number"
                      value={containerEditorOptions.border?.width || 0}
                      onChange={handleBorderChange('width')}
                      size="small"
                      fullWidth
                      InputProps={{ sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '13px', color: '#666', mb: 0.5 }}>Color</Typography>
                    <input
                      type="color"
                      value={containerEditorOptions.border?.color === 'transparent' ? '#cccccc' : (containerEditorOptions.border?.color || '#cccccc')}
                      onChange={(e) => handleBorderChange('color')(e)}
                      style={{
                        width: '100%',
                        height: '35px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        padding: '0 2px'
                      }}
                    />
                  </Box>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '13px', color: '#666', mb: 0.5 }}>Style</Typography>
                  <FormControl size="small" fullWidth>
                    <Select
                      value={containerEditorOptions.border?.style || 'solid'}
                      onChange={handleBorderChange('style')}
                      sx={{ fontSize: '11px', bgcolor: '#f9f9f9' }}
                      MenuProps={{
                        disablePortal: true,
                        sx: { zIndex: 999999 }
                      }}
                    >
                      <MenuItem value="solid" sx={{ fontSize: '11px' }}>Solid</MenuItem>
                      <MenuItem value="dashed" sx={{ fontSize: '11px' }}>Dashed</MenuItem>
                      <MenuItem value="dotted" sx={{ fontSize: '11px' }}>Dotted</MenuItem>
                      <MenuItem value="none" sx={{ fontSize: '11px' }}>None</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default ContainerWidgetEditor;