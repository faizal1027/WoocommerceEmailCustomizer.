import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  TextareaAutosize,
  ListSubheader,
} from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { DroppedBlock, setBlocks } from "../../Store/Slice/workspaceSlice";
import { exportToHTML, exportToJSON, ExportDialogModal } from "../utils/Export";
import { importTemplate, importFromText, convertToDroppedBlocks } from "../utils/import";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { EMAIL_TYPES } from "../../Constants/emailTypes";


interface Template {
  id: string;
  email_template_name: string;
  json_data: string;
  content_type: string;
  priority?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`import-tabpanel-${index}`}
      aria-labelledby={`import-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}



const ExportColumn = () => {
  const dispatch = useDispatch();
  const { blocks } = useSelector((state: RootState) => state.workspace);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [currentTemplateId, setCurrentTemplateId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedBaseTemplateName, setSelectedBaseTemplateName] = useState<string>("");


  // ==== STATES ====
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [priority, setPriority] = useState<number>(0);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportContent, setExportContent] = useState('');
  const [selectedExportFormat, setSelectedExportFormat] = useState<'html' | 'json'>('html');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [jsonText, setJsonText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchEmailTemplateNames = async () => {
      if (!window.emailTemplateAjax) {
        console.error("emailTemplateAjax is undefined");
        return;
      }

      try {
        const formData = new URLSearchParams();
        formData.append("action", "get_email_template_names");
        formData.append("_ajax_nonce", window.emailTemplateAjax.nonce);

        const response = await axios.post(
          window.emailTemplateAjax.ajax_url,
          formData,
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );


        if (response.data.success && response.data.data?.templates) {
          setTemplates(response.data.data.templates);

          // Check if we're editing an existing template or adding new
          const urlParams = new URLSearchParams(window.location.search);
          const templateId = urlParams.get('id');

          if (templateId) {
            // Edit mode - load existing template
            setCurrentTemplateId(templateId);
            setIsEditMode(true);
            // Find and set the template name
            const template = response.data.data.templates.find((t: any) => t.id == templateId);
            if (template) {
              setTemplateName(template.email_template_name || '');
              setPriority(template.priority ? parseInt(template.priority, 10) : 0);
            }
          } else {
            // Add New mode - start fresh
            setIsEditMode(false);
            setCurrentTemplateId(null);
            dispatch(setBlocks([])); // Clear canvas
            setTemplateName(''); // Clear template name
          }
        } else {
          const errorMsg = response.data?.data?.message || "Invalid response format";
          console.error("Error:", errorMsg);
        }
      } catch (error: any) {
        console.error("AJAX Error:", error.message || error);
      }
    };

    fetchEmailTemplateNames();
  }, [dispatch]);

  // Effect to load content when currentTemplateId or templates change (ONLY in Edit mode)
  useEffect(() => {
    if (isEditMode && currentTemplateId && templates.length > 0) {
      const template = templates.find((t: any) => t.id == currentTemplateId);

      if (template && template.json_data) {
        try {
          // Sync with content_type from DB so dropdown matches
          if (template.content_type) {
            // Find by name OR slug to handle legacy data
            const matchedType = EMAIL_TYPES.find(t =>
              t.name === template.content_type || t.type === template.content_type
            );
            setSelectedTemplateId(matchedType ? matchedType.name : template.content_type);
          }

          const rawBlocks = typeof template.json_data === 'string'
            ? JSON.parse(template.json_data)
            : template.json_data;

          const parsedBlocks = convertToDroppedBlocks(rawBlocks, { regenerateIds: false });

          dispatch(setBlocks(parsedBlocks));
          setTemplateName(template.email_template_name);
          setPriority(template.priority ? parseInt(template.priority, 10) : 0);
        } catch (e) {
          console.error("Error parsing template JSON:", e);
        }
      }
    }
  }, [currentTemplateId, templates, dispatch, isEditMode]);


  const handleTemplateSelect = (templateIdOrName: string) => {
    // Note: templateIdOrName here is now the NAME (e.g. 'New order (Admin)')
    setSelectedTemplateId(templateIdOrName);

    // Verify Edit Mode to prevent accidental content replacement
    const urlParams = new URLSearchParams(window.location.search);
    const isEditModeByUrl = !!urlParams.get('id');

    // Check if it's a base email type name
    const typeInfo = EMAIL_TYPES.find(t => t.name === templateIdOrName);
    if (typeInfo) {
      if (!isEditModeByUrl) {
        // User is picking a starting type in "Add New" mode
        setTemplateName(typeInfo.name);
        setSelectedBaseTemplateName(typeInfo.name);
      } else {
        // In edit mode, we are re-assigning the type of the current template
        setSelectedBaseTemplateName(typeInfo.name);
      }
      return;
    }

    // Default template (empty value)
    if (templateIdOrName === "") {
      setSelectedBaseTemplateName("");
      if (!isEditModeByUrl) {
        setTemplateName("");
      }
    }
  };

  // ==== EXPORT FUNCTION ====
  const generateExport = (format: 'html' | 'json') => {
    if (blocks.length === 0) {
      showSnackbar("No content to export. Add some blocks first.", 'warning');
      return;
    }

    try {
      let content: string;

      if (format === "json") {
        content = exportToJSON(blocks, {
          templateName: templateName || "Email Template",
          templateDescription: templateDescription || "",
          generateIds: true,
          validate: true
        });
      } else {
        content = exportToHTML(blocks, {
          templateName: templateName || "Email Template",
          templateDescription: templateDescription || "",
          minify: false,
          generateIds: true,
          responsive: true
        });
      }

      setExportContent(content);
      setSelectedExportFormat(format);
      setExportDialogOpen(true);

    } catch (error: any) {
      console.error("Export failed:", error);
      showSnackbar(`Export failed: ${error.message}`, 'error');
    }
  };

  // ==== IMPORT FUNCTIONS ====
  const openImportDialog = () => {
    setImportDialogOpen(true);
    setJsonText("");
    setTabValue(0);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    try {
      const result = await importTemplate(file, {
        validateSchema: true,
        regenerateIds: true,
        allowPartial: false
      });

      if (result.success && result.data) {
        dispatch(setBlocks(result.data));
        setTemplateName(file.name.replace('.json', ''));
        setImportDialogOpen(false);

        // Show warnings if any
        if (result.warnings && result.warnings.length > 0) {
          showSnackbar(
            `Imported ${result.fileName} with warnings: ${result.warnings.join(', ')}`,
            'warning'
          );
        } else {
          showSnackbar(`Successfully imported: ${result.fileName}`, 'success');
        }
      } else {
        showSnackbar(`Import failed: ${result.error}`, 'error');
      }
    } catch (error: any) {
      showSnackbar(`Import error: ${error.message}`, 'error');
    }
  };

  const handleImportFromText = async () => {
    if (!jsonText.trim()) {
      showSnackbar("Please enter JSON code", 'warning');
      return;
    }

    try {
      const result = importFromText(jsonText, {
        validateSchema: true,
        regenerateIds: true,
        allowPartial: false
      });

      if (result.success && result.data) {
        dispatch(setBlocks(result.data));
        setTemplateName("Imported Template");
        setImportDialogOpen(false);

        // Show warnings if any
        if (result.warnings && result.warnings.length > 0) {
          showSnackbar(
            `Imported with warnings: ${result.warnings.join(', ')}`,
            'warning'
          );
        } else {
          showSnackbar("Successfully imported from JSON text", 'success');
        }
      } else {
        showSnackbar(`Import failed: ${result.error}`, 'error');
      }
    } catch (error: any) {
      showSnackbar(`Import error: ${error.message}`, 'error');
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setJsonText(clipboardText);
      showSnackbar("Pasted from clipboard", 'info');
    } catch (error) {
      showSnackbar("Could not access clipboard. Please paste manually.", 'error');
    }
  };

  // ==== SNACKBAR HELPER ====
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const [testEmail, setTestEmail] = useState("");

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      showSnackbar("Please enter an email address", "warning");
      return;
    }

    setIsSending(true);

    // Export current blocks to HTML
    let htmlContent = "";
    try {
      // Generate HTML directly
      htmlContent = exportToHTML(blocks, {
        templateName: templateName || "Test Template",
        templateDescription: templateDescription || ""
      });
    } catch (e) {
      console.error("HTML Generation failed", e);
      showSnackbar("Failed to generate HTML", "error");
      setIsSending(false);
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("action", "send_test_email");
      formData.append("_ajax_nonce", window.emailTemplateAjax.nonce);
      formData.append("to_email", testEmail);
      formData.append("html_content", htmlContent);

      const response = await axios.post(
        window.emailTemplateAjax.ajax_url,
        formData,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      if (response.data.success) {
        showSnackbar("Test email sent successfully!", "success");
      } else {
        showSnackbar(response.data.data.message || "Failed to send email", "error");
      }
    } catch (error: any) {
      showSnackbar(`Error: ${error.message}`, "error");
    } finally {
      setIsSending(false);
    }
  };

  // ==== HELPER FUNCTIONS FOR ADD NEW WORKFLOW ====

  // Get unique base template names (remove numbers like " 1", " 2")
  const getUniqueTemplateNames = (): string[] => {
    const baseNames = templates.map(t => {
      // Remove trailing numbers like " 1", " 2", etc.
      return t.email_template_name.replace(/ \d+$/, '').trim();
    });
    // Return unique names
    return Array.from(new Set(baseNames)).sort();
  };

  // Generate incremented name for new templates
  const generateIncrementedName = (baseName: string): string => {
    if (!baseName.trim()) return baseName;

    // Find all templates with this base name
    const existingNames = templates
      .map(t => t.email_template_name)
      .filter(name => name === baseName || name.startsWith(baseName + ' '));

    if (existingNames.length === 0) {
      // No existing templates with this name
      return baseName;
    }

    // Check if exact base name exists
    const exactMatch = existingNames.find(name => name === baseName);
    if (!exactMatch) {
      // Base name doesn't exist, use it
      return baseName;
    }

    // Find the highest number
    let maxNumber = 0;
    existingNames.forEach(name => {
      if (name === baseName) {
        // Exact match counts as 0
        maxNumber = Math.max(maxNumber, 0);
      } else {
        // Extract number from " 1", " 2", etc.
        const match = name.match(/\s(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          maxNumber = Math.max(maxNumber, num);
        }
      }
    });

    // Return base name with next number
    return `${baseName} ${maxNumber + 1}`;
  };

  // ==== EMAIL TEMPLATE FUNCTIONS ====


  return (
    <Box
      sx={{
        height: "100%",
        width: "30%",
        boxShadow: "-4px 0 8px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        padding: "20px",
        gap: 2,
        overflowY: "auto",
      }}
    >
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".json"
        style={{ display: 'none' }}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Import Dialog */}
      <Dialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        maxWidth="md"
        fullWidth
        sx={{ zIndex: 1300001 }}
      >
        <DialogTitle>Import Template</DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Upload File" />
              <Tab label="Paste JSON" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Upload a JSON file exported from this tool
            </Typography>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ py: 2 }}
            >
              Select JSON File
              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
              />
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Supports .json files exported from this tool
            </Typography>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Paste JSON code from an exported template
            </Typography>
            <Box sx={{ position: 'relative' }}>
              <TextareaAutosize
                minRows={15}
                maxRows={20}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder='Paste your JSON code here...'
                style={{
                  width: '100%',
                  padding: '12px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  resize: 'vertical',
                }}
              />
              <Button
                startIcon={<ContentPasteIcon />}
                onClick={handlePasteFromClipboard}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                }}
              >
                Paste
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Paste valid JSON exported from this tool
            </Typography>
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
          {tabValue === 1 && (
            <Button
              onClick={handleImportFromText}
              variant="contained"
              disabled={!jsonText.trim()}
            >
              Import JSON
            </Button>
          )}
        </DialogActions>
      </Dialog>


      {/* Save + Publish Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            if (!templateName.trim()) {
              showSnackbar('Please enter a template name', 'warning');
              return;
            }
            if (blocks.length === 0) {
              showSnackbar('No content to save. Add some blocks first.', 'warning');
              return;
            }

            try {
              // Determine effective template name & Recipient
              let finalTemplateName = templateName;
              // Find type info using the selected NAME for mapping and recipient settings
              const typeInfo = EMAIL_TYPES.find(t => t.name === selectedTemplateId);
              let recipient = window.emailTemplateAjax.admin_email || 'Admin'; // Default to admin email

              if (typeInfo) {
                // If category is admin, use admin email. Else use [CUSTOMER_EMAIL]
                recipient = typeInfo.category === 'admin'
                  ? (window.emailTemplateAjax.admin_email || 'Admin')
                  : '[CUSTOMER_EMAIL]';
              }

              // If we are ADDING NEW (not editing), generate incremented name to avoid duplicates
              if (!isEditMode) {
                finalTemplateName = generateIncrementedName(templateName);
              }

              // Generate HTML content from blocks
              const htmlContent = exportToHTML(blocks, {
                templateName: finalTemplateName,
                templateDescription: templateDescription || "",
                minify: false,
                generateIds: true,
                responsive: true
              });

              const formData = new URLSearchParams();
              formData.append("action", "save_email_template");
              formData.append("_ajax_nonce", window.emailTemplateAjax.nonce);
              formData.append("template_name", finalTemplateName);
              formData.append("priority", String(priority));
              formData.append("json_data", JSON.stringify(blocks));
              formData.append("html_content", htmlContent);

              // Use the SLUG (type) directly from the dropdown state
              formData.append("content_type", selectedTemplateId);

              formData.append("recipient", recipient);

              // ONLY send template_id if we are in EDIT mode
              if (isEditMode && currentTemplateId) {
                formData.append("template_id", currentTemplateId);
              }

              const response = await axios.post(
                window.emailTemplateAjax.ajax_url,
                formData,
                {
                  headers: { "Content-Type": "application/x-www-form-urlencoded" },
                }
              );

              if (response.data.success) {
                const message = isEditMode
                  ? 'Template updated successfully'
                  : `Template created: ${finalTemplateName}`;

                showSnackbar(message, 'success');

                // Refresh the list and update state for the new template

                const fetchResponse = await axios.post(
                  window.emailTemplateAjax.ajax_url,
                  new URLSearchParams({
                    action: "get_email_template_names",
                    _ajax_nonce: window.emailTemplateAjax.nonce
                  }),
                  {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                  }
                );
                if (fetchResponse.data.success && fetchResponse.data.data?.templates) {
                  setTemplates(fetchResponse.data.data.templates);
                }

                if (response.data.data && response.data.data.template_id) {
                  const newId = String(response.data.data.template_id);
                  setCurrentTemplateId(newId);
                  setIsEditMode(true);
                  // Also fix the template name in state to match what was saved (with increments)
                  setTemplateName(finalTemplateName);
                  // Note: selectedTemplateId stays as the NAME so the dropdown matches correctly

                  // CRITICAL: Update URL so refresh/re-refetch doesn't clear blocks
                  const newUrl = new URL(window.location.href);
                  newUrl.searchParams.set('id', newId);
                  window.history.pushState({ id: newId }, '', newUrl.toString());
                }

                // Stay in Add New mode to allow creating multiple copies if needed

              } else {
                showSnackbar(`Save failed: ${response.data.data?.message || 'Unknown error'}`, 'error');
              }
            } catch (error: any) {
              console.error("Save error:", error);
              showSnackbar(`Save error: ${error.message}`, 'error');
            }
          }}
          disabled={isSending}
          sx={{
            fontSize: "14px",
            borderRadius: "3px",
            textTransform: "none",
            width: "48%",
            height: "2.5rem",
            "&:hover": {
              backgroundColor: "transparent",
              color: "primary.main",
              border: "1px solid",
              borderColor: "primary.main",
            },
            "&:disabled": {
              backgroundColor: "#cccccc",
              color: "#666",
            },
          }}
        >
          Save Draft
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{
            fontSize: "14px",
            borderRadius: "3px",
            textTransform: "none",
            width: "48%",
            height: "2.5rem",
            "&:hover": {
              backgroundColor: "transparent",
              color: "primary.main",
              border: "1px solid",
              borderColor: "primary.main",
            },
          }}
        >
          Publish
        </Button>
      </Box>

      <Divider />

      {/* Email Type */}
      <Box sx={{ mt: 1 }}>
        <Typography sx={{ fontSize: "14px", mb: 0.5 }}>Email type</Typography>
        <Select
          size="small"
          fullWidth
          displayEmpty
          value={selectedTemplateId}
          onChange={(e) => handleTemplateSelect(e.target.value as string)}
          MenuProps={{
            disablePortal: true,
            PaperProps: {
              sx: {
                maxHeight: '400px',
                width: 'auto',
                '& .MuiListSubheader-root': {
                  backgroundColor: '#f5f5f5',
                  lineHeight: '32px',
                  fontWeight: 'bold',
                  color: 'primary.main',
                },
              }
            }
          }}
          sx={{ fontSize: "14px" }}
        >
          <MenuItem value="">
            <em>Default template</em>
          </MenuItem>

          <ListSubheader>Admin</ListSubheader>
          {EMAIL_TYPES.filter(t => t.category === 'admin').map((type) => (
            <MenuItem key={type.type} value={type.name} sx={{ pl: 4 }}>
              {type.name}
            </MenuItem>
          ))}

          <ListSubheader>Customer</ListSubheader>
          {EMAIL_TYPES.filter(t => t.category === 'customer').map((type) => (
            <MenuItem key={type.type} value={type.name} sx={{ pl: 4 }}>
              {type.name}
            </MenuItem>
          ))}

          {/* Note: Saved Templates section removed to keep dropdown focused on Categories */}
        </Select>
      </Box>

      {/* Priority */}
      <Box sx={{ mt: 1 }}>
        <Typography sx={{ fontSize: "14px", mb: 0.5 }}>Priority</Typography>
        <TextField
          fullWidth
          size="small"
          type="number"
          value={priority}
          onChange={(e) => setPriority(parseInt(e.target.value) || 0)}
          InputProps={{ inputProps: { min: 0 } }}
          placeholder="0"
          helperText="Higher value means higher priority."
          sx={{ fontSize: "14px" }}
        />
      </Box>

      {/* Title */}
      <Box>
        <Typography sx={{ fontSize: "14px", mb: 0.5 }}>Title</Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Template Name"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
      </Box>

      {/* Description (Compact) */}
      <Box>
        <Typography sx={{ fontSize: "14px", mb: 0.5 }}>Description</Typography>
        <TextField
          fullWidth
          multiline
          minRows={2}
          maxRows={4}
          placeholder="Description"
          value={templateDescription}
          onChange={(e) => setTemplateDescription(e.target.value)}
        />
      </Box>

      {/* Email Address */}
      <Box>
        <Typography sx={{ fontSize: "14px", mb: 0.5 }}>Test Email</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            size="small"
            placeholder="email@example.com"
            fullWidth
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
          <Button
            variant="contained"
            size="small"
            onClick={handleSendTestEmail}
            disabled={isSending}
            sx={{ minWidth: '60px' }}
          >
            {isSending ? "..." : "Send"}
          </Button>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />


      {/* ====== EXPORT SECTION ====== */}
      {/* ====== EXPORT/IMPORT SECTION ====== */}
      <Box>
        <Typography sx={{ fontWeight: "bold", fontSize: "16px", mb: 1.5 }}>
          {isEditMode ? "Export" : "Export/Import"}
        </Typography>

        {isEditMode ? (
          // Edit Mode: Only Export Template (Full Width)
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => setExportDialogOpen(true)}
            disabled={blocks.length === 0}
            fullWidth
            sx={{
              backgroundColor: "#1E5AB6",
              textTransform: "none",
              color: "white",
              fontWeight: "bold",
              fontSize: "14px",
              py: 1.5,
              borderColor: "#1E5AB6",
              "&:hover": {
                backgroundColor: "transparent",
                color: "primary.main",
                border: "1px solid",
                borderColor: "primary.main",
              },
              "&:disabled": {
                backgroundColor: "#cccccc",
                color: "#666",
                borderColor: "#cccccc",
              },
            }}
          >
            Export Template
          </Button>
        ) : (
          // Add New Mode: Import and Export Side-by-Side
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Import Button */}
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={() => fileInputRef.current?.click()}
              fullWidth
              sx={{
                backgroundColor: "#1E5AB6",
                textTransform: "none",
                color: "white",
                fontWeight: "normal",
                fontSize: "14px",
                py: 1.5,
                borderColor: "#ddd",
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "primary.main",
                  border: "1px solid",
                  borderColor: "primary.main",
                },
              }}
            >
              Import
            </Button>

            {/* Export Button */}
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => setExportDialogOpen(true)}
              disabled={blocks.length === 0}
              fullWidth
              sx={{
                backgroundColor: "#1E5AB6",
                textTransform: "none",
                color: "white",
                fontWeight: "bold",
                fontSize: "14px",
                py: 1.5,
                borderColor: "#1E5AB6",
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "primary.main",
                  border: "1px solid",
                  borderColor: "primary.main",
                },
                "&:disabled": {
                  backgroundColor: "#cccccc",
                  color: "#666",
                  borderColor: "#cccccc",
                },
              }}
            >
              Export
            </Button>
          </Box>
        )}
      </Box>

      {/* Export Dialog Modal */}
      <ExportDialogModal
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        onExport={generateExport}
        content={exportContent}
        format={selectedExportFormat}
      />
    </Box >
  );
};

export default ExportColumn; 