import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, Select, MenuItem, FormControl, Tooltip, Stack, Divider, Accordion, AccordionSummary, AccordionDetails, Menu } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateGroupEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MenuIcon from '@mui/icons-material/Menu';
import { PLACEHOLDERS } from '../../../../utils/PlaceholderSelect';

const GroupWidgetEditor = () => {
  const dispatch = useDispatch();
  const { groupEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );
  const [expandedItemIndex, setExpandedItemIndex] = useState<number | false>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeElementIndex, setActiveElementIndex] = useState<number | null>(null);

  // Helper to safely get elements array, migrating string[] to object[] if needed
  const getElements = () => {
    const rawElements = groupEditorOptions.elements || [];
    return rawElements.map((el: any) => {
      if (typeof el === 'string') {
        return { text: el, url: '#' };
      }
      return el;
    });
  };

  const elements = getElements();

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

  const handleAddElement = () => {
    const newElement = { text: `Element ${elements.length + 1}`, url: '#' };
    const updatedElements = [...elements, newElement];
    dispatch(updateGroupEditorOptions({ elements: updatedElements as any }));
    setExpandedItemIndex(updatedElements.length - 1);
  };

  const handleUpdateElement = (index: number, key: 'text' | 'url', value: string) => {
    const updatedElements = [...elements];
    updatedElements[index] = { ...updatedElements[index], [key]: value };
    dispatch(updateGroupEditorOptions({ elements: updatedElements as any }));
  };

  const handleRemoveElement = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedElements = [...elements];
    updatedElements.splice(index, 1);
    dispatch(updateGroupEditorOptions({ elements: updatedElements as any }));
    if (expandedItemIndex === index) setExpandedItemIndex(false);
  };

  const handleDuplicateElement = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const elementToDuplicate = elements[index];
    const updatedElements = [...elements];
    updatedElements.splice(index + 1, 0, { ...elementToDuplicate });
    dispatch(updateGroupEditorOptions({ elements: updatedElements as any }));
    setExpandedItemIndex(index + 1);
  };

  const handleItemAccordionChange = (index: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedItemIndex(isExpanded ? index : false);
  };

  const handleGeneralChange = (field: string) => (
    e: any
  ) => {
    let value = e.target.value;
    if (field === 'spacing') {
      value = parseInt(value, 10) || 0;
    }
    dispatch(updateGroupEditorOptions({ [field]: value }));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setAnchorEl(event.currentTarget.parentElement);
    setActiveElementIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveElementIndex(null);
  };

  const handlePlaceholderSelect = (placeholderValue: string) => {
    if (activeElementIndex !== null) {
      const currentUrl = elements[activeElementIndex].url;
      const newUrl = currentUrl === '#' ? placeholderValue : currentUrl + placeholderValue;
      handleUpdateElement(activeElementIndex, 'url', newUrl);
    }
    handleMenuClose();
  };

  return (
    <Box sx={{ bgcolor: '#f9f9f9', height: '100%' }}>
      {/* Editor Header */}
      <Box sx={{ p: '15px 20px', bgcolor: '#fff', borderBottom: '1px solid #e7e9eb' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#495157' }}>Group</Typography>
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
          Manage grouped elements.
        </Typography>
      </Box>

      {/* Editor Sections */}
      <Box sx={{ height: 'calc(100% - 70px)', overflowY: 'auto' }}>
        {/* Elements Section */}
        <Accordion defaultExpanded disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Elements</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
            <Stack spacing={2}>
              <Box>
                {elements.map((element: { text: string; url: string }, index: number) => (
                  <Accordion
                    key={index}
                    expanded={expandedItemIndex === index}
                    onChange={handleItemAccordionChange(index)}
                    disableGutters
                    sx={{
                      boxShadow: 'none',
                      border: '1px solid #e0e0e0',
                      '&:not(:last-child)': { borderBottom: 0 },
                      '&:before': { display: 'none' },
                      bgcolor: expandedItemIndex === index ? '#fcfcfc' : '#fff'
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />}
                      sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' } }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" pr={1}>
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#495157' }}>{element.text || `Item ${index + 1}`}</Typography>
                        <Box display="flex" gap={0.5}>
                          <Tooltip title="Duplicate">
                            <IconButton size="small" onClick={(e) => handleDuplicateElement(index, e)}>
                              <ContentCopyIcon sx={{ fontSize: '14px', color: '#a4afb7' }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remove">
                            <IconButton size="small" onClick={(e) => handleRemoveElement(index, e)}>
                              <DeleteIcon sx={{ fontSize: '14px', color: '#a4afb7' }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 2, borderTop: '1px solid #f0f0f0' }}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography sx={{ fontSize: '11px', color: '#666', mb: 0.5 }}>Text</Typography>
                          <TextField
                            value={element.text}
                            onChange={(e) => handleUpdateElement(index, 'text', e.target.value)}
                            size="small"
                            fullWidth
                            InputProps={{ sx: { fontSize: '11px', bgcolor: '#fff' } }}
                          />
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: '11px', color: '#666', mb: 0.5 }}>Link</Typography>
                          <Box display="flex" gap={1}>
                            <TextField
                              value={element.url}
                              onChange={(e) => handleUpdateElement(index, 'url', e.target.value)}
                              size="small"
                              fullWidth
                              InputProps={{ sx: { fontSize: '11px', bgcolor: '#fff' } }}
                            />
                            <IconButton
                              size="small"
                              sx={{ border: '1px solid #ddd', borderRadius: 1, p: 0.5 }}
                              onClick={(e) => handleMenuOpen(e, index)}
                            >
                              <MenuIcon sx={{ fontSize: '18px', color: '#a4afb7' }} />
                            </IconButton>
                          </Box>
                        </Box>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                ))}

                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleAddElement}
                  startIcon={<AddIcon />}
                  sx={{ mt: 2, border: '1px dashed #ddd', color: '#3498db', textTransform: 'none', fontSize: '12px', fontWeight: 600, '&:hover': { border: '1px dashed #3498db', bgcolor: 'rgba(52, 152, 219, 0.05)' } }}
                >
                  Add Item
                </Button>
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
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.8 }}>Direction</Typography>
                <Select
                  value={groupEditorOptions.direction || 'row'}
                  onChange={handleGeneralChange('direction')}
                  size="small"
                  fullWidth
                  sx={{ fontSize: '11px', bgcolor: '#f9f9f9' }}
                  MenuProps={{ disablePortal: true }}
                >
                  <MenuItem value="row" sx={{ fontSize: '11px' }}>Horizontal (Row)</MenuItem>
                  <MenuItem value="column" sx={{ fontSize: '11px' }}>Vertical (Column)</MenuItem>
                </Select>
              </Box>

              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.8 }}>Spacing (px)</Typography>
                <TextField
                  type="number"
                  value={groupEditorOptions.spacing || 0}
                  onChange={handleGeneralChange('spacing')}
                  size="small"
                  fullWidth
                  InputProps={{ sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.8 }}>Alignment</Typography>
                <Select
                  value={groupEditorOptions.alignment || 'left'}
                  onChange={handleGeneralChange('alignment')}
                  size="small"
                  fullWidth
                  sx={{ fontSize: '11px', bgcolor: '#f9f9f9' }}
                  MenuProps={{ disablePortal: true }}
                >
                  <MenuItem value="left" sx={{ fontSize: '11px' }}>Left</MenuItem>
                  <MenuItem value="center" sx={{ fontSize: '11px' }}>Center</MenuItem>
                  <MenuItem value="right" sx={{ fontSize: '11px' }}>Right</MenuItem>
                  <MenuItem value="space-between" sx={{ fontSize: '11px' }}>Space Between</MenuItem>
                </Select>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          style: { maxHeight: 250, width: 200 },
          sx: { zIndex: 999999 }
        }}
        disablePortal
      >
        {PLACEHOLDERS.map((ph) => (
          <MenuItem key={ph.value} onClick={() => handlePlaceholderSelect(ph.value)} sx={{ fontSize: '12px', fontFamily: 'monospace' }}>
            {ph.value}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default GroupWidgetEditor;