import { useState } from "react";
import {
  Box, Typography, TextField,
  Select, MenuItem, FormControl,
  ToggleButton, ToggleButtonGroup,
} from "@mui/material";
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { ChromePicker } from "react-color";
import { useDispatch, useSelector } from "react-redux";
import {
  closeEditor, setSelectedBlockId, updateSelectedColumnIndex,
  updateColumnBgColor, updateColumnPadding,
  updateColumnBorderStyle, updateColumnBorderTopSize,
  updateColumnBorderBottomSize, updateColumnBorderLeftSize,
  updateColumnBorderRightSize, updateColumnBorderTopColor,
  updateColumnBorderBottomColor, updateColumnBorderLeftColor,
  updateColumnBorderRightColor, updateColumnTextAlign,
} from "../../../../../Store/Slice/workspaceSlice";
import { RootState } from "../../../../../Store/store";

const LayoutEditorWidget = () => {
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showBorderTopPicker, setShowBorderTopPicker] = useState(false);
  const [showBorderBottomPicker, setShowBorderBottomPicker] = useState(false);
  const [showBorderLeftPicker, setShowBorderLeftPicker] = useState(false);
  const [showBorderRightPicker, setShowBorderRightPicker] = useState(false);
  const dispatch = useDispatch();

  const selectedBlockForEditor = useSelector(
    (state: RootState) => state.workspace.selectedBlockForEditor
  );
  const selectedColumnIndex = useSelector(
    (state: RootState) => state.workspace.selectedColumnIndex
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
  const currentPadding = isColumnSelected ? selectedStyle?.padding || { top: 0, right: 0, bottom: 0, left: 0 } : undefined;
  const currentTextAlign = isColumnSelected ? (selectedStyle as any)?.textAlign || 'left' : undefined;

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#e0e0e0" },
      "&:hover fieldset": { borderColor: "#e0e0e0" },
      "&.Mui-focused fieldset": { borderColor: "#e0e0e0" },
    },
    "& .MuiInputBase-input": { padding: "8px 12px" },
    bgcolor: "#f5f5f5",
    borderRadius: "4px",
  };

  const inputGroupContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
    mt: 1,
  };

  const inputGroupItemStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const colorSwatchStyle = (color: string) => ({
    width: 32,
    height: 32,
    borderRadius: "4px",
    backgroundColor: color,
    border: "1px solid #ccc",
    cursor: "pointer",
  });
  const isEditorEnabled = !!selectedBlockForEditor;
  const numberOfColumns = selectedBlock?.columns.length || 0;

  const handleColumnSelectChange = (event: { target: { value: unknown } }) => {
    dispatch(updateSelectedColumnIndex(Number(event.target.value)));
  };

  const dispatchStyleUpdate = (blockAction: any, columnAction: any, payload: any) => {
    if (isColumnSelected && selectedColumnIndex !== null) {
      dispatch(columnAction({ ...payload, columnIndex: selectedColumnIndex }));
    } else {
      dispatch(blockAction(payload));
    }
  };

  return (
    <Box
      sx={{
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        p: 2,
        bgcolor: "background.paper",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Box
        sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          {isColumnSelected ? `Column ${selectedColumnIndex + 1}` : "Block"}
        </Typography>
        <Typography
          variant="h6"
          onClick={() => {
            dispatch(closeEditor());
            dispatch(setSelectedBlockId(null));
          }}
          sx={{ color: "#000", fontSize: "20px", cursor: "pointer" }}
        >
          X
        </Typography>
      </Box>

      {!isEditorEnabled && (
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Select a block to edit its properties.
        </Typography>
      )}

      {isEditorEnabled && (
        <>
          {numberOfColumns > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
                Select Column
              </Typography>
              <FormControl
                variant="outlined"
                size="small"
                fullWidth
                sx={textFieldStyle}
              >
                <Select
                  value={selectedColumnIndex !== null ? selectedColumnIndex : ""}
                  onChange={handleColumnSelectChange}
                >
                  {Array.from({ length: numberOfColumns }, (_, i) => (
                    <MenuItem key={i} value={i}>
                      Column {i + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {isColumnSelected && currentBgColor && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
                Background Color
              </Typography>
              <ClickAwayListener onClickAway={() => setShowBgPicker(false)}>
                <div>
                  <Box
                    sx={colorSwatchStyle(currentBgColor)}
                    onClick={() => setShowBgPicker((prev) => !prev)}
                  />
                  {showBgPicker && (
                    <Box sx={{ position: "absolute", zIndex: 2, mt: 1 }}>
                      <ChromePicker
                        color={currentBgColor}
                        onChange={(color) =>
                          dispatchStyleUpdate(
                            () => { },
                            updateColumnBgColor,
                            { blockId: selectedBlockForEditor!, color: color.hex }
                          )
                        }
                      />
                    </Box>
                  )}
                </div>
              </ClickAwayListener>
            </Box>
          )}

          {isColumnSelected && currentBorderStyle !== undefined && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
                  Border
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", width: "45%" }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: "light" }}>
                      Style
                    </Typography>
                    <FormControl variant="outlined" size="small" sx={textFieldStyle}>
                      <Select
                        value={currentBorderStyle}
                        onChange={(e) =>
                          dispatchStyleUpdate(
                            () => { },
                            updateColumnBorderStyle,
                            {
                              blockId: selectedBlockForEditor!,
                              style: e.target.value as 'solid' | 'dashed' | 'dotted',
                            }
                          )
                        }
                        displayEmpty
                        inputProps={{ "aria-label": "Select border style" }}
                      >
                        <MenuItem value="solid">Solid</MenuItem>
                        <MenuItem value="dashed">Dashed</MenuItem>
                        <MenuItem value="dotted">Dotted</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>



                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", mt: 1 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: "light" }}>Top</Typography>
                    <TextField
                      variant="outlined"
                      size="small"
                      value={currentBorderTopSize || 0}
                      InputProps={{ inputProps: { min: 0, max: 40 } }}
                      onChange={(e) =>
                        dispatchStyleUpdate(
                          () => { },
                          updateColumnBorderTopSize,
                          {
                            blockId: selectedBlockForEditor!,
                            size: Math.min(Number(e.target.value), 40),
                          }
                        )
                      }
                      type="number"
                      sx={textFieldStyle}
                    />
                    <ClickAwayListener onClickAway={() => setShowBorderTopPicker(false)}>
                      <div>
                        <Box sx={colorSwatchStyle(currentBorderTopColor || "#000000")} onClick={() => setShowBorderTopPicker((prev) => !prev)} />
                        {showBorderTopPicker && (
                          <Box sx={{ position: "absolute", zIndex: 2, mt: 1 }}>
                            <ChromePicker
                              color={currentBorderTopColor || "#000000"}
                              onChange={(color) =>
                                dispatchStyleUpdate(
                                  () => { },
                                  updateColumnBorderTopColor,
                                  { blockId: selectedBlockForEditor!, color: color.hex }
                                )
                              }
                            />
                          </Box>
                        )}
                      </div>
                    </ClickAwayListener>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: "light" }}>Bottom</Typography>
                    <TextField
                      variant="outlined"
                      size="small"

                      value={currentBorderBottomSize || 0}
                      InputProps={{ inputProps: { min: 0, max: 40 } }}
                      onChange={(e) =>
                        dispatchStyleUpdate(
                          () => { },
                          updateColumnBorderBottomSize,
                          {
                            blockId: selectedBlockForEditor!,
                            size: Math.min(Number(e.target.value), 40),
                          }
                        )
                      }
                      type="number"
                      sx={textFieldStyle}
                    />
                    <ClickAwayListener onClickAway={() => setShowBorderBottomPicker(false)}>
                      <div>
                        <Box sx={colorSwatchStyle(currentBorderBottomColor || "#000000")} onClick={() => setShowBorderBottomPicker((prev) => !prev)} />
                        {showBorderBottomPicker && (
                          <Box sx={{ position: "absolute", zIndex: 2, mt: 1 }}>
                            <ChromePicker
                              color={currentBorderBottomColor || "#000000"}
                              onChange={(color) =>
                                dispatchStyleUpdate(
                                  () => { },
                                  updateColumnBorderBottomColor,
                                  { blockId: selectedBlockForEditor!, color: color.hex }
                                )
                              }
                            />
                          </Box>
                        )}
                      </div>
                    </ClickAwayListener>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: "light" }}>Left</Typography>
                    <TextField
                      variant="outlined"
                      size="small"
                      value={currentBorderLeftSize || 0}
                      InputProps={{ inputProps: { min: 0, max: 40 } }}
                      onChange={(e) =>
                        dispatchStyleUpdate(
                          () => { },
                          updateColumnBorderLeftSize,
                          {
                            blockId: selectedBlockForEditor!,
                            size: Math.min(Number(e.target.value), 40),
                          }
                        )
                      }
                      type="number"
                      sx={textFieldStyle}
                    />
                    <ClickAwayListener onClickAway={() => setShowBorderLeftPicker(false)}>
                      <div>
                        <Box sx={colorSwatchStyle(currentBorderLeftColor || "#000000")} onClick={() => setShowBorderLeftPicker((prev) => !prev)} />
                        {showBorderLeftPicker && (
                          <Box sx={{ position: "absolute", zIndex: 2, mt: 1 }}>
                            <ChromePicker
                              color={currentBorderLeftColor || "#000000"}
                              onChange={(color) =>
                                dispatchStyleUpdate(
                                  () => { },
                                  updateColumnBorderLeftColor,
                                  { blockId: selectedBlockForEditor!, color: color.hex }
                                )
                              }
                            />
                          </Box>
                        )}
                      </div>
                    </ClickAwayListener>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: "light" }}>Right</Typography>
                    <TextField
                      variant="outlined"
                      size="small"
                      value={currentBorderRightSize || 0}
                      InputProps={{ inputProps: { min: 0, max: 40 } }}
                      onChange={(e) =>
                        dispatchStyleUpdate(
                          () => { },
                          updateColumnBorderRightSize,
                          {
                            blockId: selectedBlockForEditor!,
                            size: Math.min(Number(e.target.value), 40),
                          }
                        )
                      }
                      type="number"
                      sx={textFieldStyle}
                    />
                    <ClickAwayListener onClickAway={() => setShowBorderRightPicker(false)}>
                      <div>
                        <Box sx={colorSwatchStyle(currentBorderRightColor || "#000000")} onClick={() => setShowBorderRightPicker((prev) => !prev)} />
                        {showBorderRightPicker && (
                          <Box sx={{ position: "absolute", zIndex: 2, mt: 1 }}>
                            <ChromePicker
                              color={currentBorderRightColor || "#000000"}
                              onChange={(color) =>
                                dispatchStyleUpdate(
                                  () => { },
                                  updateColumnBorderRightColor,
                                  { blockId: selectedBlockForEditor!, color: color.hex }
                                )
                              }
                            />
                          </Box>
                        )}
                      </div>
                    </ClickAwayListener>
                  </Box>
                </Box>
              </Box>
            </>
          )}

          {isColumnSelected && currentPadding && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
                Padding
              </Typography>
              <Box sx={inputGroupContainerStyle}>
                <Box sx={inputGroupItemStyle}>
                  <Typography variant="caption">Top</Typography>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={currentPadding.top}
                    InputProps={{ inputProps: { min: 0, max: 50 } }}
                    onChange={(e) =>
                      dispatchStyleUpdate(
                        () => { },
                        updateColumnPadding,
                        {
                          blockId: selectedBlockForEditor!,
                          columnIndex: selectedColumnIndex!,
                          side: "top",
                          value: Math.min(Number(e.target.value), 50),
                        }
                      )
                    }
                    type="number"
                    sx={textFieldStyle}
                  />
                </Box>
                <Box sx={inputGroupItemStyle}>
                  <Typography variant="caption">Left</Typography>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={currentPadding.left}
                    InputProps={{ inputProps: { min: 0, max: 50 } }}
                    onChange={(e) =>
                      dispatchStyleUpdate(
                        () => { },
                        updateColumnPadding,
                        {
                          blockId: selectedBlockForEditor!,
                          columnIndex: selectedColumnIndex!,
                          side: "left",
                          value: Math.min(Number(e.target.value), 50),
                        }
                      )
                    }
                    type="number"
                    sx={textFieldStyle}
                  />
                </Box>
                <Box sx={inputGroupItemStyle}>
                  <Typography variant="caption">Right</Typography>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={currentPadding.right}
                    InputProps={{ inputProps: { min: 0, max: 50 } }}
                    onChange={(e) =>
                      dispatchStyleUpdate(
                        () => { },
                        updateColumnPadding,
                        {
                          blockId: selectedBlockForEditor!,
                          columnIndex: selectedColumnIndex!,
                          side: "right",
                          value: Math.min(Number(e.target.value), 50),
                        }
                      )
                    }
                    type="number"
                    sx={textFieldStyle}
                  />
                </Box>
                <Box sx={inputGroupItemStyle}>
                  <Typography variant="caption">Bottom</Typography>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={currentPadding.bottom}
                    InputProps={{ inputProps: { min: 0, max: 50 } }}
                    onChange={(e) =>
                      dispatchStyleUpdate(
                        () => { },
                        updateColumnPadding,
                        {
                          blockId: selectedBlockForEditor!,
                          columnIndex: selectedColumnIndex!,
                          side: "bottom",
                          value: Math.min(Number(e.target.value), 50),
                        }
                      )
                    }
                    type="number"
                    sx={textFieldStyle}
                  />
                </Box>
              </Box>
            </Box>

          )}

          {isColumnSelected && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
                Alignment
              </Typography>
              <ToggleButtonGroup
                value={currentTextAlign}
                exclusive
                onChange={(_, newAlignment) => {
                  if (newAlignment) {
                    dispatchStyleUpdate(
                      () => { },
                      updateColumnTextAlign,
                      {
                        blockId: selectedBlockForEditor!,
                        columnIndex: selectedColumnIndex!,
                        textAlign: newAlignment,
                      }
                    );
                  }
                }}
                aria-label="text alignment"
                size="small"
                fullWidth
              >
                <ToggleButton value="left" aria-label="left aligned">
                  <FormatAlignLeftIcon />
                </ToggleButton>
                <ToggleButton value="center" aria-label="centered">
                  <FormatAlignCenterIcon />
                </ToggleButton>
                <ToggleButton value="right" aria-label="right aligned">
                  <FormatAlignRightIcon />
                </ToggleButton>
                <ToggleButton value="justify" aria-label="justified">
                  <FormatAlignJustifyIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default LayoutEditorWidget;