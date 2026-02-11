import React, { useState } from 'react';
import { Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Tooltip, IconButton, SelectChangeEvent, Stack, Divider, Popover, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateSectionEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ColorPicker from "../../../../utils/ColorPicker";

const SectionWidgetEditor = () => {
  const dispatch = useDispatch();
  const { sectionEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );



  if (!sectionEditorOptions) return null;

  // Handler for TextField inputs
  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;

    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const currentParent = (sectionEditorOptions as any)?.[parent];

      dispatch(updateSectionEditorOptions({
        [parent]: {
          ...(currentParent || {}),
          [child]: value,
        },
      } as any));
    } else {
      dispatch(updateSectionEditorOptions({ [field]: value } as any));
    }
  };

  const handleColorChange = (field: string, newColor: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const currentParent = (sectionEditorOptions as any)?.[parent];

      dispatch(updateSectionEditorOptions({
        [parent]: {
          ...(currentParent || {}),
          [child]: newColor,
        },
      } as any));
    } else {
      dispatch(updateSectionEditorOptions({ [field]: newColor } as any));
    }
  };


  // Handler for Select components
  const handleSelectChange = (field: string) => (
    e: SelectChangeEvent
  ) => {
    const value = e.target.value;

    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const currentParent = (sectionEditorOptions as any)?.[parent];

      dispatch(updateSectionEditorOptions({
        [parent]: {
          ...(currentParent || {}),
          [child]: value,
        },
      } as any));
    } else {
      dispatch(updateSectionEditorOptions({ [field]: value } as any));
    }
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
          <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#495157' }}>Section</Typography>
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
        <Typography sx={{ fontSize: '13px', color: '#6d7882', fontStyle: 'italic' }}>
          Customize section layout and style.
        </Typography>
      </Box>

      {/* Editor Sections */}
      <Box sx={{ height: 'calc(100% - 70px)', overflowY: 'auto' }}>
        {/* Style Section */}
        <Accordion defaultExpanded disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Style</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
            <Stack spacing={2.5}>
              <ColorPicker
                label="Background Color"
                value={sectionEditorOptions.backgroundColor === 'transparent' ? '#ffffff' : (sectionEditorOptions.backgroundColor || '#ffffff')}
                onChange={(color) => handleColorChange('backgroundColor', color)}
              />

              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 1 }}>Padding (px)</Typography>
                <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1}>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>TOP</Typography>
                    <TextField type="number" size="small" fullWidth value={sectionEditorOptions.padding?.top || 20} onChange={handleChange('padding.top')} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>RIGHT</Typography>
                    <TextField type="number" size="small" fullWidth value={sectionEditorOptions.padding?.right || 20} onChange={handleChange('padding.right')} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>BOTTOM</Typography>
                    <TextField type="number" size="small" fullWidth value={sectionEditorOptions.padding?.bottom || 20} onChange={handleChange('padding.bottom')} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>LEFT</Typography>
                    <TextField type="number" size="small" fullWidth value={sectionEditorOptions.padding?.left || 20} onChange={handleChange('padding.left')} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                </Box>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Border Section */}
        <Accordion defaultExpanded disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Border</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
            <Stack spacing={2.5}>
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Width (px)</Typography>
                  <TextField
                    type="number"
                    value={sectionEditorOptions.border?.width || 1}
                    onChange={handleChange('border.width')}
                    size="small"
                    fullWidth
                    InputProps={{ inputProps: { min: 0 }, sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                  />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Style</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={sectionEditorOptions.border?.style || 'solid'}
                      onChange={handleSelectChange('border.style')}
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

              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Radius (px)</Typography>
                  <TextField
                    type="number"
                    value={sectionEditorOptions.border?.radius || 0}
                    onChange={handleChange('border.radius')}
                    size="small"
                    fullWidth
                    InputProps={{ inputProps: { min: 0 }, sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                  />
                </Box>
                <ColorPicker
                  label="Color"
                  value={sectionEditorOptions.border?.color === 'transparent' ? '#ddd' : (sectionEditorOptions.border?.color || '#ddd')}
                  onChange={(color) => handleColorChange('border.color', color)}
                />
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default SectionWidgetEditor;