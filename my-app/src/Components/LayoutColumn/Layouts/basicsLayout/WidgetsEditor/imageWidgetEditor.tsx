import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Switch,
  FormControlLabel,
  Slider,
  Stack,
  Tooltip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../Store/store";
import {
  closeEditor,
  deleteColumnContent,
  updateImageEditorOptions,
} from "../../../../../Store/Slice/workspaceSlice";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import CropOriginalIcon from "@mui/icons-material/CropOriginal";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import CloseIcon from "@mui/icons-material/Close";

interface ImageWidgetEditorProps {
  blockId: string;
  columnIndex: number;
}

interface PaddingOptions {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

const ImageWidgetEditor: React.FC<ImageWidgetEditorProps> = ({
  blockId,
  columnIndex,
}) => {
  const dispatch = useDispatch();
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex, imageEditorOptions: imageOptions } = useSelector(
    (state: RootState) => state.workspace
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(imageOptions.src);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        dispatch(updateImageEditorOptions({ src: result }));
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrowseImage = () => {
    // Check if wp.media is available
    const wp = (window as any).wp;
    if (wp && wp.media) {
      const mediaFrame = wp.media({
        title: 'Select Image',
        button: {
          text: 'Insert into Email',
        },
        multiple: false,
      });

      mediaFrame.on('select', () => {
        const attachment = mediaFrame.state().get('selection').first().toJSON();
        const imageUrl = attachment.url;
        dispatch(updateImageEditorOptions({ src: imageUrl }));
        setPreviewUrl(imageUrl);
      });

      mediaFrame.open();
    } else {
      alert('WordPress Media Library is not available. Please ensure you are in the WordPress admin area.');
    }
  };

  const handleRemoveImage = () => {
    const placeholder = "https://cdn.tools.unlayer.com/image/placeholder.png";
    setSelectedFile(null);
    setPreviewUrl(placeholder);
    dispatch(updateImageEditorOptions({ src: placeholder }));
  };

  const handleAlignChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlign: "left" | "center" | "right"
  ) => {
    if (newAlign !== null) {
      dispatch(updateImageEditorOptions({ align: newAlign }));
    }
  };

  const handleWidthToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAuto = e.target.checked;
    dispatch(updateImageEditorOptions({
      autoWidth: newAuto,
      width: newAuto ? "100%" : (imageOptions.width && imageOptions.width.endsWith('px') ? imageOptions.width : "300px"),
    }));
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const widthValue = e.target.value;
    dispatch(updateImageEditorOptions({
      width: `${widthValue}px`,
      autoWidth: false,
    }));
  };

  const handleCloseEditor = () => {
    dispatch(closeEditor());
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setPreviewUrl(newUrl);
    dispatch(updateImageEditorOptions({ src: newUrl }));
  };

  const handleAltTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAltText = e.target.value;
    dispatch(updateImageEditorOptions({ altText: newAltText }));
  };

  const handlePaddingChange = (side: keyof PaddingOptions, value: number) => {
    dispatch(updateImageEditorOptions({
      padding: { ...imageOptions.padding, [side]: Math.max(0, value) },
    }));
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

  const currentWidthValue = parseInt(imageOptions.width) || 300;

  return (
    <Box sx={{ bgcolor: '#f9f9f9', height: '100%' }}>
      {/* Editor Header */}
      <Box sx={{ p: '15px 20px', bgcolor: '#fff', borderBottom: '1px solid #e7e9eb' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#495157' }}>Image</Typography>
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
          Upload and customize image.
        </Typography>
      </Box>

      {/* Editor Sections */}
      <Box sx={{ height: 'calc(100% - 70px)', overflowY: 'auto' }}>
        {/* Image Source Section */}
        <Accordion defaultExpanded disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Image</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
            <Stack spacing={2.5}>
              <Box sx={{ border: "1px dashed #ccc", borderRadius: '4px', p: 2, bgcolor: '#f9f9f9', textAlign: 'center' }}>
                {previewUrl && previewUrl !== "https://cdn.tools.unlayer.com/image/placeholder.png" && (
                  <Box display="flex" justifyContent="flex-end" mb={1}>
                    <IconButton onClick={handleRemoveImage} size="small" sx={{ p: 0.5 }}>
                      <DeleteIcon fontSize="small" sx={{ color: '#ff4d4d' }} />
                    </IconButton>
                  </Box>
                )}
                <Box sx={{ mb: 2 }}>
                  <Box
                    component="img"
                    src={previewUrl || imageOptions.src}
                    alt="Preview"
                    sx={{
                      maxWidth: "100%",
                      maxHeight: 120,
                      border: "1px solid #e7e9eb",
                      borderRadius: '4px',
                      objectFit: "contain",
                      bgcolor: 'white'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://cdn.tools.unlayer.com/image/placeholder.png";
                    }}
                  />
                </Box>
                <Stack spacing={1}>
                  <Button
                    component="label"
                    variant="contained"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    size="small"
                    sx={{ bgcolor: '#93003c', '&:hover': { bgcolor: '#7a0032' }, textTransform: 'none', fontSize: '12px' }}
                  >
                    Upload Image
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<CropOriginalIcon />}
                    size="small"
                    onClick={handleBrowseImage}
                    sx={{ color: '#495157', borderColor: '#e7e9eb', '&:hover': { bgcolor: '#f9f9f9', borderColor: '#e7e9eb' }, textTransform: 'none', fontSize: '12px' }}
                  >
                    Browse Media Library
                  </Button>
                </Stack>
              </Box>

              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Image URL</Typography>
                <TextField
                  fullWidth
                  value={imageOptions.src}
                  onChange={handleUrlChange}
                  size="small"
                  placeholder="https://example.com/image.png"
                  InputProps={{
                    sx: { fontSize: '11px', bgcolor: '#f9f9f9' },
                    startAdornment: <CropOriginalIcon fontSize="small" sx={{ mr: 1, color: "#a4afb7" }} />
                  }}
                />
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Settings Section */}
        <Accordion defaultExpanded disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Settings</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
            <Stack spacing={2.5}>
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555' }}>Width</Typography>
                  <FormControlLabel
                    control={<Switch checked={imageOptions.autoWidth} onChange={handleWidthToggle} size="small" color="primary" />}
                    label={<Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555' }}>Auto</Typography>}
                    labelPlacement="start"
                    sx={{ mr: 0 }}
                  />
                </Box>
                {!imageOptions.autoWidth && (
                  <Box mt={1}>
                    <TextField
                      type="number"
                      fullWidth
                      size="small"
                      value={currentWidthValue}
                      onChange={handleWidthChange}
                      inputProps={{ min: 10, step: 5 }}
                      InputProps={{ sx: { fontSize: '11px', bgcolor: '#f9f9f9' }, endAdornment: <Typography sx={{ fontSize: '11px', color: '#a4afb7' }}>PX</Typography> }}
                    />
                  </Box>
                )}
              </Box>

              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Alignment</Typography>
                <ToggleButtonGroup
                  value={imageOptions.align}
                  exclusive
                  onChange={handleAlignChange}
                  fullWidth
                  size="small"
                  sx={{ bgcolor: '#f9f9f9' }}
                >
                  <ToggleButton value="left" sx={{ p: '5px' }}><FormatAlignLeftIcon sx={{ fontSize: '18px' }} /></ToggleButton>
                  <ToggleButton value="center" sx={{ p: '5px' }}><FormatAlignCenterIcon sx={{ fontSize: '18px' }} /></ToggleButton>
                  <ToggleButton value="right" sx={{ p: '5px' }}><FormatAlignRightIcon sx={{ fontSize: '18px' }} /></ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 0.5 }}>Alt Text</Typography>
                <TextField
                  fullWidth
                  value={imageOptions.altText}
                  onChange={handleAltTextChange}
                  size="small"
                  placeholder="Image description"
                  InputProps={{ sx: { fontSize: '11px', bgcolor: '#f9f9f9' } }}
                />
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Advanced Section */}
        <Accordion defaultExpanded disableGutters sx={{ boxShadow: 'none', borderBottom: '1px solid #e7e9eb', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: '18px' }} />} sx={{ minHeight: '40px', '&.Mui-expanded': { minHeight: '40px' }, '& .MuiAccordionSummary-content': { margin: '12px 0' } }}>
            <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#6d7882', textTransform: 'uppercase' }}>Advanced</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 2, bgcolor: '#fff' }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#555', mb: 1 }}>Padding</Typography>
                <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={1}>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>TOP</Typography>
                    <TextField type="number" size="small" fullWidth value={imageOptions.padding.top} onChange={(e) => handlePaddingChange("top", parseInt(e.target.value) || 0)} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>RIGHT</Typography>
                    <TextField type="number" size="small" fullWidth value={imageOptions.padding.right} onChange={(e) => handlePaddingChange("right", parseInt(e.target.value) || 0)} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>BOTTOM</Typography>
                    <TextField type="number" size="small" fullWidth value={imageOptions.padding.bottom} onChange={(e) => handlePaddingChange("bottom", parseInt(e.target.value) || 0)} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '9px', fontWeight: 700, textAlign: 'center', mb: 0.5, color: '#6d7882' }}>LEFT</Typography>
                    <TextField type="number" size="small" fullWidth value={imageOptions.padding.left} onChange={(e) => handlePaddingChange("left", parseInt(e.target.value) || 0)} InputProps={{ sx: { fontSize: '11px', textAlign: 'center', p: 0, bgcolor: '#f9f9f9' } }} />
                  </Box>
                </Box>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default ImageWidgetEditor;