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
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import { SocialIconInsertSelect } from "../../../../utils/SocialIconInsertSelect";
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

  const handleSocialIconSelect = (iconHtml: string) => {
    if (editorInstance) {
      // CKEditor 5 HTML insertion
      const viewFragment = editorInstance.data.processor.toView(iconHtml);
      const modelFragment = editorInstance.data.toModel(viewFragment);
      editorInstance.model.insertContent(modelFragment, editorInstance.model.document.selection);
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
    <Box sx={{ bgcolor: '#f9f9f9', height: '100%' }}>
      {/* Editor Header */}
      <Box sx={{ p: '15px 20px', bgcolor: '#fff', borderBottom: '1px solid #e7e9eb' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#495157' }}>Text</Typography>
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
          Customize text content and style.
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
            <Box className="ck-content">
              {/* Shortcodes Row */}
              <Box mb={2}>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Shortcodes</Typography>
                <PlaceholderSelect onSelect={handlePlaceholderSelect} />
              </Box>

              {/* Icons Row */}
              <Box mb={2} display="flex" gap={2}>
                <Box flex={1}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Normal</Typography>
                  <IconInsertSelect onSelect={handleIconSelect} label="" />
                </Box>
                <Box flex={1}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Social</Typography>
                  <SocialIconInsertSelect onSelect={handleSocialIconSelect} label="" />
                </Box>
              </Box>

              <div ref={editorRef} />
              <Box mt={1.5}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setLinkDialogOpen(true)}
                  startIcon={<span>🔗</span>}
                  fullWidth
                  sx={{ borderColor: '#d5dadf', color: '#6d7882', textTransform: 'none', fontSize: '12px', '&:hover': { borderColor: '#a4afb7', bgcolor: '#f9f9f9' } }}
                >
                  INSERT LINK
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Typography Section */}
        <Accordion defaultExpanded disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Typography</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Font Family</Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={fontFamily === 'inherit' || !fontFamily ? 'global' : (FONT_FAMILIES.includes(fontFamily) ? fontFamily : 'global')}
                    onChange={(e) => debouncedUpdate({ fontFamily: e.target.value === 'global' ? '' : e.target.value })}
                    sx={{ fontSize: '11px', bgcolor: '#f9f9f9' }}
                    MenuProps={{
                      disablePortal: true,
                      sx: { zIndex: 999999 }
                    }}
                  >
                    {FONT_FAMILIES.map((font) => (
                      <MenuItem key={font} value={font === 'Global' ? 'global' : font} sx={{ fontSize: '11px' }}>
                        {font}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Row 2: Font Size & Line Height */}
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Font Size (px)</Typography>
                  <TextField
                    type="number"
                    value={fontSize}
                    onChange={(e) => debouncedUpdate({ fontSize: Number(e.target.value) })}
                    size="small"
                    fullWidth
                    InputProps={{ sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                  />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Line Spacing</Typography>
                  <TextField
                    type="number"
                    value={lineHeight}
                    onChange={(e) => debouncedUpdate({ lineHeight: Number(e.target.value) })}
                    size="small"
                    fullWidth
                    InputProps={{ sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
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
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Alignment</Typography>
                <ToggleButtonGroup
                  value={textAlign}
                  exclusive
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

              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 1 }}>Spacing (Padding)</Typography>
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

      <Dialog
        open={linkDialogOpen}
        onClose={handleLinkDialogClose}
        maxWidth="sm"
        fullWidth
        disablePortal={false}
        sx={{ zIndex: 1300001 }}
      >
        <DialogTitle sx={{ p: 2, fontSize: '16px', fontWeight: 700 }}>Insert Link</DialogTitle>
        <DialogContent sx={{ p: '2px 24px' }}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box>
              <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Link URL</Typography>
              <TextField
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                fullWidth
                placeholder="https://example.com"
                size="small"
                InputProps={{ sx: { fontSize: '11px' } }}
              />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Display Text</Typography>
              <TextField
                value={linkDisplayText}
                onChange={(e) => setLinkDisplayText(e.target.value)}
                fullWidth
                placeholder="Click here"
                size="small"
                InputProps={{ sx: { fontSize: '11px' } }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleLinkDialogClose} sx={{ fontSize: '12px' }}>Cancel</Button>
          <Button onClick={handleLinkDialogSave} variant="contained" sx={{ bgcolor: '#93003c', fontSize: '12px', '&:hover': { bgcolor: '#7a0032' } }}>
            Insert
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};


export default TextWidgetEditor;