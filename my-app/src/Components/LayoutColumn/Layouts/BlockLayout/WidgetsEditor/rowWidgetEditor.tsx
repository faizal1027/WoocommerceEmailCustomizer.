import React from 'react';
import { Box, Typography, TextField, Tooltip, IconButton, Stack, Divider, Slider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../Store/store';
import { closeEditor, deleteColumnContent, updateRowEditorOptions } from '../../../../../Store/Slice/workspaceSlice';
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

const RowWidgetEditor = () => {
  const dispatch = useDispatch();
  const { rowEditorOptions } = useSelector((state: RootState) => state.workspace);
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const handleChange = (field: keyof typeof rowEditorOptions) => (
    e: any
  ) => {
    dispatch(updateRowEditorOptions({ [field]: e.target.value }));
  };

  const handleSliderChange = (field: keyof typeof rowEditorOptions) => (
    event: Event,
    newValue: number | number[]
  ) => {
    dispatch(updateRowEditorOptions({ [field]: newValue as number }));
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
          <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#495157' }}>Row Layout</Typography>
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
          Edit row layout settings.
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
            <Stack spacing={3}>
              <Box>
                <Typography sx={{ fontSize: '13px', color: '#666', mb: 1 }}>
                  Columns: {rowEditorOptions.columns}
                </Typography>
                <Slider
                  value={rowEditorOptions.columns || 1}
                  min={1}
                  max={4}
                  step={1}
                  marks
                  onChange={handleSliderChange('columns')}
                  sx={{
                    color: '#3498db',
                    height: 4,
                    '& .MuiSlider-thumb': {
                      width: 12,
                      height: 12,
                      backgroundColor: '#fff',
                      border: '2px solid currentColor',
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '13px', color: '#666', mb: 1 }}>
                  Gap: {rowEditorOptions.gap}px
                </Typography>
                <Slider
                  value={rowEditorOptions.gap || 0}
                  min={0}
                  max={50}
                  step={1}
                  onChange={handleSliderChange('gap')}
                  sx={{
                    color: '#3498db',
                    height: 4,
                    '& .MuiSlider-thumb': {
                      width: 12,
                      height: 12,
                      backgroundColor: '#fff',
                      border: '2px solid currentColor',
                    }
                  }}
                />
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
                    value={rowEditorOptions.backgroundColor === 'transparent' ? '#ffffff' : (rowEditorOptions.backgroundColor || '#ffffff')}
                    onChange={(e) => dispatch(updateRowEditorOptions({ backgroundColor: e.target.value }))}
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
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default RowWidgetEditor;
