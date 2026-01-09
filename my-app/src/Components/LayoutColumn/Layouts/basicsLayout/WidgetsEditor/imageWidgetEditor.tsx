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
} from "@mui/material";
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

interface ImageEditorOptions {
  src: string;
  altText: string;
  width: string;
  align: "left" | "center" | "right";
  autoWidth: boolean;
  padding: PaddingOptions;
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
    <Box sx={{ p: 2 }}>
      <Stack spacing={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h6">
              Image
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Upload and customize image.
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

        {/* Section: Image Source */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Image Source
          </Typography>
          <Stack spacing={2}>
            {/* Upload Image Section */}
            <Box sx={{ border: "1px dashed #ccc", borderRadius: 2, p: 2, bgcolor: '#fafafa' }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', color: '#666', fontWeight: 'bold' }}>
                  Upload Preview
                </Typography>
                {previewUrl &&
                  previewUrl !==
                  "https://cdn.tools.unlayer.com/image/placeholder.png" && (
                    <IconButton onClick={handleRemoveImage} size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
              </Box>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Box
                  component="img"
                  src={previewUrl || imageOptions.src}
                  alt="Preview"
                  sx={{
                    maxWidth: "100%",
                    maxHeight: 150,
                    border: "1px solid #eee",
                    borderRadius: 1,
                    objectFit: "contain",
                    bgcolor: 'white'
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://cdn.tools.unlayer.com/image/placeholder.png";
                  }}
                />
              </Box>
              <Button
                component="label"
                variant="outlined"
                fullWidth
                startIcon={<CloudUploadIcon />}
                size="small"
                sx={{ mb: 1, border: '1px solid #ccc', bgcolor: 'white', color: 'text.primary' }}
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<CropOriginalIcon />}
                size="small"
                onClick={handleBrowseImage}
                sx={{ border: '1px solid #ccc', bgcolor: 'white', color: 'text.primary' }}
              >
                Browse Media Library
              </Button>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Image URL
              </Typography>
              <TextField
                fullWidth
                value={imageOptions.src}
                onChange={handleUrlChange}
                variant="outlined"
                size="small"
                placeholder="https://example.com/image.png"
                InputProps={{
                  startAdornment: (
                    <CropOriginalIcon
                      fontSize="small"
                      sx={{ mr: 1, color: "action.active" }}
                    />
                  ),
                }}
              />
            </Box>
          </Stack>
        </Box>

        <Divider />

        {/* Section: Settings */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Settings
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', color: '#666' }}>
                  Width
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={imageOptions.autoWidth}
                      onChange={handleWidthToggle}
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">Auto</Typography>}
                  labelPlacement="start"
                  sx={{ mr: 0, m: 0 }}
                />
              </Stack>
              {!imageOptions.autoWidth && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                    Width (px)
                  </Typography>
                  <TextField
                    type="number"
                    fullWidth
                    size="small"
                    value={currentWidthValue}
                    onChange={handleWidthChange}
                    inputProps={{ min: 10, step: 5 }}
                  />
                </Box>
              )}
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Alignment
              </Typography>
              <ToggleButtonGroup
                value={imageOptions.align}
                exclusive
                onChange={handleAlignChange}
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

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Alt Text
              </Typography>
              <TextField
                fullWidth
                value={imageOptions.altText}
                onChange={handleAltTextChange}
                variant="outlined"
                size="small"
                placeholder="Image description"
              />
            </Box>
          </Stack>
        </Box>

        <Divider />

        {/* Padding */}
        <Box pb={2}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Padding
          </Typography>
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Top
              </Typography>
              <TextField
                type="number"
                value={imageOptions.padding.top}
                onChange={(e) => handlePaddingChange("top", parseInt(e.target.value) || 0)}
                size="small"
                fullWidth
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Bottom
              </Typography>
              <TextField
                type="number"
                value={imageOptions.padding.bottom}
                onChange={(e) => handlePaddingChange("bottom", parseInt(e.target.value) || 0)}
                size="small"
                fullWidth
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Left
              </Typography>
              <TextField
                type="number"
                value={imageOptions.padding.left}
                onChange={(e) => handlePaddingChange("left", parseInt(e.target.value) || 0)}
                size="small"
                fullWidth
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Right
              </Typography>
              <TextField
                type="number"
                value={imageOptions.padding.right}
                onChange={(e) => handlePaddingChange("right", parseInt(e.target.value) || 0)}
                size="small"
                fullWidth
              />
            </Box>
          </Box>
        </Box>

      </Stack>
    </Box>
  );
};

export default ImageWidgetEditor;