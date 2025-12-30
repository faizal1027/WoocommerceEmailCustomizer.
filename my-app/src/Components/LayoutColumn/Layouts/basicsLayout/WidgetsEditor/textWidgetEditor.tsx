import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Tooltip,
  Stack,
  Divider,
  InputLabel,
} from "@mui/material";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../Store/store";
import {
  deleteColumnContent,
  closeEditor,
  updateWidgetContentData,
} from "../../../../../Store/Slice/workspaceSlice";
// CKEditor is now loaded via CDN in WordPress to avoid bundling conflicts
// No imports needed here for ClassicEditor or plugins
import { PlaceholderSelect } from "../../../../utils/PlaceholderSelect";
import ColorPicker from "../../../../utils/ColorPicker";

const TextWidgetEditor = () => {
  const dispatch = useDispatch();
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex } = useSelector(
    (state: RootState) => state.workspace
  );

  const column = useSelector((state: RootState) => {
    if (selectedBlockForEditor && selectedColumnIndex !== null) {
      const block = state.workspace.blocks.find((block) => block.id === selectedBlockForEditor);
      return block?.columns[selectedColumnIndex];
    }
    return null;
  });

  const widgetContent = column?.widgetContents[selectedWidgetIndex || 0] || null;

  // Stable calculation of options
  const textEditorOptions = useMemo(() => {
    if (widgetContent?.contentData) {
      try {
        return JSON.parse(widgetContent.contentData);
      } catch (e) {
        console.error("Failed to parse widget content data", e);
      }
    }
    return {
      fontFamily: "global",
      fontSize: 14,
      fontWeight: 'normal',
      fontStyle: 'normal',
      color: "#d32f2f",
      backgroundColor: "transparent",
      textAlign: "left",
      lineHeight: 140,
      letterSpace: 1,
      padding: { top: 0, left: 0, right: 0, bottom: 0 },
      content: "<p>Click to edit text</p>",
    };
  }, [widgetContent?.contentData]);

  const {
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    color,
    textAlign,
    lineHeight,
    letterSpace,
    padding = { top: 0, left: 0, right: 0, bottom: 0 },
    backgroundColor,
    content,
  } = textEditorOptions;

  const [editorContent, setEditorContent] = useState(content);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitializingRef = useRef(false);

  const optionsRef = useRef(textEditorOptions);
  useEffect(() => {
    optionsRef.current = textEditorOptions;
  }, [textEditorOptions]);

  useEffect(() => {
    setEditorContent(content);
    if (editorInstance && editorInstance.getData() !== content) {
      editorInstance.setData(content || "");
    }
  }, [content, editorInstance]);

  // Handle Editor Initialization from Global CDN Object
  useEffect(() => {
    const GlobalClassicEditor = (window as any).ClassicEditor;
    if (!GlobalClassicEditor || !editorRef.current || isInitializingRef.current || editorInstance) {
      return;
    }

    isInitializingRef.current = true;

    GlobalClassicEditor.create(editorRef.current, {
      toolbar: ["heading", "|", "bold", "italic", "underline", "|", "link", "bulletedList", "numberedList", "|", "undo", "redo"],
    })
      .then((editor: any) => {
        setEditorInstance(editor);
        editor.setData(optionsRef.current.content || "");

        editor.model.document.on('change:data', () => {
          const data = editor.getData();
          setEditorContent(data);
          debouncedUpdate({ content: data });
        });
      })
      .catch((error: any) => {
        console.error("CKEditor CDN Initialization Failed:", error);
      })
      .finally(() => {
        isInitializingRef.current = false;
      });

    return () => {
      if (editorInstance) {
        editorInstance.destroy().catch((err: any) => console.error("Editor destroy error", err));
      }
    };
  }, [editorRef.current]);

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

  const updateData = useCallback((newData: any) => {
    if (selectedBlockForEditor && selectedColumnIndex !== null && selectedWidgetIndex !== null) {
      const updatedData = { ...optionsRef.current, ...newData };
      dispatch(
        updateWidgetContentData({
          blockId: selectedBlockForEditor,
          columnIndex: selectedColumnIndex,
          widgetIndex: selectedWidgetIndex,
          data: JSON.stringify(updatedData),
        })
      );
    }
  }, [dispatch, selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex]);

  const debouncedUpdate = useMemo(() => {
    let timeoutId: any;
    return (newData: any) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => updateData(newData), 50);
    };
  }, [updateData]);

  const handlePaddingChange = (side: "top" | "left" | "right" | "bottom", value: number) => {
    debouncedUpdate({ padding: { ...padding, [side]: value } });
  };

  const handlePlaceholderSelect = (placeholder: string) => {
    if (editorInstance) {
      editorInstance.model.change((writer: any) => {
        const insertPosition = editorInstance.model.document.selection.getFirstPosition();
        writer.insertText(placeholder, insertPosition);
      });
    }
  };

  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorContent(data);
    debouncedUpdate({ content: data });
  };


  return (
    <Box p={2}>
      <Stack spacing={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">Text</Typography>
            <Typography variant="body2" color="textSecondary">
              Customize text content and style.
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
            Content
          </Typography>
          <Box className="ck-content">
            <Box mb={2}>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Shortcodes
              </Typography>
              <PlaceholderSelect onSelect={handlePlaceholderSelect} />
            </Box>
            <div ref={editorRef} />
          </Box>
        </Box>

        <Divider />

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
                  onChange={(e) => debouncedUpdate({ fontFamily: e.target.value })}
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


            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Alignment
              </Typography>
              <ToggleButtonGroup
                value={textAlign}
                exclusive
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

export default TextWidgetEditor;