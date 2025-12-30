import {
  Box, Typography, Slider, TextField, MenuItem,
  ToggleButton, ToggleButtonGroup,
  IconButton, Tooltip,
  Stack,
  Divider,
  Popover,
} from "@mui/material";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../Store/store";
import CloseIcon from "@mui/icons-material/Close";
import { updateWidgetContentData, deleteColumnContent, closeEditor } from "../../../../../Store/Slice/workspaceSlice";
import { useState } from "react";
import ColorPicker from "../../../../utils/ColorPicker";

const DividerWidgetEditor = () => {
  const dispatch = useDispatch();
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );
  const column = useSelector((state: RootState) =>
    selectedBlockForEditor && selectedColumnIndex !== null
      ? state.workspace.blocks.find((block) => block.id === selectedBlockForEditor)?.columns[selectedColumnIndex]
      : null
  );
  const widgetContent = (selectedWidgetIndex !== null && column?.widgetContents)
    ? column.widgetContents[selectedWidgetIndex]
    : null;


  const dividerOptions = widgetContent?.contentData
    ? JSON.parse(widgetContent.contentData)
    : {
      width: "75",
      style: "solid",
      thickness: 2,
      color: "#000000",
      alignment: "center",
      padding: { top: 10, right: 0, bottom: 10, left: 0 },
    };

  const paddingSides: (keyof typeof dividerOptions.padding)[] = [
    "top",
    "right",
    "bottom",
    "left",
  ];


  if (!widgetContent) {
    return (
      <Box p={3} textAlign="center">
        <Typography color="textSecondary">No widget selected.</Typography>
      </Box>
    );
  }


  const handleOptionChange = (field: keyof typeof dividerOptions, value: any) => {
    if (selectedBlockForEditor && selectedColumnIndex !== null && selectedWidgetIndex !== null) {
      const newOptions = { ...dividerOptions, [field]: value };
      dispatch(
        updateWidgetContentData({
          blockId: selectedBlockForEditor,
          columnIndex: selectedColumnIndex,
          widgetIndex: selectedWidgetIndex,
          data: JSON.stringify(newOptions),
        })
      );
    }
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

  const handlePaddingChange = (side: keyof typeof dividerOptions.padding, value: number) => {
    if (selectedBlockForEditor && selectedColumnIndex !== null && selectedWidgetIndex !== null) {
      const newPadding = { ...dividerOptions.padding, [side]: Math.max(0, value) };
      const newOptions = { ...dividerOptions, padding: newPadding };
      dispatch(
        updateWidgetContentData({
          blockId: selectedBlockForEditor,
          columnIndex: selectedColumnIndex,
          widgetIndex: selectedWidgetIndex,
          data: JSON.stringify(newOptions),
        })
      );
    }
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
              Divider
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Customize divider line.
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
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Appearance
          </Typography>
          <Stack spacing={2}>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Width
              </Typography>
              <Slider
                value={parseInt(dividerOptions.width)}
                onChange={(_, value) => handleOptionChange("width", `${value || 1}`)}
                min={1}
                max={100}
                step={1}
                valueLabelDisplay="auto"
                size="small"
              />
            </Box>

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Style
                </Typography>
                <TextField
                  select
                  value={dividerOptions.style}
                  onChange={(e) => handleOptionChange("style", e.target.value)}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="solid">Solid</MenuItem>
                  <MenuItem value="dashed">Dashed</MenuItem>
                  <MenuItem value="dotted">Dotted</MenuItem>
                </TextField>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                  Weight
                </Typography>
                <TextField
                  type="number"
                  value={dividerOptions.thickness}
                  onChange={(e) =>
                    handleOptionChange("thickness", parseInt(e.target.value) || 1)
                  }
                  inputProps={{ min: 1 }}
                  fullWidth
                  size="small"
                />
              </Box>
            </Box>

            <ColorPicker
              label="Color"
              value={dividerOptions.color}
              onChange={(color) => handleOptionChange("color", color)}
            />

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Alignment
              </Typography>
              <ToggleButtonGroup
                value={dividerOptions.alignment}
                exclusive
                onChange={(_, newAlign) => {
                  if (newAlign) handleOptionChange("alignment", newAlign);
                }}
                fullWidth
                size="small"
              >
                <ToggleButton value="left">
                  <FormatAlignLeftIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="center">
                  <FormatAlignCenterIcon fontSize="small" />
                </ToggleButton>
                <ToggleButton value="right">
                  <FormatAlignRightIcon fontSize="small" />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Stack>
        </Box>

        <Divider />

        {/* Padding */}
        <Box pb={2}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Padding
          </Typography>
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Top
              </Typography>
              <TextField type="number" value={dividerOptions.padding.top} onChange={(e) => handlePaddingChange("top", Number(e.target.value))} size="small" fullWidth />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Bottom
              </Typography>
              <TextField type="number" value={dividerOptions.padding.bottom} onChange={(e) => handlePaddingChange("bottom", Number(e.target.value))} size="small" fullWidth />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Left
              </Typography>
              <TextField type="number" value={dividerOptions.padding.left} onChange={(e) => handlePaddingChange("left", Number(e.target.value))} size="small" fullWidth />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Right
              </Typography>
              <TextField type="number" value={dividerOptions.padding.right} onChange={(e) => handlePaddingChange("right", Number(e.target.value))} size="small" fullWidth />
            </Box>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default DividerWidgetEditor;