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
} from "@mui/material";
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
    <Box p={2} position="relative">
      <Stack spacing={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h6">
              Button
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Customize button style.
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

        {/* Section: Content */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Content
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Variables
              </Typography>
              <Box mb={1}>
                <PlaceholderSelect
                  onSelect={(ph) => handleChange("text", (buttonData.text || "") + ph)}
                />
              </Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Button Text
              </Typography>
              <TextField
                fullWidth
                value={buttonData.text}
                onChange={(e) => handleChange("text", e.target.value)}
                size="small"
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                URL Link (HTTPS)
              </Typography>
              <Box mb={1}>
                <PlaceholderSelect
                  onSelect={(ph) => handleChange("url", (buttonData.url || "") + ph)}
                />
              </Box>
              <TextField
                fullWidth
                value={buttonData.url}
                onChange={(e) => handleChange("url", e.target.value)}
                size="small"
                placeholder="example.com"
                InputProps={{
                  startAdornment: (
                    <Typography variant="body2" color="textSecondary" mr={1}>
                      https://
                    </Typography>
                  ),
                }}
              />
            </Box>
          </Stack>
        </Box>

        <Divider />

        {/* Section: Appearance */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Appearance
          </Typography>
          <Stack spacing={2}>

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
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
            </Box>

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Font Size
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={buttonData.fontSize}
                  onChange={(e) => handleChange("fontSize", Number(e.target.value))}
                  size="small"
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Font Weight
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    fullWidth
                    value={buttonData.fontWeight}
                    onChange={(e) => handleChange("fontWeight", e.target.value)}
                    MenuProps={{
                      disablePortal: false,
                      sx: { zIndex: 1300001 },
                      style: { zIndex: 1300001 }
                    }}
                  >
                    <MenuItem value="normal" >Normal</MenuItem>
                    <MenuItem value="bold">Bold</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Alignment
              </Typography>
              <ToggleButtonGroup
                exclusive
                value={buttonData.textAlign}
                onChange={(e, newAlign) =>
                  newAlign && handleChange("textAlign", newAlign)
                }
                fullWidth
                size="small"
              >
                <ToggleButton value="left" size="small">
                  <FormatAlignLeft fontSize="small" />
                </ToggleButton>
                <ToggleButton value="center" size="small">
                  <FormatAlignCenter fontSize="small" />
                </ToggleButton>
                <ToggleButton value="right" size="small">
                  <FormatAlignRight fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Width
              </Typography>
              <Box display="flex" alignItems="center" gap={2} mt={1}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={buttonData.widthAuto || false}
                      onChange={handleWidthToggle}
                      color="primary"
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">Auto</Typography>}
                  labelPlacement="start"
                  sx={{ m: 0 }}
                />
                {!buttonData.widthAuto && (
                  <Box width="100%" ml={2}>
                    <Slider
                      value={buttonData.width ?? 100}
                      onChange={handleWidthChange}
                      min={0}
                      max={100}
                      step={1}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value}%`}
                      size="small"
                    />
                  </Box>
                )}
              </Box>
            </Box>

          </Stack>
        </Box>

        <Divider />

        {/* Section: Spacing */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Border Radius
          </Typography>
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Top Left
              </Typography>
              <TextField
                type="number"
                value={buttonData.borderRadius.topLeft}
                onChange={(e) => handleBorderRadiusChange("topLeft", Number(e.target.value))}
                size="small"
                fullWidth
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Top Right
              </Typography>
              <TextField
                type="number"
                value={buttonData.borderRadius.topRight}
                onChange={(e) => handleBorderRadiusChange("topRight", Number(e.target.value))}
                size="small"
                fullWidth
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Bottom Left
              </Typography>
              <TextField
                type="number"
                value={buttonData.borderRadius.bottomLeft}
                onChange={(e) => handleBorderRadiusChange("bottomLeft", Number(e.target.value))}
                size="small"
                fullWidth
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Bottom Right
              </Typography>
              <TextField
                type="number"
                value={buttonData.borderRadius.bottomRight}
                onChange={(e) => handleBorderRadiusChange("bottomRight", Number(e.target.value))}
                size="small"
                fullWidth
              />
            </Box>
          </Box>
        </Box>

        <Box pb={2}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Padding
          </Typography>
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Top
              </Typography>
              <TextField type="number" value={buttonData.padding.top} onChange={(e) => handlePaddingChange("top", Number(e.target.value))} size="small" fullWidth />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Bottom
              </Typography>
              <TextField type="number" value={buttonData.padding.bottom} onChange={(e) => handlePaddingChange("bottom", Number(e.target.value))} size="small" fullWidth />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Left
              </Typography>
              <TextField type="number" value={buttonData.padding.left} onChange={(e) => handlePaddingChange("left", Number(e.target.value))} size="small" fullWidth />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Right
              </Typography>
              <TextField type="number" value={buttonData.padding.right} onChange={(e) => handlePaddingChange("right", Number(e.target.value))} size="small" fullWidth />
            </Box>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default ButtonWidgetEditor;