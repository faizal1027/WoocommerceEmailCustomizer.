import {
  Box,
  ClickAwayListener,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  Stack,
  Divider,
  InputLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../Store/store";
import {
  updateHeadingEditorOptions,
  deleteColumnContent,
  closeEditor,
} from "../../../../../Store/Slice/workspaceSlice";
import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import ColorPicker from "../../../../utils/ColorPicker";
import { HeadingEditorOptions } from "../../../../../Store/Slice/workspaceSlice";
import { FONT_FAMILIES } from "../../../../../Constants/StyleConstants";

const HeadingWidgetEditor = () => {
  const dispatch = useDispatch();
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex, headingEditorOptions } = useSelector(
    (state: RootState) => state.workspace
  );

  const {
    fontFamily,
    fontWeight,
    fontSize,
    headingType,
    color,
    backgroundColor,
    textAlign,
    lineHeight,
    letterSpace,
    padding = { top: 0, left: 0, right: 0, bottom: 0 },
  } = headingEditorOptions;


  const optionsRef = useRef(headingEditorOptions);
  useEffect(() => {
    optionsRef.current = headingEditorOptions;
  }, [headingEditorOptions]);

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

  const updateData = useCallback((newData: Partial<HeadingEditorOptions>) => {
    dispatch(updateHeadingEditorOptions(newData));
  }, [dispatch]);

  const debouncedUpdate = useMemo(() => {
    let timeoutId: any;
    return (newData: Partial<HeadingEditorOptions>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => updateData(newData), 50);
    };
  }, [updateData]);

  const handlePaddingChange = (side: "top" | "left" | "right" | "bottom", value: number) => {
    debouncedUpdate({ padding: { ...padding, [side]: value } });
  };


  const handleHeadingTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newHeadingType: "h1" | "h2" | "h3" | "h4" | null
  ) => {
    if (newHeadingType !== null) {
      let newFontSize = fontSize;
      switch (newHeadingType) {
        case "h1": newFontSize = 22; break;
        case "h2": newFontSize = 20; break;
        case "h3": newFontSize = 18; break;
        case "h4": newFontSize = 16; break;
      }
      debouncedUpdate({ headingType: newHeadingType, fontSize: newFontSize });
    }
  };


  return (
    <Box sx={{ bgcolor: '#f9f9f9', height: '100%' }}>
      {/* Editor Header */}
      <Box sx={{ p: '15px 20px', bgcolor: '#fff', borderBottom: '1px solid #e7e9eb' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#495157' }}>Heading</Typography>
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
          Customize heading style.
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
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Heading Text</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  variant="outlined"
                  size="small"
                  value={headingEditorOptions.content || ""}
                  onChange={(e) => debouncedUpdate({ content: e.target.value })}
                  placeholder="Type your heading here..."
                  InputProps={{ sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Heading Type</Typography>
                <ToggleButtonGroup
                  exclusive
                  value={headingType}
                  onChange={handleHeadingTypeChange}
                  fullWidth
                  size="small"
                  sx={{ bgcolor: '#f9f9f9' }}
                >
                  <ToggleButton value="h1"><Typography sx={{ fontSize: '12px', fontWeight: 700 }}>H1</Typography></ToggleButton>
                  <ToggleButton value="h2"><Typography sx={{ fontSize: '12px', fontWeight: 700 }}>H2</Typography></ToggleButton>
                  <ToggleButton value="h3"><Typography sx={{ fontSize: '12px', fontWeight: 700 }}>H3</Typography></ToggleButton>
                  <ToggleButton value="h4"><Typography sx={{ fontSize: '12px', fontWeight: 700 }}>H4</Typography></ToggleButton>
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
              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Font Family</Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={fontFamily}
                    onChange={(e) => debouncedUpdate({ fontFamily: e.target.value as string })}
                    sx={{ fontSize: '11px', bgcolor: '#f9f9f9' }}
                    MenuProps={{
                      disablePortal: true,
                      sx: { zIndex: 999999 }
                    }}
                  >
                    {FONT_FAMILIES.map((font) => (
                      <MenuItem key={font} value={font} sx={{ fontSize: '11px', fontFamily: font !== 'Global' ? font : 'inherit' }}>
                        {font}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Font Weight</Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={fontWeight || '400'}
                      onChange={(e) => debouncedUpdate({ fontWeight: e.target.value as string })}
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
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Font Size</Typography>
                  <TextField
                    type="number"
                    value={fontSize}
                    onChange={(e) => debouncedUpdate({ fontSize: Number(e.target.value) })}
                    size="small"
                    fullWidth
                    InputProps={{ sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                  />
                </Box>
              </Box>

              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Line Height</Typography>
                  <TextField
                    type="number"
                    value={lineHeight || ''}
                    onChange={(e) => debouncedUpdate({ lineHeight: Number(e.target.value) })}
                    size="small"
                    fullWidth
                    placeholder="24"
                    InputProps={{ sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                  />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Letter Space</Typography>
                  <TextField
                    type="number"
                    value={letterSpace}
                    onChange={(e) => debouncedUpdate({ letterSpace: Number(e.target.value) })}
                    size="small"
                    fullWidth
                    InputProps={{ sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                  />
                </Box>
              </Box>

              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <ColorPicker
                  label="Text Color"
                  value={color}
                  onChange={(newColor) => debouncedUpdate({ color: newColor })}
                />
                <ColorPicker
                  label="Background Color"
                  value={backgroundColor}
                  onChange={(newColor) => debouncedUpdate({ backgroundColor: newColor })}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Alignment</Typography>
                <ToggleButtonGroup
                  exclusive
                  value={textAlign}
                  onChange={(e, newAlign) => newAlign && debouncedUpdate({ textAlign: newAlign })}
                  fullWidth
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
                    <TextField type="number" size="small" fullWidth value={padding.top} onChange={(e) => handlePaddingChange("top", Number(e.target.value))} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>RIGHT</Typography>
                    <TextField type="number" size="small" fullWidth value={padding.right} onChange={(e) => handlePaddingChange("right", Number(e.target.value))} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>BOTTOM</Typography>
                    <TextField type="number" size="small" fullWidth value={padding.bottom} onChange={(e) => handlePaddingChange("bottom", Number(e.target.value))} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>LEFT</Typography>
                    <TextField type="number" size="small" fullWidth value={padding.left} onChange={(e) => handlePaddingChange("left", Number(e.target.value))} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
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

export default HeadingWidgetEditor;
