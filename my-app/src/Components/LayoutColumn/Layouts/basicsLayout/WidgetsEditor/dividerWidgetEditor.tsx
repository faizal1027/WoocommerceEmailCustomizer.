import {
  Box, Typography, Slider, TextField, MenuItem,
  ToggleButton, ToggleButtonGroup,
  IconButton, Tooltip,
  Stack,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../Store/store";
import CloseIcon from "@mui/icons-material/Close";
import { updateDividerEditorOptions, deleteColumnContent, closeEditor } from "../../../../../Store/Slice/workspaceSlice";
import { useState } from "react";
import ColorPicker from "../../../../utils/ColorPicker";
import { DividerEditorOptions } from "../../../../../Store/Slice/workspaceSlice";

const DividerWidgetEditor = () => {
  const dispatch = useDispatch();
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex, dividerEditorOptions: dividerOptions } = useSelector(
    (state: RootState) => state.workspace
  );


  const handleOptionChange = (field: keyof DividerEditorOptions, value: any) => {
    dispatch(updateDividerEditorOptions({ [field]: value }));
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

  const handleCloseEditor = () => {
    dispatch(closeEditor());
  };

  const handlePaddingChange = (side: keyof DividerEditorOptions["padding"], value: number) => {
    const newPadding = { ...dividerOptions.padding, [side]: Math.max(0, value) };
    dispatch(updateDividerEditorOptions({ padding: newPadding }));
  };



  return (
    <Box sx={{ bgcolor: '#f9f9f9', height: '100%' }}>
      {/* Editor Header */}
      <Box sx={{ p: '15px 20px', bgcolor: '#fff', borderBottom: '1px solid #e7e9eb' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#495157' }}>Divider</Typography>
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
          Customize divider line.
        </Typography>
      </Box>

      {/* Editor Sections */}
      <Box sx={{ height: 'calc(100% - 70px)', overflowY: 'auto' }}>
        {/* Style Section */}
        <Accordion defaultExpanded disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Divider</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Width (%)</Typography>
                <Slider
                  value={parseInt(dividerOptions.width)}
                  onChange={(_, value) => handleOptionChange("width", `${value || 1}`)}
                  min={1}
                  max={100}
                  step={1}
                  size="small"
                  sx={{ color: '#93003c' }}
                />
              </Box>

              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Style</Typography>
                  <TextField
                    select
                    value={dividerOptions.style}
                    onChange={(e) => handleOptionChange("style", e.target.value)}
                    fullWidth
                    size="small"
                    InputProps={{ sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                    SelectProps={{
                      MenuProps: {
                        disablePortal: true,
                        sx: { zIndex: 999999 }
                      }
                    }}
                  >
                    <MenuItem value="solid" sx={{ fontSize: '11px' }}>Solid</MenuItem>
                    <MenuItem value="dashed" sx={{ fontSize: '11px' }}>Dashed</MenuItem>
                    <MenuItem value="dotted" sx={{ fontSize: '11px' }}>Dotted</MenuItem>
                  </TextField>
                </Box>

                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Weight (px)</Typography>
                  <TextField
                    type="number"
                    value={dividerOptions.thickness}
                    onChange={(e) => handleOptionChange("thickness", parseInt(e.target.value) || 1)}
                    inputProps={{ min: 1 }}
                    fullWidth
                    size="small"
                    InputProps={{ sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                  />
                </Box>
              </Box>

              <ColorPicker
                label="Color"
                value={dividerOptions.color}
                onChange={(color) => handleOptionChange("color", color)}
              />

              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Alignment</Typography>
                <ToggleButtonGroup
                  value={dividerOptions.alignment}
                  exclusive
                  onChange={(_, newAlign) => newAlign && handleOptionChange("alignment", newAlign)}
                  fullWidth
                  size="small"
                  sx={{ bgcolor: '#f9f9f9' }}
                >
                  <ToggleButton value="left" sx={{ p: '5px' }}><FormatAlignLeftIcon sx={{ fontSize: '18px' }} /></ToggleButton>
                  <ToggleButton value="center" sx={{ p: '5px' }}><FormatAlignCenterIcon sx={{ fontSize: '18px' }} /></ToggleButton>
                  <ToggleButton value="right" sx={{ p: '5px' }}><FormatAlignRightIcon sx={{ fontSize: '18px' }} /></ToggleButton>
                </ToggleButtonGroup>
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
                    <TextField type="number" size="small" fullWidth value={dividerOptions.padding.top} onChange={(e) => handlePaddingChange("top", Number(e.target.value))} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>RIGHT</Typography>
                    <TextField type="number" size="small" fullWidth value={dividerOptions.padding.right} onChange={(e) => handlePaddingChange("right", Number(e.target.value))} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>BOTTOM</Typography>
                    <TextField type="number" size="small" fullWidth value={dividerOptions.padding.bottom} onChange={(e) => handlePaddingChange("bottom", Number(e.target.value))} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>LEFT</Typography>
                    <TextField type="number" size="small" fullWidth value={dividerOptions.padding.left} onChange={(e) => handlePaddingChange("left", Number(e.target.value))} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
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

export default DividerWidgetEditor;