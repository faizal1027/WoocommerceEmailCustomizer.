import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Tooltip,
  Stack,
  Divider,
} from "@mui/material";
import React, { memo } from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import YouTubeIcon from "@mui/icons-material/YouTube";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import RedditIcon from "@mui/icons-material/Reddit";
import MailIcon from "@mui/icons-material/Mail";
import GitHubIcon from "@mui/icons-material/GitHub";
import TelegramIcon from "@mui/icons-material/Telegram";
import DeleteIcon from "@mui/icons-material/Delete";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../Store/store";
import {
  updateWidgetContentData,
  deleteColumnContent,
  closeEditor,
} from "../../../../../Store/Slice/workspaceSlice";

const socialIcons = {
  facebook: { icon: <FacebookIcon />, fallback: "f", color: "#3b5998" },
  twitter: { icon: <TwitterIcon />, fallback: "t", color: "#1DA1F2" },
  linkedin: { icon: <LinkedInIcon />, fallback: "l", color: "#0077B5" },
  instagram: { icon: <InstagramIcon />, fallback: "i", color: "#E1306C" },
  pinterest: { icon: <PinterestIcon />, fallback: "p", color: "#Bd081C" },
  youtube: { icon: <YouTubeIcon />, fallback: "y", color: "#FF0000" },
  whatsapp: { icon: <WhatsAppIcon />, fallback: "w", color: "#25D366" },
  reddit: { icon: <RedditIcon />, fallback: "r", color: "#FF4500" },
  github: { icon: <GitHubIcon />, fallback: "g", color: "#181717" },
  telegram: { icon: <TelegramIcon />, fallback: "t", color: "#0088CC" },
  envelope: { icon: <MailIcon />, fallback: "e", color: "#0072C6" },
} as const;

type SocialIconKey = keyof typeof socialIcons;

const SocialIconsWidgetEditor = memo(() => {
  const dispatch = useDispatch();
  const { selectedBlockForEditor, selectedColumnIndex, selectedWidgetIndex, blocks } = useSelector(
    (state: RootState) => state.workspace
  );
  const column =
    selectedBlockForEditor && selectedColumnIndex !== null
      ? blocks.find((block) => block.id === selectedBlockForEditor)?.columns[selectedColumnIndex]
      : null;
  const widgetContent = column?.widgetContents[selectedWidgetIndex || 0] || null;
  const socialIconsEditorOptions = widgetContent?.contentData
    ? JSON.parse(widgetContent.contentData)
    : {
      padding: { top: 0, left: 0, right: 0, bottom: 0 },
      iconSize: 14,
      iconColor: "#0000",
      iconAlign: "center",
      iconSpace: 1,
      addedIcons: { icons: [], url: [] },
    };

  const { iconAlign, padding, iconColor, iconSize, iconSpace, addedIcons } =
    socialIconsEditorOptions;

  const updateSocialIconsData = (updates: Partial<typeof socialIconsEditorOptions>) => {
    if (selectedBlockForEditor && selectedColumnIndex !== null && selectedWidgetIndex !== null) {
      const updatedData = { ...socialIconsEditorOptions, ...updates };
      dispatch(
        updateWidgetContentData({
          blockId: selectedBlockForEditor,
          columnIndex: selectedColumnIndex,
          widgetIndex: selectedWidgetIndex,
          data: JSON.stringify(updatedData),
        })
      );
    }
  };

  const handleAddIcon = (key: SocialIconKey) => {
    const baseUrl = `https://${key}.com`;
    const isAlreadyAdded = addedIcons.icons.includes(key);
    if (!isAlreadyAdded) {
      updateSocialIconsData({
        addedIcons: {
          icons: [...addedIcons.icons, key],
          url: [...addedIcons.url, baseUrl],
        },
      });
    }
  };

  const handleDeleteIcon = (key: SocialIconKey) => {
    const iconIndex = addedIcons.icons.indexOf(key);
    if (iconIndex !== -1) {
      const newIcons = addedIcons.icons.filter((_: any, i: any) => i !== iconIndex);
      const newUrls = addedIcons.url.filter((_: any, i: any) => i !== iconIndex);
      updateSocialIconsData({
        addedIcons: { icons: newIcons, url: newUrls },
      });
    }
  };

  const handlePaddingChange = (side: "top" | "left" | "right" | "bottom", value: number) => {
    updateSocialIconsData({ padding: { ...padding, [side]: value } });
  };

  const handleUrlChange = (key: SocialIconKey, value: string) => {
    const iconIndex = addedIcons.icons.indexOf(key);
    if (iconIndex !== -1) {
      const newUrls = [...addedIcons.url];
      newUrls[iconIndex] = value;
      updateSocialIconsData({
        addedIcons: { icons: addedIcons.icons, url: newUrls },
      });
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
    } else {
      console.warn("Cannot delete content: No widget selected or invalid state.");
    }
  };


  const handleCloseEditor = () => {
    dispatch(closeEditor());
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
              Social Icons
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Manage social media links.
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

        {/* Added Icons Section */}
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Active Icons
          </Typography>
          {addedIcons.icons.length === 0 && (
            <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
              No icons added. Click icons below to add.
            </Typography>
          )}
          <Stack spacing={2}>
            {addedIcons.icons.map((key: SocialIconKey, index: number) => {
              const { icon } = socialIcons[key];
              return (
                <Box
                  key={key}
                  sx={{ border: "1px solid #ddd", borderRadius: 1, padding: 1.5, bgcolor: '#fafafa' }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center', mb: 1 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {React.cloneElement(icon, {
                        sx: {
                          color: iconColor === "color" ? socialIcons[key].color : iconColor === "black" ? "#000000" : "#0000",
                          width: 24, height: 24
                        },
                      })}
                      <Typography variant="body2" fontWeight="bold">{key.charAt(0).toUpperCase() + key.slice(1)}</Typography>
                    </Box>
                    <IconButton
                      onClick={() => handleDeleteIcon(key)}
                      size="small"
                      sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                      Icon URL
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      value={addedIcons.url[index] || ""}
                      onChange={(e) => handleUrlChange(key, e.target.value)}
                      variant="outlined"
                      sx={{ bgcolor: 'white' }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Box>

        <Divider />

        {/* Available Icons Section */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Add Icons
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {Object.keys(socialIcons)
              .filter((key) => !addedIcons.icons.includes(key as SocialIconKey))
              .map((iconKey) => {
                const iconData = socialIcons[iconKey as SocialIconKey];
                return (
                  <Tooltip title={`Add ${iconKey}`} key={iconKey}>
                    <Box
                      onClick={() => handleAddIcon(iconKey as SocialIconKey)}
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        border: '1px solid #ddd',
                        backgroundColor: "white",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        "&:hover": { bgcolor: '#f5f5f5' },
                        transition: 'all 0.2s',
                      }}
                    >
                      {iconData.icon ? (
                        React.cloneElement(iconData.icon, { sx: { color: iconData.color, width: 20, height: 20 } })
                      ) : (
                        <Typography sx={{ color: iconData.color, fontWeight: 'bold' }}>{iconData.fallback}</Typography>
                      )}
                    </Box>
                  </Tooltip>
                );
              })}
          </Box>
        </Box>

        <Divider />

        {/* Settings Section */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Appearance
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Color Style
              </Typography>
              <FormControl size="small" fullWidth>
                <Select
                  value={iconColor === "color" ? "color" : iconColor === "black" ? "black" : "#0000"}
                  onChange={(e) => updateSocialIconsData({ iconColor: e.target.value as string })}
                  MenuProps={{
                    disablePortal: false,
                    sx: { zIndex: 1300001 },
                    style: { zIndex: 1300001 }
                  }}
                >
                  <MenuItem value="color">Original Color</MenuItem>
                  <MenuItem value="black">Black & White</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Size (px)
              </Typography>
              <TextField
                value={iconSize}
                onChange={(e) => updateSocialIconsData({ iconSize: Number(e.target.value) })}
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                size="small"
                fullWidth
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Icon Spacing (px)
              </Typography>
              <TextField
                value={iconSpace}
                onChange={(e) => updateSocialIconsData({ iconSpace: Number(e.target.value) })}
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                size="small"
                fullWidth
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Alignment
              </Typography>
              <ToggleButtonGroup
                exclusive
                fullWidth
                value={iconAlign}
                onChange={(e, newAlign) => newAlign && updateSocialIconsData({ iconAlign: newAlign as "left" | "center" | "right" })}
                size="small"
              >
                <ToggleButton value="left"><FormatAlignLeftIcon fontSize="small" /></ToggleButton>
                <ToggleButton value="center"><FormatAlignCenterIcon fontSize="small" /></ToggleButton>
                <ToggleButton value="right"><FormatAlignRightIcon fontSize="small" /></ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Stack>
        </Box>

        <Divider />

        {/* padding */}
        <Box pb={2}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Padding
          </Typography>
          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Top
              </Typography>
              <TextField type="number" size="small" value={padding.top} onChange={(e) => handlePaddingChange("top", Number(e.target.value))} fullWidth />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Bottom
              </Typography>
              <TextField type="number" size="small" value={padding.bottom} onChange={(e) => handlePaddingChange("bottom", Number(e.target.value))} fullWidth />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Left
              </Typography>
              <TextField type="number" size="small" value={padding.left} onChange={(e) => handlePaddingChange("left", Number(e.target.value))} fullWidth />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block', mb: 0.5, color: '#666' }}>
                Right
              </Typography>
              <TextField type="number" size="small" value={padding.right} onChange={(e) => handlePaddingChange("right", Number(e.target.value))} fullWidth />
            </Box>
          </Box>
        </Box>

      </Stack>
    </Box>
  );
});

export default SocialIconsWidgetEditor;
