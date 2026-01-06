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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
  updateTextEditorOptions,
} from "../../../../../Store/Slice/workspaceSlice";

// No imports needed here for ClassicEditor or plugins
import { PlaceholderSelect } from "../../../../utils/PlaceholderSelect";
import { IconInsertSelect } from "../../../../utils/IconInsertSelect";
import ColorPicker from "../../../../utils/ColorPicker";
import { TextEditorOptions } from "../../../../../Store/Slice/workspaceSlice";
import { FONT_FAMILIES } from "../../../../../Constants/StyleConstants";

const TextWidgetEditor = () => {
  const dispatch = useDispatch();
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex, textEditorOptions } = useSelector(
    (state: RootState) => state.workspace
  );

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

  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkDisplayText, setLinkDisplayText] = useState('');

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
    let intervalId: any;

    const initEditor = () => {
      const GlobalClassicEditor = (window as any).ClassicEditor;
      if (!GlobalClassicEditor || !editorRef.current || isInitializingRef.current || editorInstance) {
        return;
      }

      isInitializingRef.current = true;

      GlobalClassicEditor.create(editorRef.current, {
        toolbar: {
          items: ["heading", "|", "bold", "italic", "link", "bulletedList", "numberedList", "|", "undo", "redo"],
          shouldNotGroupWhenFull: false
        }
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
    };

    // Check immediately
    initEditor();

    // Poll if not found
    if (!(window as any).ClassicEditor) {
      intervalId = setInterval(() => {
        if ((window as any).ClassicEditor) {
          initEditor();
          clearInterval(intervalId);
        }
      }, 500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
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

  const updateData = useCallback((newData: Partial<TextEditorOptions>) => {
    dispatch(updateTextEditorOptions(newData));
  }, [dispatch]);

  const debouncedUpdate = useMemo(() => {
    let timeoutId: any;
    return (newData: Partial<TextEditorOptions>) => {
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

  const handleIconSelect = (icon: string) => {
    if (editorInstance) {
      editorInstance.model.change((writer: any) => {
        const insertPosition = editorInstance.model.document.selection.getFirstPosition();
        writer.insertText(icon + ' ', insertPosition);
      });
    }
  };

  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorContent(data);
    debouncedUpdate({ content: data });
  };

  const handleLinkDialogSave = () => {
    if (editorInstance && linkUrl && linkDisplayText) {
      // Get current content
      const currentContent = editorInstance.getData();

      // Create link HTML
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkDisplayText}</a>`;

      // Append link to current content
      editorInstance.setData(currentContent + ' ' + linkHtml + ' ');
    }
    setLinkDialogOpen(false);
    setLinkUrl('');
    setLinkDisplayText('');
  };

  const handleLinkDialogClose = () => {
    setLinkDialogOpen(false);
    setLinkUrl('');
    setLinkDisplayText('');
  };


  return (
    <>
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
              <Box mb={2} display="flex" gap={1}>
                <Box flex={1}>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                    Shortcodes
                  </Typography>
                  <PlaceholderSelect onSelect={handlePlaceholderSelect} />
                </Box>
                <Box flex={1}>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                    Icon
                  </Typography>
                  <IconInsertSelect onSelect={handleIconSelect} />
                </Box>
              </Box>
              <div ref={editorRef} />
              <Box mt={1}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setLinkDialogOpen(true)}
                  startIcon={<span>🔗</span>}
                >
                  Insert Link
                </Button>
              </Box>
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
                    value={fontFamily === 'inherit' || !fontFamily ? 'global' : (FONT_FAMILIES.includes(fontFamily) ? fontFamily : 'global')}
                    onChange={(e) => debouncedUpdate({ fontFamily: e.target.value === 'global' ? '' : e.target.value })}
                    MenuProps={{
                      disablePortal: false,
                      sx: { zIndex: 1300001 },
                      style: { zIndex: 1300001 }
                    }}
                  >
                    {FONT_FAMILIES.map((font) => (
                      <MenuItem key={font} value={font === 'Global' ? 'global' : font}>
                        {font}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Row 2: Font Size & Line Height */}
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <Box>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                    Font Size (px)
                  </Typography>
                  <TextField
                    type="number"
                    value={fontSize}
                    onChange={(e) => debouncedUpdate({ fontSize: Number(e.target.value) })}
                    size="small"
                    fullWidth
                  />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                    Line Spacing
                  </Typography>
                  <TextField
                    type="number"
                    value={lineHeight}
                    onChange={(e) => debouncedUpdate({ lineHeight: Number(e.target.value) })}
                    size="small"
                    fullWidth
                  />
                </Box>
              </Box>

              {/* Row 3: Colors */}
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

      <Dialog
        open={linkDialogOpen}
        onClose={handleLinkDialogClose}
        maxWidth="sm"
        fullWidth
        disablePortal={false}
        sx={{ zIndex: 1300001 }}
      >
        <DialogTitle>Insert Link</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Link URL
              </Typography>
              <TextField
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                fullWidth
                placeholder="https://example.com"
                size="small"
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Display Text
              </Typography>
              <TextField
                value={linkDisplayText}
                onChange={(e) => setLinkDisplayText(e.target.value)}
                fullWidth
                placeholder="Click here"
                size="small"
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLinkDialogClose}>Cancel</Button>
          <Button onClick={handleLinkDialogSave} variant="contained" color="primary">
            Insert
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};


export default TextWidgetEditor;