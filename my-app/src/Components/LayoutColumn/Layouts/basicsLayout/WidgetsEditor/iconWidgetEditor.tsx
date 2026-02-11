import React, { useState } from 'react';
import { Box, Typography, TextField, Select, MenuItem, FormControl, InputLabel, Tooltip, IconButton, Stack, Divider, Popover, ToggleButtonGroup, ToggleButton, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateIconEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ColorPicker from "../../../../utils/ColorPicker";

const IconWidgetEditor = () => {
  const dispatch = useDispatch();
  const { iconEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const handleChange = (field: keyof typeof iconEditorOptions) => (
    e: any
  ) => {
    let value = e.target ? e.target.value : e;
    if (field === 'size') {
      value = Number(value);
    }
    dispatch(updateIconEditorOptions({ [field]: value }));
  };

  const handleColorChange = (newColor: string) => {
    dispatch(updateIconEditorOptions({ color: newColor }));
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

  const iconTypes = [
    'star', 'heart', 'check', 'info', 'warning', 'error',
    'facebook', 'twitter', 'instagram', 'linkedin', 'youtube',
    'home', 'mail', 'phone', 'location', 'calendar', 'user'
  ];

  return (
    <Box sx={{ bgcolor: '#f9f9f9', height: '100%' }}>
      {/* Editor Header */}
      <Box sx={{ p: '15px 20px', bgcolor: '#fff', borderBottom: '1px solid #e7e9eb' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#495157' }}>Icon</Typography>
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
          Customize icon content and style.
        </Typography>
      </Box>

      {/* Editor Sections */}
      <Box sx={{ height: 'calc(100% - 70px)', overflowY: 'auto' }}>
        {/* Content Section */}
        <Accordion defaultExpanded disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Icon</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Icon Type</Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={iconEditorOptions.iconType || 'star'}
                    onChange={handleChange('iconType')}
                    sx={{ fontSize: '11px', bgcolor: '#f9f9f9' }}
                    MenuProps={{
                      disablePortal: true,
                      sx: { zIndex: 999999 }
                    }}
                  >
                    {iconTypes.map((icon) => (
                      <MenuItem key={icon} value={icon} sx={{ fontSize: '11px' }}>
                        {icon.charAt(0).toUpperCase() + icon.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Link URL</Typography>
                <TextField
                  size="small"
                  fullWidth
                  value={iconEditorOptions.link || ''}
                  onChange={handleChange('link')}
                  placeholder="https://example.com"
                  InputProps={{ sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Alignment</Typography>
                <ToggleButtonGroup
                  exclusive
                  fullWidth
                  value={iconEditorOptions.alignment || 'left'}
                  onChange={(e, newAlign) => newAlign && handleChange('alignment')(newAlign)}
                  size="small"
                  sx={{ bgcolor: '#f9f9f9' }}
                >
                  <ToggleButton value="left" sx={{ p: '5px' }}><FormatAlignLeftIcon sx={{ fontSize: '18px' }} /></ToggleButton>
                  <ToggleButton value="center" sx={{ p: '5px' }}><FormatAlignCenterIcon sx={{ fontSize: '18px' }} /></ToggleButton>
                  <ToggleButton value="right" sx={{ p: '5px' }}><FormatAlignRightIcon sx={{ fontSize: '18px' }} /></ToggleButton>
                  <ToggleButton value="justify" sx={{ p: '5px' }}><FormatAlignJustifyIcon sx={{ fontSize: '18px' }} /></ToggleButton>
                </ToggleButtonGroup>
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
              <ColorPicker
                label="Icon Color"
                value={iconEditorOptions.color || '#000000'}
                onChange={handleColorChange}
              />

              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Icon Size (px)</Typography>
                <TextField
                  type="number"
                  size="small"
                  fullWidth
                  value={iconEditorOptions.size || 24}
                  onChange={handleChange('size')}
                  InputProps={{ sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                />
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Advanced Section */}
        <Accordion defaultExpanded disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Advanced</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 1 }}>Padding</Typography>
                <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1}>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>TOP</Typography>
                    <TextField type="number" size="small" fullWidth value={iconEditorOptions.paddingTop || 0} onChange={handleChange('paddingTop')} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>RIGHT</Typography>
                    <TextField type="number" size="small" fullWidth value={iconEditorOptions.paddingRight || 0} onChange={handleChange('paddingRight')} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>BOTTOM</Typography>
                    <TextField type="number" size="small" fullWidth value={iconEditorOptions.paddingBottom || 0} onChange={handleChange('paddingBottom')} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>LEFT</Typography>
                    <TextField type="number" size="small" fullWidth value={iconEditorOptions.paddingLeft || 0} onChange={handleChange('paddingLeft')} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                </Box>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default IconWidgetEditor;