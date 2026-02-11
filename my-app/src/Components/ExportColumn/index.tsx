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
import { DroppedBlock, setBlocks, WorkspaceState } from "../../Store/Slice/workspaceSlice";
import { exportToHTML, exportToJSON, ExportDialogModal } from "../utils/Export";
import { importTemplate, importFromText, convertToDroppedBlocks } from "../utils/import";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { EMAIL_TYPES } from "../../Constants/emailTypes";

// Icons & UI
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import PublishIcon from '@mui/icons-material/Publish';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper
} from "@mui/material";


interface Template {
  id: string;
  email_template_name: string;
  json_data: string;
  content_type: string;
  priority?: string;
  status: string;
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
  const { blocks, bodyStyle } = useSelector((state: RootState) => state.workspace) as WorkspaceState;
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
      const typeInfo = EMAIL_TYPES.find(t => t.name === selectedTemplateId);
      const emailType = typeInfo ? typeInfo.type : selectedTemplateId;

      if (format === "json") {
        content = exportToJSON(blocks, {
          templateName: templateName || "Email Template",
          templateDescription: templateDescription || "",
          emailType: emailType,
          priority: priority || 0,
          generateIds: true,
          validate: true
        });
      } else {
        content = exportToHTML(blocks, {
          templateName: templateName || "Email Template",
          templateDescription: templateDescription || "",
          minify: false,
          generateIds: true,
          responsive: true,
          backgroundColor: bodyStyle?.backgroundColor || "#ffffff"
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

        // Restore Metadata
        if (result.templateMeta) {
          setTemplateName(result.templateMeta.name || file.name.replace('.json', ''));
          setTemplateDescription(result.templateMeta.description || "");
          if (result.templateMeta.priority !== undefined) setPriority(result.templateMeta.priority);

          if (result.templateMeta.emailType) {
            const matchedType = EMAIL_TYPES.find(t => t.type === result.templateMeta!.emailType);
            if (matchedType) setSelectedTemplateId(matchedType.name); // Set by Name as UI expects
          }
        } else {
          setTemplateName(file.name.replace('.json', ''));
        }

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

        // Restore Metadata
        if (result.templateMeta) {
          setTemplateName(result.templateMeta.name || "Imported Template");
          setTemplateDescription(result.templateMeta.description || "");
          if (result.templateMeta.priority !== undefined) setPriority(result.templateMeta.priority);

          if (result.templateMeta.emailType) {
            const matchedType = EMAIL_TYPES.find(t => t.type === result.templateMeta!.emailType);
            if (matchedType) setSelectedTemplateId(matchedType.name);
          }
        } else {
          setTemplateName("Imported Template");
        }

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
        templateDescription: templateDescription || "",
        backgroundColor: bodyStyle?.backgroundColor || "#ffffff"
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

  const handleSaveTemplate = async (status: 'publish' | 'draft') => {
    if (!templateName.trim()) {
      showSnackbar('Please enter a template name', 'warning');
      return;
    }
    if (blocks.length === 0) {
      showSnackbar('No content to save. Add some blocks first.', 'warning');
      return;
    }

    setIsSending(true);

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
        responsive: true,
        backgroundColor: bodyStyle?.backgroundColor || "#ffffff"
      });

      const formData = new URLSearchParams();
      formData.append("action", "save_email_template");
      formData.append("_ajax_nonce", window.emailTemplateAjax.nonce);
      formData.append("template_name", finalTemplateName);
      formData.append("priority", String(priority));
      formData.append("json_data", JSON.stringify(blocks));
      formData.append("html_content", htmlContent);
      formData.append("template_status", status);

      // Use the SLUG (type) directly from the dropdown state
      const selectedTypeSlug = typeInfo ? typeInfo.type : selectedTemplateId;
      formData.append("content_type", selectedTypeSlug);

      // Map Description UI field to template_note DB column
      formData.append("template_note", templateDescription || "");
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
        let message = '';
        if (status === 'draft') {
          message = response.data.data.is_new_draft ? 'Published version preserved. New draft created.' : 'Draft saved successfully';
        } else {
          message = isEditMode ? 'Template updated and published!' : `Template published: ${finalTemplateName}`;
        }

        showSnackbar(message, 'success');

        // Refresh the list
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
          setTemplateName(finalTemplateName);

          // Update URL
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('id', newId);
          window.history.pushState({ id: newId }, '', newUrl.toString());
        }
      } else {
        showSnackbar(`Save failed: ${response.data.data?.message || 'Unknown error'}`, 'error');
      }
    } catch (error: any) {
      console.error("Save error:", error);
      showSnackbar(`Save error: ${error.message}`, 'error');
    } finally {
      setIsSending(false);
    }
  };


  // Styles for Accordion to look like Elementor Panel
  const accordionStyle = {
    boxShadow: 'none',
    border: 'none',
    bgcolor: 'transparent',
    '&:before': { display: 'none' },
    '&.Mui-expanded': { margin: 0 },
  };

  const summaryStyle = {
    minHeight: '40px',
    borderBottom: '1px solid #e0e0e0',
    '&.Mui-expanded': { minHeight: '40px', borderBottom: '1px solid #e0e0e0' },
    '& .MuiAccordionSummary-content': { margin: '12px 0' },
  };

  const headerStyle = {
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#6d7882',
  };

  return (
    <Box
      sx={{
        height: "100%", width: "100%",
        display: "flex", flexDirection: "column",
        bgcolor: "#f9f9f9",
        overflow: "hidden"
      }}
    >
      {/* File Input */}
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".json" style={{ display: 'none' }} />

      {/* Header */}
      <Box sx={{ p: 2, bgcolor: "#fff", borderBottom: "1px solid #e0e0e0", display: 'flex', alignItems: 'center', height: '50px', flexShrink: 0 }}>
        <SettingsIcon sx={{ color: '#555', mr: 1 }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '12px', color: '#333' }}>
          Template Settings
        </Typography>
      </Box>

      {/* Scrollable Settings */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 0 }}>

        {/* General Settings */}
        <Accordion defaultExpanded disableGutters sx={accordionStyle}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={summaryStyle}>
            <Typography sx={headerStyle}>General Settings</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2 }}>

            {/* Title */}
            <Typography sx={{ fontSize: "11px", fontWeight: 600, mb: 0.5, color: '#555' }}>Title</Typography>
            <TextField fullWidth size="small" value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="Template Name" sx={{ mb: 2, bgcolor: '#fff' }} InputProps={{ style: { fontSize: '13px' } }} />

            {/* Status Badge (Visual Only) */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
              <Typography sx={{ fontSize: "11px", fontWeight: 600, color: '#555' }}>Status:</Typography>
              <Box sx={{
                bgcolor: isEditMode && templates.find(t => t.id === currentTemplateId)?.status === 'publish' ? '#e6f7eb' : '#fff8e1',
                color: isEditMode && templates.find(t => t.id === currentTemplateId)?.status === 'publish' ? '#008f4c' : '#f57f17',
                fontSize: '10px', fontWeight: 700, px: 1, py: 0.25, borderRadius: '3px', textTransform: 'uppercase', border: '1px solid currentColor'
              }}>
                {isEditMode ? (templates.find(t => t.id === currentTemplateId)?.status || 'Draft') : 'New Draft'}
              </Box>
            </Box>

            {/* Description */}
            <Typography sx={{ fontSize: "11px", fontWeight: 600, mb: 0.5, color: '#555' }}>Description</Typography>
            <TextField fullWidth multiline minRows={3} value={templateDescription} onChange={(e) => setTemplateDescription(e.target.value)} placeholder="Short description..." sx={{ bgcolor: '#fff' }} InputProps={{ style: { fontSize: '13px' } }} />
          </AccordionDetails>
        </Accordion>

        {/* Email Configuration */}
        <Accordion defaultExpanded disableGutters sx={accordionStyle}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={summaryStyle}>
            <Typography sx={headerStyle}>Email Configuration</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2 }}>
            {/* Type */}
            <Typography sx={{ fontSize: "11px", fontWeight: 600, mb: 0.5, color: '#555' }}>Type</Typography>
            <Select
              size="small"
              fullWidth
              displayEmpty
              value={selectedTemplateId}
              onChange={(e) => handleTemplateSelect(e.target.value as string)}
              sx={{ mb: 2, bgcolor: '#fff', fontSize: '13px' }}
              MenuProps={{
                disablePortal: true, // Fix positioning in WP Admin
                PaperProps: {
                  sx: {
                    zIndex: 999999,
                    maxHeight: 400,
                  }
                }
              }}
            >
              <MenuItem value="" sx={{ fontSize: '13px' }}><em>Select Type...</em></MenuItem>
              <ListSubheader sx={{ fontSize: '11px', lineHeight: '24px' }}>Admin</ListSubheader>
              {EMAIL_TYPES.filter(t => t.category === 'admin').map((type) => (
                <MenuItem key={type.type} value={type.name} sx={{ fontSize: '13px', pl: 3 }}>{type.name}</MenuItem>
              ))}
              <ListSubheader sx={{ fontSize: '11px', lineHeight: '24px' }}>Customer</ListSubheader>
              {EMAIL_TYPES.filter(t => t.category === 'customer').map((type) => (
                <MenuItem key={type.type} value={type.name} sx={{ fontSize: '13px', pl: 3 }}>{type.name}</MenuItem>
              ))}
            </Select>

            {/* Priority */}
            <Typography sx={{ fontSize: "11px", fontWeight: 600, mb: 0.5, color: '#555' }}>Priority</Typography>
            <TextField fullWidth size="small" type="number" value={priority} onChange={(e) => setPriority(parseInt(e.target.value) || 0)} sx={{ bgcolor: '#fff' }} InputProps={{ style: { fontSize: '13px' }, inputProps: { min: 0 } }} />
          </AccordionDetails>
        </Accordion>

        {/* Actions */}
        <Accordion disableGutters sx={accordionStyle}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={summaryStyle}>
            <Typography sx={headerStyle}>Actions</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2 }}>
            {/* Test Email */}
            <Typography sx={{ fontSize: "11px", fontWeight: 600, mb: 0.5, color: '#555' }}>Send Test Email</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField fullWidth size="small" placeholder="email@example.com" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} sx={{ bgcolor: '#fff' }} InputProps={{ style: { fontSize: '13px' } }} />
              <Button variant="contained" size="small" onClick={handleSendTestEmail} disabled={isSending} sx={{ minWidth: 'auto', px: 2, bgcolor: '#6d7882', '&:hover': { bgcolor: '#555' } }}>Send</Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Import/Export */}
            <Typography sx={{ fontSize: "11px", fontWeight: 600, mb: 1, color: '#555' }}>Data Management</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button variant="outlined" size="small" startIcon={<CloudUploadIcon />} onClick={() => openImportDialog()} sx={{ flex: 1, fontSize: '12px', borderColor: '#ddd', color: '#555' }}>Import</Button>
              <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={() => setExportDialogOpen(true)} disabled={blocks.length === 0} sx={{ flex: 1, fontSize: '12px', borderColor: '#ddd', color: '#555' }}>Export</Button>
            </Box>
          </AccordionDetails>
        </Accordion>

      </Box>

      {/* Bottom Sticky Area */}
      <Box sx={{ p: 2, bgcolor: "#fff", borderTop: "1px solid #e0e0e0", display: 'flex', gap: 1, flexShrink: 0 }}>
        <Button variant="outlined" onClick={() => handleSaveTemplate('draft')} disabled={isSending} sx={{ flex: 1, borderColor: '#ddd', color: '#6d7882', textTransform: 'uppercase', fontSize: '11px', fontWeight: 600 }}>
          Save Draft
        </Button>
        <Button variant="contained" onClick={() => handleSaveTemplate('publish')} disabled={isSending} sx={{ flex: 1, bgcolor: '#93003c', '&:hover': { bgcolor: '#d32f2f' }, textTransform: 'uppercase', fontSize: '11px', fontWeight: 600 }}>
          {isEditMode && templates.find(t => t.id === currentTemplateId)?.status === 'publish' ? 'Update' : 'Publish'}
        </Button>
      </Box>

      {/* Modals */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} sx={{ zIndex: 9999999 }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>

      <ExportDialogModal open={exportDialogOpen} onClose={() => setExportDialogOpen(false)} onExport={generateExport} content={exportContent} format={selectedExportFormat} />

      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)} maxWidth="md" fullWidth sx={{ zIndex: 9999999 }}>
        <DialogTitle>Import Template</DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Upload File" />
              <Tab label="Paste JSON" />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            <Button variant="contained" component="label" startIcon={<CloudUploadIcon />} fullWidth sx={{ py: 2, mt: 2 }}>
              Select JSON File
              <input type="file" hidden ref={fileInputRef} onChange={handleFileUpload} accept=".json" />
            </Button>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <TextareaAutosize minRows={15} maxRows={20} value={jsonText} onChange={(e) => setJsonText(e.target.value)} placeholder='Paste JSON code...' style={{ width: '100%', padding: '12px', marginTop: '16px', fontFamily: 'monospace' }} />
            <Button onClick={handleImportFromText} variant="contained" disabled={!jsonText.trim()} sx={{ mt: 2 }}>Import JSON</Button>
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default ExportColumn; 