import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, Select, MenuItem, FormControl, InputLabel, Tooltip, Stack, Divider, OutlinedInput, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateGroupEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MenuIcon from '@mui/icons-material/Menu';
import { PLACEHOLDERS } from '../../../../utils/PlaceholderSelect';
import { Menu } from '@mui/material';

const GroupWidgetEditor = () => {
  const dispatch = useDispatch();
  const { groupEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );
  const [expandedIndex, setExpandedIndex] = useState<number | false>(false);
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
    setExpandedIndex(updatedElements.length - 1);
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
    if (expandedIndex === index) setExpandedIndex(false);
  };

  const handleDuplicateElement = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const elementToDuplicate = elements[index];
    const updatedElements = [...elements];
    updatedElements.splice(index + 1, 0, { ...elementToDuplicate });
    dispatch(updateGroupEditorOptions({ elements: updatedElements as any }));
    setExpandedIndex(index + 1);
  };

  const handleAccordionChange = (index: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedIndex(isExpanded ? index : false);
  };

  const handleChange = (field: string) => (
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
      // Append or replace? Usually append or insert at cursor. For simplicity, append.
      // But user might want it as the whole URL or part of it.
      // Let's just append for now, or if it's just '#', replace it.
      const newUrl = currentUrl === '#' ? placeholderValue : currentUrl + placeholderValue;
      handleUpdateElement(activeElementIndex, 'url', newUrl);
    }
    handleMenuClose();
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
              Group
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Manage grouped elements.
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
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              Elements
            </Typography>
          </Box>

          <Box>
            {elements.map((element: { text: string; url: string }, index: number) => (
              <Accordion
                key={index}
                expanded={expandedIndex === index}
                onChange={handleAccordionChange(index)}
                disableGutters
                sx={{
                  boxShadow: 'none',
                  border: '1px solid #e0e0e0',
                  '&:not(:last-child)': { borderBottom: 0 },
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ backgroundColor: '#f9f9f9', minHeight: 48 }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{element.text || `Item ${index + 1}`}</Typography>
                    <Box>
                      <Tooltip title="Duplicate">
                        <IconButton size="small" onClick={(e) => handleDuplicateElement(index, e)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove">
                        <IconButton size="small" onClick={(e) => handleRemoveElement(index, e)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 2 }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>Text</Typography>
                      <TextField
                        hiddenLabel
                        value={element.text}
                        onChange={(e) => handleUpdateElement(index, 'text', e.target.value)}
                        size="small"
                        fullWidth
                      />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>Link</Typography>
                      <Box display="flex" gap={1}>
                        <TextField
                          hiddenLabel
                          value={element.url}
                          onChange={(e) => handleUpdateElement(index, 'url', e.target.value)}
                          size="small"
                          fullWidth
                        />
                        <IconButton
                          size="small"
                          sx={{ border: '1px solid #ddd', borderRadius: 1, height: 40, width: 40 }}
                          onClick={(e) => handleMenuOpen(e, index)}
                        >
                          <MenuIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}

            <Button
              variant="contained"
              fullWidth
              onClick={handleAddElement}
              startIcon={<AddIcon />}
              sx={{ mt: 2, backgroundColor: '#f0f0f0', color: '#333', '&:hover': { backgroundColor: '#e0e0e0' }, boxShadow: 'none' }}
            >
              Add Item
            </Button>
          </Box>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Style
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>Direction</Typography>
              <Select
                value={groupEditorOptions.direction || 'row'}
                onChange={handleChange('direction')}
                size="small"
                fullWidth
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value="row" disableGutters>Horizontal (Row)</MenuItem>
                <MenuItem value="column" disableGutters>Vertical (Column)</MenuItem>
              </Select>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>Spacing (px)</Typography>
              <OutlinedInput
                type="number"
                value={groupEditorOptions.spacing || 0}
                onChange={handleChange('spacing')}
                size="small"
                fullWidth
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>Alignment</Typography>
              <Select
                value={groupEditorOptions.alignment || 'left'}
                onChange={handleChange('alignment')}
                size="small"
                fullWidth
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value="left" disableGutters>Left</MenuItem>
                <MenuItem value="center" disableGutters>Center</MenuItem>
                <MenuItem value="right" disableGutters>Right</MenuItem>
                <MenuItem value="space-between" disableGutters>Space Between</MenuItem>
              </Select>
            </Box>
          </Stack>
        </Box>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          style: {
            maxHeight: 300,
            width: anchorEl ? anchorEl.clientWidth : 240,
          },
        }}
        disablePortal
        sx={{ zIndex: 1300 }}
      >
        {PLACEHOLDERS.map((ph) => (
          <MenuItem key={ph.value} onClick={() => handlePlaceholderSelect(ph.value)}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {ph.value}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default GroupWidgetEditor;