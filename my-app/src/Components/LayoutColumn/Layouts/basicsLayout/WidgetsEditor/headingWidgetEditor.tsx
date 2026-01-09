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
} from "@mui/material";
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
    <Box p={2}>
      <Stack spacing={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">
              Heading
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Customize heading style.
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Tooltip title="Close">
              <IconButton onClick={handleCloseEditor} size="small" sx={{ bgcolor: '#eee' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={handleDeleteContent} size="small" sx={{ bgcolor: '#eee' }}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Heading Text
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            size="small"
            value={headingEditorOptions.content || ""}
            onChange={(e) => debouncedUpdate({ content: e.target.value })}
            placeholder="Type your heading here..."
            sx={{
              '& .MuiInputBase-input': {
                border: 'none !important',
                boxShadow: 'none !important',
                outline: 'none !important',
              }
            }}
          />
        </Box>

        <Divider />

        {/* Section: Heading Type */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Heading Type
          </Typography>
          <ToggleButtonGroup
            exclusive
            value={headingType}
            onChange={handleHeadingTypeChange}
            fullWidth
            size="small"
          >
            <ToggleButton value="h1">
              <Typography fontWeight="bold" sx={{ fontSize: "13px" }}>H1</Typography>
            </ToggleButton>
            <ToggleButton value="h2">
              <Typography fontWeight="bold" sx={{ fontSize: "13px" }}>H2</Typography>
            </ToggleButton>
            <ToggleButton value="h3">
              <Typography fontWeight="bold" sx={{ fontSize: "13px" }}>H3</Typography>
            </ToggleButton>
            <ToggleButton value="h4">
              <Typography fontWeight="bold" sx={{ fontSize: "13px" }}>H4</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Divider />

        {/* Section: Typography */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Typography
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Font Family
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={fontFamily}
                  onChange={(e) => debouncedUpdate({ fontFamily: e.target.value as string })}
                  MenuProps={{
                    disablePortal: false,
                    sx: { zIndex: 1300001 },
                    style: { zIndex: 1300001 }
                  }}
                >
                  <MenuItem value="global">Global</MenuItem>
                  <MenuItem value="Arial, sans-serif">Arial</MenuItem>
                  <MenuItem value="Verdana, Geneva, sans-serif">Verdana</MenuItem>
                  <MenuItem value="Times New Roman, serif">Times New Roman</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Font Weight
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={fontWeight}
                    onChange={(e) => debouncedUpdate({ fontWeight: e.target.value as string })}
                    MenuProps={{
                      disablePortal: false,
                      sx: { zIndex: 1300001 },
                      style: { zIndex: 1300001 }
                    }}
                  >
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="bold">Bold</MenuItem>
                    <MenuItem value="lighter">Lighter</MenuItem>
                    <MenuItem value="bolder">Bolder</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Font Size
                </Typography>
                <TextField
                  type="number"
                  value={fontSize}
                  onChange={(e) => debouncedUpdate({ fontSize: Number(e.target.value) })}
                  size="small"
                  fullWidth
                />
              </Box>
            </Box>

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Line Height (%)
                </Typography>
                <TextField
                  type="number"
                  value={lineHeight}
                  onChange={(e) => debouncedUpdate({ lineHeight: Number(e.target.value) })}
                  size="small"
                  fullWidth
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Letter Spacing
                </Typography>
                <TextField
                  type="number"
                  value={letterSpace}
                  onChange={(e) => debouncedUpdate({ letterSpace: Number(e.target.value) })}
                  size="small"
                  fullWidth
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
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Alignment
              </Typography>
              <ToggleButtonGroup
                exclusive
                value={textAlign}
                onChange={(e, newAlign) => newAlign && debouncedUpdate({ textAlign: newAlign })}
                fullWidth
                size="small"
              >
                <ToggleButton value="left"><FormatAlignLeftIcon fontSize="small" /></ToggleButton>
                <ToggleButton value="center"><FormatAlignCenterIcon fontSize="small" /></ToggleButton>
                <ToggleButton value="right"><FormatAlignRightIcon fontSize="small" /></ToggleButton>
                <ToggleButton value="justify"><FormatAlignJustifyIcon fontSize="small" /></ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Stack>
        </Box>

        <Divider />

        {/* Section: Spacing */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Spacing (Padding)
          </Typography>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Top
              </Typography>
              <TextField type="number" size="small" fullWidth value={padding.top} onChange={(e) => handlePaddingChange("top", Number(e.target.value))} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Bottom
              </Typography>
              <TextField type="number" size="small" fullWidth value={padding.bottom} onChange={(e) => handlePaddingChange("bottom", Number(e.target.value))} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Left
              </Typography>
              <TextField type="number" size="small" fullWidth value={padding.left} onChange={(e) => handlePaddingChange("left", Number(e.target.value))} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Right
              </Typography>
              <TextField type="number" size="small" fullWidth value={padding.right} onChange={(e) => handlePaddingChange("right", Number(e.target.value))} />
            </Box>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default HeadingWidgetEditor;
