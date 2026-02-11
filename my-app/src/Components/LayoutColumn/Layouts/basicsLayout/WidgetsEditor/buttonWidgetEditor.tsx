import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Switch,
  Slider,
  FormControlLabel,
  IconButton,
  Tooltip,
  Stack,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  Close as CloseIcon,
} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../Store/store";
import {
  updateButtonEditorOptions,
  closeEditor,
  deleteColumnContent,
} from "../../../../../Store/Slice/workspaceSlice";
import { ButtonEditorOptions, defaultButtonEditorOptions } from "../../../../../Store/Slice/workspaceSlice";
import { PlaceholderSelect } from "../../../../utils/PlaceholderSelect";
import ColorPicker from "../../../../utils/ColorPicker";

const ButtonWidgetEditor = () => {
  const dispatch = useDispatch();
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex, buttonEditorOptions: buttonData } = useSelector(
    (state: RootState) => state.workspace
  );


  const optionsRef = useRef(buttonData);
  useEffect(() => {
    optionsRef.current = buttonData;
  }, [buttonData]);

  const updateData = useCallback((newData: Partial<ButtonEditorOptions>) => {
    dispatch(updateButtonEditorOptions(newData));
  }, [dispatch]);

  const debouncedUpdate = useMemo(() => {
    let timeoutId: any;
    return (newData: Partial<ButtonEditorOptions>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => updateData(newData), 50);
    };
  }, [updateData]);

  const handleChange = (field: keyof ButtonEditorOptions, value: any) => {
    debouncedUpdate({ [field]: value });
  };

  const handlePaddingChange = (side: keyof ButtonEditorOptions["padding"], value: number) => {
    debouncedUpdate({ padding: { ...buttonData.padding, [side]: value } });
  };

  const handleBorderRadiusChange = (side: keyof ButtonEditorOptions["borderRadius"], value: number) => {
    debouncedUpdate({ borderRadius: { ...buttonData.borderRadius, [side]: value } });
  };

  const handleWidthToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isAuto = event.target.checked;
    debouncedUpdate({
      widthAuto: isAuto,
      width: isAuto ? undefined : buttonData.width ?? 100,
    });
  };

  const handleWidthChange = (event: Event, newValue: number | number[]) => {
    debouncedUpdate({ width: newValue as number });
  };

  const handleCloseEditor = useCallback(() => {
    dispatch(closeEditor());
  }, [dispatch]);

  const handleDeleteContent = useCallback(() => {
    if (selectedBlockForEditor && selectedColumnIndex !== null && selectedWidgetIndex !== null) {
      dispatch(
        deleteColumnContent({
          blockId: selectedBlockForEditor,
          columnIndex: selectedColumnIndex,
          widgetIndex: selectedWidgetIndex,
        })
      );
    }
  }, [dispatch, selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex]);


  return (
    <Box sx={{ bgcolor: '#f9f9f9', height: '100%' }}>
      {/* Editor Header */}
      <Box sx={{ p: '15px 20px', bgcolor: '#fff', borderBottom: '1px solid #e7e9eb' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#495157' }}>Button</Typography>
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
          Customize button style.
        </Typography>
      </Box>

      {/* Editor Sections */}
      <Box sx={{ height: 'calc(100% - 70px)', overflowY: 'auto' }}>
        {/* Content Section */}
        <Accordion defaultExpanded disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Content</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Variables</Typography>
                <PlaceholderSelect onSelect={(ph) => handleChange("text", (buttonData.text || "") + ph)} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Button Text</Typography>
                <TextField
                  fullWidth
                  value={buttonData.text}
                  onChange={(e) => handleChange("text", e.target.value)}
                  size="small"
                  InputProps={{ sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Link URL</Typography>
                <Box mb={1}>
                  <PlaceholderSelect onSelect={(ph) => handleChange("url", (buttonData.url || "") + ph)} />
                </Box>
                <TextField
                  fullWidth
                  value={buttonData.url}
                  onChange={(e) => handleChange("url", e.target.value)}
                  size="small"
                  placeholder="example.com"
                  InputProps={{
                    sx: { fontSize: '11px', bgcolor: '#f9f9f9' },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography sx={{ fontSize: '11px', color: '#a4afb7' }}>https://</Typography>
                      </InputAdornment>
                    ),
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
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <ColorPicker
                  label="Background"
                  value={buttonData.bgColor}
                  onChange={(color) => handleChange("bgColor", color)}
                />
                <ColorPicker
                  label="Text Color"
                  value={buttonData.textColor}
                  onChange={(color) => handleChange("textColor", color)}
                />
              </Box>

              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Font Size</Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={buttonData.fontSize}
                    onChange={(e) => handleChange("fontSize", Number(e.target.value))}
                    size="small"
                    InputProps={{ sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                  />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Line Height</Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={buttonData.lineHeight || 24}
                    onChange={(e) => handleChange("lineHeight", Number(e.target.value))}
                    size="small"
                    InputProps={{ sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                  />
                </Box>
              </Box>

              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Font Weight</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={buttonData.fontWeight || '400'}
                      onChange={(e) => handleChange("fontWeight", e.target.value)}
                      sx={{ fontSize: '11px', bgcolor: '#f9f9f9' }}
                      MenuProps={{
                        disablePortal: true,
                        sx: { zIndex: 999999 }
                      }}
                    >
                      {['100', '200', '300', '400', '500', '600', '700', '800', '900'].map((weight) => (
                        <MenuItem key={weight} value={weight} sx={{ fontSize: '11px' }}>{weight}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Alignment</Typography>
                  <ToggleButtonGroup
                    exclusive
                    value={buttonData.textAlign}
                    onChange={(e, newAlign) => newAlign && handleChange("textAlign", newAlign)}
                    fullWidth
                    size="small"
                    sx={{ bgcolor: '#f9f9f9' }}
                  >
                    <ToggleButton value="left" sx={{ p: '5px' }}><FormatAlignLeft sx={{ fontSize: '18px' }} /></ToggleButton>
                    <ToggleButton value="center" sx={{ p: '5px' }}><FormatAlignCenter sx={{ fontSize: '18px' }} /></ToggleButton>
                    <ToggleButton value="right" sx={{ p: '5px' }}><FormatAlignRight sx={{ fontSize: '18px' }} /></ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Box>

              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Width</Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={buttonData.widthAuto || false}
                        onChange={handleWidthToggle}
                        size="small"
                      />
                    }
                    label={<Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#555' }}>Auto</Typography>}
                    labelPlacement="start"
                    sx={{ m: 0 }}
                  />
                  {!buttonData.widthAuto && (
                    <Box width="100%" ml={1}>
                      <Slider
                        value={buttonData.width ?? 100}
                        onChange={handleWidthChange}
                        size="small"
                        sx={{ color: '#93003c' }}
                      />
                    </Box>
                  )}
                </Box>
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
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 1 }}>Border Radius</Typography>
                <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1}>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>TOP</Typography>
                    <TextField type="number" size="small" fullWidth value={buttonData.borderRadius.topLeft} onChange={(e) => handleBorderRadiusChange("topLeft", Number(e.target.value))} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>RIGHT</Typography>
                    <TextField type="number" size="small" fullWidth value={buttonData.borderRadius.topRight} onChange={(e) => handleBorderRadiusChange("topRight", Number(e.target.value))} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>BOTTOM</Typography>
                    <TextField type="number" size="small" fullWidth value={buttonData.borderRadius.bottomRight} onChange={(e) => handleBorderRadiusChange("bottomRight", Number(e.target.value))} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>LEFT</Typography>
                    <TextField type="number" size="small" fullWidth value={buttonData.borderRadius.bottomLeft} onChange={(e) => handleBorderRadiusChange("bottomLeft", Number(e.target.value))} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                </Box>
              </Box>

              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 1 }}>Padding</Typography>
                <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1}>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>TOP</Typography>
                    <TextField type="number" size="small" fullWidth value={buttonData.padding.top} onChange={(e) => handlePaddingChange("top", Number(e.target.value))} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>RIGHT</Typography>
                    <TextField type="number" size="small" fullWidth value={buttonData.padding.right} onChange={(e) => handlePaddingChange("right", Number(e.target.value))} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>BOTTOM</Typography>
                    <TextField type="number" size="small" fullWidth value={buttonData.padding.bottom} onChange={(e) => handlePaddingChange("bottom", Number(e.target.value))} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>LEFT</Typography>
                    <TextField type="number" size="small" fullWidth value={buttonData.padding.left} onChange={(e) => handlePaddingChange("left", Number(e.target.value))} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
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

export default ButtonWidgetEditor;