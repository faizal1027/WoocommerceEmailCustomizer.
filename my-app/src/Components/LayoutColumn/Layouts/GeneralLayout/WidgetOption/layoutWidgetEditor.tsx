import React from 'react';
import {
  Box, Typography, TextField,
  Select, MenuItem, FormControl,
  ToggleButton, ToggleButtonGroup,
  Tooltip, IconButton, Stack, Divider, Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import {
  closeEditor, setSelectedBlockId, updateSelectedColumnIndex,
  updateColumnBgColor, updateColumnPadding,
  updateColumnBorderStyle, updateColumnBorderTopSize,
  updateColumnBorderBottomSize, updateColumnBorderLeftSize,
  updateColumnBorderRightSize, updateColumnBorderTopColor,
  updateColumnBorderBottomColor, updateColumnBorderLeftColor,
  updateColumnBorderRightColor, updateColumnTextAlign,
  deleteColumnContent
} from "../../../../../Store/Slice/workspaceSlice";
import { RootState } from "../../../../../Store/store";
import ColorPicker from "../../../../utils/ColorPicker";

const LayoutEditorWidget = () => {
  const dispatch = useDispatch();

  const selectedBlockForEditor = useSelector(
    (state: RootState) => state.workspace.selectedBlockForEditor
  );
  const selectedColumnIndex = useSelector(
    (state: RootState) => state.workspace.selectedColumnIndex
  );
  const selectedWidgetIndex = useSelector(
    (state: RootState) => state.workspace.selectedWidgetIndex
  );
  const selectedBlock = useSelector(
    (state: RootState) =>
      state.workspace.blocks.find(
        (block) => block.id === state.workspace.selectedBlockForEditor
      )
  );

  const isColumnSelected = selectedColumnIndex !== null && selectedBlock?.columns[selectedColumnIndex];
  const selectedStyle = isColumnSelected
    ? selectedBlock?.columns[selectedColumnIndex]?.style
    : selectedBlock?.style;

  const currentBgColor = isColumnSelected ? selectedStyle?.bgColor || "#ffffff" : undefined;
  const currentBorderStyle = isColumnSelected ? selectedStyle?.borderStyle || "solid" : undefined;
  const currentBorderTopSize = isColumnSelected ? selectedStyle?.borderTopSize || 0 : undefined;
  const currentBorderBottomSize = isColumnSelected ? selectedStyle?.borderBottomSize || 0 : undefined;
  const currentBorderLeftSize = isColumnSelected ? selectedStyle?.borderLeftSize || 0 : undefined;
  const currentBorderRightSize = isColumnSelected ? selectedStyle?.borderRightSize || 0 : undefined;
  const currentBorderTopColor = isColumnSelected ? selectedStyle?.borderTopColor || "#000000" : undefined;
  const currentBorderBottomColor = isColumnSelected ? selectedStyle?.borderBottomColor || "#000000" : undefined;
  const currentBorderLeftColor = isColumnSelected ? selectedStyle?.borderLeftColor || "#000000" : undefined;
  const currentBorderRightColor = isColumnSelected ? selectedStyle?.borderRightColor || "#000000" : undefined;

  const getPaddingObject = (padding: any) => {
    if (!padding) return { top: 0, right: 0, bottom: 0, left: 0 };
    if (typeof padding === 'object') return {
      top: Number(padding.top) || 0,
      right: Number(padding.right) || 0,
      bottom: Number(padding.bottom) || 0,
      left: Number(padding.left) || 0
    };
    const parts = String(padding).replace(/px/g, '').split(' ').map(Number);
    if (parts.length === 1) return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
    if (parts.length >= 4) return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
    return { top: 0, right: 0, bottom: 0, left: 0 };
  };

  const currentPadding = isColumnSelected ? getPaddingObject(selectedStyle?.padding) : undefined;
  const currentTextAlign = isColumnSelected ? (selectedStyle as any)?.textAlign || 'left' : undefined;

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      fontSize: '11px',
      bgcolor: '#f9f9f9',
      "& fieldset": { borderColor: "#e7e9eb" },
      "&:hover fieldset": { borderColor: "#d5dadf" },
      "&.Mui-focused fieldset": { borderColor: "#3498db" },
    },
    "& .MuiInputBase-input": { padding: "8px 12px" },
  };

  const isEditorEnabled = !!selectedBlockForEditor;
  const numberOfColumns = selectedBlock?.columns.length || 0;

  const handleColumnSelectChange = (event: { target: { value: unknown } }) => {
    dispatch(updateSelectedColumnIndex(Number(event.target.value)));
  };

  const dispatchStyleUpdate = (blockAction: any, columnAction: any, payload: any) => {
    const finalColumnPayload = { ...payload, columnIndex: selectedColumnIndex, blockId: selectedBlockForEditor };
    const finalBlockPayload = { ...payload, blockId: selectedBlockForEditor };

    if (isColumnSelected && selectedColumnIndex !== null) {
      dispatch(columnAction(finalColumnPayload));
    } else {
      dispatch(blockAction(finalBlockPayload));
    }
  };

  const handleCloseEditor = () => {
    dispatch(closeEditor());
    dispatch(setSelectedBlockId(null));
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
          <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#495157' }}>
            {isColumnSelected ? `Column ${selectedColumnIndex + 1}` : "Block Layout"}
          </Typography>
          <Box display="flex" gap={1}>
            <Tooltip title="Close">
              <IconButton onClick={handleCloseEditor} size="small" sx={{ p: 0.5 }}>
                <CloseIcon fontSize="small" sx={{ color: '#a4afb7', fontSize: '18px' }} />
              </IconButton>
            </Tooltip>
            {isEditorEnabled && (
              <Tooltip title="Delete">
                <IconButton onClick={handleDeleteContent} size="small" sx={{ p: 0.5 }}>
                  <DeleteIcon fontSize="small" sx={{ color: '#a4afb7', fontSize: '18px' }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
        <Typography sx={{ fontSize: '13px', color: '#6d7882', fontStyle: 'italic' }}>
          {isColumnSelected ? "Customize column style." : "Customize block layout and style."}
        </Typography>
      </Box>

      {!isEditorEnabled ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Select a block to edit its properties.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ height: 'calc(100% - 70px)', overflowY: 'auto' }}>
          {/* Layout Section */}
          <Accordion defaultExpanded disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Layout</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
              <Stack spacing={2.5}>
                {numberOfColumns > 0 && (
                  <Box>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.8 }}>Choose Column</Typography>
                    <FormControl variant="outlined" size="small" fullWidth>
                      <Select
                        value={selectedColumnIndex !== null ? selectedColumnIndex : ""}
                        onChange={handleColumnSelectChange}
                        sx={{ fontSize: '11px', bgcolor: '#f9f9f9' }}
                        MenuProps={{ disablePortal: true, sx: { zIndex: 999999 } }}
                      >
                        {Array.from({ length: numberOfColumns }, (_, i) => (
                          <MenuItem key={i} value={i} sx={{ fontSize: '11px' }}>
                            Column {i + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}

                {isColumnSelected && (
                  <Box>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 1 }}>Content Alignment</Typography>
                    <ToggleButtonGroup
                      value={currentTextAlign}
                      exclusive
                      onChange={(_, newAlignment) => {
                        if (newAlignment) {
                          dispatchStyleUpdate(() => { }, updateColumnTextAlign, { textAlign: newAlignment });
                        }
                      }}
                      size="small"
                      fullWidth
                      sx={{ bgcolor: '#f9f9f9' }}
                    >
                      <ToggleButton value="left"><FormatAlignLeftIcon sx={{ fontSize: '18px' }} /></ToggleButton>
                      <ToggleButton value="center"><FormatAlignCenterIcon sx={{ fontSize: '18px' }} /></ToggleButton>
                      <ToggleButton value="right"><FormatAlignRightIcon sx={{ fontSize: '18px' }} /></ToggleButton>
                      <ToggleButton value="justify"><FormatAlignJustifyIcon sx={{ fontSize: '18px' }} /></ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>

          {/* Style Section */}
          <Accordion defaultExpanded disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
              <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Style</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
              <Stack spacing={3}>
                {isColumnSelected && currentBgColor && (
                  <ColorPicker
                    label="Background Color"
                    value={currentBgColor}
                    onChange={(color) => dispatchStyleUpdate(() => { }, updateColumnBgColor, { color: color })}
                  />
                )}

                {isColumnSelected && currentBorderStyle !== undefined && (
                  <>
                    <Box>
                      <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 1.5 }}>Border Settings</Typography>
                      <FormControl variant="outlined" size="small" fullWidth sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: '12px', color: '#6d7882', mb: 0.5 }}>Border Style</Typography>
                        <Select
                          value={currentBorderStyle}
                          onChange={(e) => dispatchStyleUpdate(() => { }, updateColumnBorderStyle, { style: e.target.value })}
                          sx={{ fontSize: '11px', bgcolor: '#f9f9f9' }}
                          MenuProps={{ disablePortal: true, sx: { zIndex: 999999 } }}
                        >
                          <MenuItem value="solid" sx={{ fontSize: '11px' }}>Solid</MenuItem>
                          <MenuItem value="dashed" sx={{ fontSize: '11px' }}>Dashed</MenuItem>
                          <MenuItem value="dotted" sx={{ fontSize: '11px' }}>Dotted</MenuItem>
                        </Select>
                      </FormControl>

                      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                        {[
                          { label: 'Top', size: currentBorderTopSize, color: currentBorderTopColor, sizeAction: updateColumnBorderTopSize, colorAction: updateColumnBorderTopColor },
                          { label: 'Bottom', size: currentBorderBottomSize, color: currentBorderBottomColor, sizeAction: updateColumnBorderBottomSize, colorAction: updateColumnBorderBottomColor },
                          { label: 'Left', size: currentBorderLeftSize, color: currentBorderLeftColor, sizeAction: updateColumnBorderLeftSize, colorAction: updateColumnBorderLeftColor },
                          { label: 'Right', size: currentBorderRightSize, color: currentBorderRightColor, sizeAction: updateColumnBorderRightSize, colorAction: updateColumnBorderRightColor },
                        ].map((b) => (
                          <Stack key={b.label} spacing={1} sx={{ p: 1.5, border: '1px solid #f0f0f0', borderRadius: '4px', bgcolor: '#fdfdfd' }}>
                            <Typography sx={{ fontSize: '10px', fontWeight: 700, color: '#a4afb7', textTransform: 'uppercase' }}>{b.label}</Typography>
                            <TextField
                              type="number"
                              size="small"
                              value={b.size || 0}
                              onChange={(e) => dispatchStyleUpdate(() => { }, b.sizeAction, { size: Math.min(Number(e.target.value), 40) })}
                              sx={textFieldStyle}
                            />
                            <ColorPicker
                              label=""
                              value={b.color || "#000000"}
                              onChange={(color) => dispatchStyleUpdate(() => { }, b.colorAction, { color: color })}
                            />
                          </Stack>
                        ))}
                      </Box>
                    </Box>

                    {currentPadding && (
                      <Box>
                        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 1.5 }}>Padding</Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
                          {[
                            { label: 'TOP', side: 'top' },
                            { label: 'RIGHT', side: 'right' },
                            { label: 'BOTTOM', side: 'bottom' },
                            { label: 'LEFT', side: 'left' },
                          ].map((p) => (
                            <Box key={p.side}>
                              <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>{p.label}</Typography>
                              <TextField
                                type="number"
                                size="small"
                                fullWidth
                                value={currentPadding[p.side as keyof typeof currentPadding]}
                                onChange={(e) => dispatchStyleUpdate(() => { }, updateColumnPadding, { side: p.side, value: Math.min(Number(e.target.value), 50) })}
                                InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }}
                              />
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

export default LayoutEditorWidget;
