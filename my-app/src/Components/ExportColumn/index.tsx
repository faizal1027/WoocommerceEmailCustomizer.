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
} from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store/store";
import { DroppedBlock, setBlocks } from "../../Store/Slice/workspaceSlice";
import { exportToHTML, exportToJSON, ExportDialogModal } from "../utils/Export";
import { importTemplate, importFromText } from "../utils/import";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { EMAIL_TYPES } from "../../Constants/emailTypes";


interface Template {
  id: string;
  email_template_name: string;
  json_data: string;
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
      // Use loose equality (==) to handle string vs number ID mismatches
      const template = templates.find((t: any) => t.id == currentTemplateId);


      if (template && template.json_data) {
        try {
          // Parse JSON if it's a string, or use directly if it's already an object (though usually string from DB)
          const parsedBlocks: DroppedBlock[] = typeof template.json_data === 'string'
            ? JSON.parse(template.json_data)
            : template.json_data;

          dispatch(setBlocks(parsedBlocks));
          setSelectedTemplateId(template.id);

          // Also verify template description or name updates if needed
          setTemplateName(template.email_template_name);
        } catch (e) {
        }
      }
    }
  }, [currentTemplateId, templates, dispatch, isEditMode]);


  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);

    // Robust check for Edit Mode: Only strictly "Edit Mode" if ID is in the URL.
    // This prevents accidental content replacement on the "Add New" page.
    const urlParams = new URLSearchParams(window.location.search);
    const isEditModeByUrl = !!urlParams.get('id');

    const selectedTemplate = templates.find((template) => template.id == templateId);
    if (selectedTemplate) {
      try {
        // Update base name for future increments if starting new
        const baseName = selectedTemplate.email_template_name.replace(/ \d+$/, '').trim();
        setSelectedBaseTemplateName(baseName);

        if (isEditModeByUrl) {
          // In Edit mode (URL has ID), we load the content
          if (selectedTemplate.json_data) {
            const parsedBlocks: DroppedBlock[] = typeof selectedTemplate.json_data === 'string'
              ? JSON.parse(selectedTemplate.json_data)
              : selectedTemplate.json_data;

            dispatch(setBlocks(parsedBlocks));
          }
          setCurrentTemplateId(templateId);
          setTemplateName(selectedTemplate.email_template_name);
          showSnackbar(`Loaded template: ${selectedTemplate.email_template_name}`, 'success');
        } else {
          // In Add New mode (no ID in URL), we ONLY update the title/type
          const nextName = generateIncrementedName(baseName);
          setTemplateName(nextName);
        }
      } catch (parseError: any) {
        console.error("Error updating template selection:", parseError);
        showSnackbar(`Error updating selection: ${parseError.message}`, 'error');
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
              let recipient = window.emailTemplateAjax.admin_email || 'Admin'; // Default to actual admin email

              // Try to find the email type info to set correct recipient and content_type
              const baseNameForLookup = isEditMode ? templateName.replace(/ \d+$/, '').trim() : selectedBaseTemplateName;

              let typeInfo = EMAIL_TYPES.find(t => t.name === baseNameForLookup || t.name === selectedBaseTemplateName || (isEditMode && t.name === templateName));

              // Fallback: Fuzzy match logic for legacy names that might not exactly match EMAIL_TYPES.name
              if (!typeInfo) {
                const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '').replace('template', '');
                const currentNormalized = normalize(baseNameForLookup);
                typeInfo = EMAIL_TYPES.find(t => normalize(t.name) === currentNormalized);
              }


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
              formData.append("json_data", JSON.stringify(blocks));
              formData.append("html_content", htmlContent);

              // Use the readable name OR slug for categorization
              // If user preferred names in the table, we use typeInfo.name or the base name
              const contentTypeToSend = typeInfo ? typeInfo.name : baseNameForLookup;
              formData.append("content_type", contentTypeToSend);

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

                // If created new, switch to edit mode for the new template ?? 
                // Or just stay here? User didn't specify, but usually you'd want to keep editing what you just saved.
                // However, the user flow implies they might want to create multiple copies. 
                // For now, let's just refresh the list.

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
                  setCurrentTemplateId(response.data.data.template_id);
                  setIsEditMode(true);
                  // Also fix the template name in state to match what was saved (with increments)
                  setTemplateName(finalTemplateName);
                  // Set the selected ID in proper format so dropdown matches
                  setSelectedTemplateId(String(response.data.data.template_id));
                }

                // If it was a new template, optionally redirect or update state to prevent creating "Template 1 1" on next click
                // But the user workflow suggests "if i created new order admin template it should b saved as new order admin template 1".
                // If they click save AGAIN without changing name, logic suggests it might create "Template 1 1" if we don't switch to edit mode.
                // But if we switch to edit mode, we replace "Adding New".
                // Let's rely on the fact that if they stay in "Add New" mode, they can keep creating copies.

              } else {
                showSnackbar(`Save failed: ${response.data.data?.message || 'Unknown error'}`, 'error');
              }
            } catch (error: any) {
              console.error("Save error:", error);
              showSnackbar(`Save error: ${error.message}`, 'error');
            }
          }}
          disabled={!templateName.trim() || blocks.length === 0}
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

      {/* Email Type */}
      <Typography sx={{ fontSize: "14px", mt: 1 }}>Email type</Typography>
      <Select
        size="small"
        fullWidth
        displayEmpty
        value={selectedTemplateId}
        onChange={(e) => handleTemplateSelect(e.target.value as string)}
        onOpen={() => { }}
        MenuProps={{
          disablePortal: false,
          sx: { zIndex: 1300001 }, // Higher than typical highest z-index (1300 is MUI modal)
          style: { zIndex: 1300001 }
        }}
        sx={{ fontSize: "14px" }}
      >
        <MenuItem value="" disabled>
          Select Email Type
        </MenuItem>
        {templates.map((template) => (
          <MenuItem key={template.id} value={template.id}>
            {template.email_template_name}
          </MenuItem>
        ))}
      </Select>

      {/* Title */}
      <Typography sx={{ fontSize: "14px" }}>Title</Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Template Name"
        variant="outlined"
        value={templateName}
        onChange={(e) => setTemplateName(e.target.value)}
      />

      {/* Description */}
      <Typography sx={{ fontSize: "14px" }}>Description</Typography>
      <TextField
        fullWidth
        multiline
        minRows={4}
        placeholder="Template Description"
        variant="outlined"
        value={templateDescription}
        onChange={(e) => setTemplateDescription(e.target.value)}
      />

      {/* Email Address */}
      <Typography sx={{ fontSize: "14px" }}>Email address for test</Typography>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          size="small"
          placeholder="Enter email"
          fullWidth
          variant="outlined"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendTestEmail}
          disabled={isSending}
          sx={{
            padding: "8px 14px",
            textTransform: "none",
            fontSize: "11px",
          }}
        >
          {isSending ? "Sending..." : "Send"}
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />


      {/* ====== EXPORT/IMPORT SECTION ====== */}
      <Box>
        <Typography sx={{ fontWeight: "bold", fontSize: "16px", mb: 1.5 }}>
          Export/Import
        </Typography>

        {/* Export and Import buttons side by side */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          {/* Import Button */}
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={openImportDialog}
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
      </Box>

      {/* Export Dialog Modal */}
      <ExportDialogModal
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        onExport={generateExport}
        content={exportContent}
        format={selectedExportFormat}
      />
    </Box>
  );
};

export default ExportColumn; 